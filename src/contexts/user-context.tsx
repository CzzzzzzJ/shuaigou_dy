import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { createUser, getUserByClerkId } from '@/lib/db';
import type { DbUser } from '@/types/user';

interface UserContextType {
  dbUser: DbUser | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// 创建本地缓存
const CACHE_KEY = 'user_data';
const CACHE_DURATION = 1000 * 60 * 5; // 5分钟缓存

function getCachedUser(): DbUser | null {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;
  
  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_DURATION) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
  
  return data;
}

function cacheUser(user: DbUser) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    data: user,
    timestamp: Date.now()
  }));
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [dbUser, setDbUser] = useState<DbUser | null>(() => getCachedUser());
  const [isLoading, setIsLoading] = useState(!dbUser);

  const refreshUser = async () => {
    if (!user) return;

    try {
      // 先尝试获取用户
      let userData = await getUserByClerkId(user.id);
      
      // 如果用户不存在，创建新用户
      if (!userData) {
        userData = await createUser(
          user.id,
          user.primaryEmailAddress?.emailAddress || '',
          user.fullName || '',
          user.imageUrl
        );
      }
      
      if (userData) {
        setDbUser(userData);
        cacheUser(userData);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && !dbUser) {
      refreshUser();
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ dbUser, isLoading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useDbUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useDbUser must be used within a UserProvider');
  }
  return context;
}; 