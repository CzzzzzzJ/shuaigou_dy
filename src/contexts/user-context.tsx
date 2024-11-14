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
      // 使用 db.ts 中的函数获取用户数据
      let userData = await getUserByClerkId(user.id);
      
      // 如果用户不存在，创建新用户
      if (!userData && user.emailAddresses[0]?.emailAddress) {
        console.log('Creating new user...');
        userData = await createUser(
          user.id,
          user.emailAddresses[0].emailAddress,
          user.fullName || 'User',
          user.imageUrl
        );
      }

      if (userData) {
        console.log('User data updated:', userData);
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