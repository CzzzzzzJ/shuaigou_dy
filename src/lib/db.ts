import { createClient } from '@supabase/supabase-js';
import type { DbUser } from '@/types/user';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// 创建 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

// 缓存配置
const CACHE_DURATION = 1000 * 60; // 1分钟缓存
const POINTS_CACHE = new Map<string, { points: number; timestamp: number }>();
const QUERY_CACHE = new Map<string, { data: any; timestamp: number }>();

// 通用缓存查询函数
async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>
): Promise<T> {
  const cached = QUERY_CACHE.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const data = await queryFn();
  QUERY_CACHE.set(key, { data, timestamp: Date.now() });
  return data;
}

// 创建或更新用户
export async function createUser(
  clerkId: string,
  email: string,
  name: string,
  avatarUrl?: string
): Promise<DbUser | null> {
  try {
    console.log('Creating/updating user with name:', name);

    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          clerk_id: clerkId,
          email,
          name: name || '未命名用户',
          avatar_url: avatarUrl,
          membership_type: 'free',
          daily_extractions: 0,
          points: 100,
          points_reset_date: new Date().toISOString()
        },
        { 
          onConflict: 'clerk_id',
          ignoreDuplicates: false
        }
      )
      .select('*')
      .single();

    if (error) {
      console.error('Error creating/updating user:', error);
      throw error;
    }

    console.log('User created/updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

// 根据 Clerk ID 获取用户
export async function getUserByClerkId(clerkId: string): Promise<DbUser | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

// 获取用户积分
export async function getUserPoints(clerkId: string): Promise<number> {
  try {
    // 检查缓存
    const cached = POINTS_CACHE.get(clerkId);
    const now = Date.now();
    if (cached && now - cached.timestamp < CACHE_DURATION) {
      return cached.points;
    }

    const { data, error } = await supabase
      .from('users')
      .select('points, points_reset_date')
      .eq('clerk_id', clerkId)
      .single();

    if (error) throw error;

    // 检查是否需要重置积分
    const resetDate = new Date(data.points_reset_date);
    const today = new Date();
    if (resetDate.getDate() !== today.getDate()) {
      await resetUserPoints(clerkId);
      POINTS_CACHE.set(clerkId, { points: 100, timestamp: now });
      return 100;
    }

    // 更新缓存
    POINTS_CACHE.set(clerkId, { points: data.points, timestamp: now });
    return data.points;
  } catch (error) {
    console.error('Error getting user points:', error);
    return 0;
  }
}

// 重置用户积分
export async function resetUserPoints(clerkId: string): Promise<void> {
  try {
    await supabase
      .from('users')
      .update({
        points: 100,
        points_reset_date: new Date().toISOString()
      })
      .eq('clerk_id', clerkId);
    
    // 更新缓存
    POINTS_CACHE.set(clerkId, { points: 100, timestamp: Date.now() });
  } catch (error) {
    console.error('Error resetting user points:', error);
  }
}

// 使用积分
export async function usePoints(clerkId: string, amount: number): Promise<boolean> {
  try {
    console.log('Deducting points for user:', clerkId, 'amount:', amount);

    // 先获取当前积分
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('points')
      .eq('clerk_id', clerkId)
      .single();

    if (fetchError || !user) {
      console.error('Error fetching user points:', fetchError);
      return false;
    }

    console.log('Current points:', user.points);

    // 检查积分是否足够
    if (user.points < amount) {
      console.log('Insufficient points');
      return false;
    }

    // 调用存储过程扣除积分
    const { data, error: deductError } = await supabase
      .rpc('deduct_user_points', {
        user_clerk_id: clerkId,
        points_amount: amount
      });

    if (deductError) {
      console.error('Error deducting points:', deductError);
      return false;
    }

    console.log('Points deduction result:', data);

    // 清除缓存
    POINTS_CACHE.delete(clerkId);

    return true;
  } catch (error) {
    console.error('Error using points:', error);
    return false;
  }
}

// 检查今日是否已签到
export async function checkTodaySignIn(clerkId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('last_sign_in_date')
      .eq('clerk_id', clerkId)
      .single();

    if (error) throw error;

    if (!data.last_sign_in_date) return false;

    const lastSignIn = new Date(data.last_sign_in_date);
    const today = new Date();
    
    return lastSignIn.toDateString() === today.toDateString();
  } catch (error) {
    console.error('Error checking sign in status:', error);
    return false;
  }
}

// 执行签到
export async function performSignIn(clerkId: string): Promise<boolean> {
  try {
    const hasSignedIn = await checkTodaySignIn(clerkId);
    if (hasSignedIn) {
      return false;
    }

    const { error } = await supabase.rpc('sign_in_reward', {
      user_clerk_id: clerkId
    });

    if (error) throw error;

    // 清除缓存
    POINTS_CACHE.delete(clerkId);
    
    return true;
  } catch (error) {
    console.error('Error performing sign in:', error);
    return false;
  }
}

// 其他数据库操作函数... 