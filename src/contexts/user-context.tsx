import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getUserByClerkId, createUser } from '@/lib/db';
import type { DbUser } from '@/types/user';

interface UserContextType {
  dbUser: DbUser | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    if (!user) {
      setDbUser(null);
      return;
    }

    try {
      console.log('Refreshing user data for:', user.id);
      // 先尝试获取现有用户数据
      let userData = await getUserByClerkId(user.id);
      
      // 只有在用户完全不存在时才创建新用户
      if (!userData && user.emailAddresses[0]?.emailAddress) {
        console.log('User not found, creating new user...');
        userData = await createUser(
          user.id,
          user.emailAddresses[0].emailAddress,
          user.fullName || 'User',
          user.imageUrl
        );
      } else {
        console.log('Existing user found:', userData);
      }

      if (userData) {
        console.log('Setting user data:', userData);
        setDbUser(userData);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 监听用户变化
  useEffect(() => {
    if (user) {
      refreshUser();
    } else {
      setDbUser(null);
      setIsLoading(false);
    }
  }, [user?.id]); // 只在用户 ID 变化时触发，而不是整个 user 对象

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