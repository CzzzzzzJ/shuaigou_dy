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
    persistSession: false // 禁用会话持久化
  }
});

// 插入新用户
export async function createUser(
  clerkId: string,
  email: string,
  name: string,
  avatarUrl?: string
): Promise<DbUser | null> {
  try {
    console.log('Creating user:', { clerkId, email, name });
    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          clerk_id: clerkId,
          email,
          name,
          avatar_url: avatarUrl,
          membership_type: 'free',
          daily_extractions: 0,
        },
        { 
          onConflict: 'clerk_id',
          ignoreDuplicates: false
        }
      )
      .select('*')
      .single();

    if (error) throw error;
    console.log('User created:', data);
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
      .maybeSingle(); // 使用 maybeSingle 而不是 single

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

// 更新用户每日提取次数
export async function updateUserExtractions(clerkId: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('increment_user_extractions', {
      user_clerk_id: clerkId
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  }
} 