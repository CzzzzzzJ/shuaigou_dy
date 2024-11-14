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

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    if (!user) {
      setDbUser(null);
      setIsLoading(false);
      return;
    }

    try {
      console.log('Refreshing user data for:', user.id);
      
      // 先获取现有用户数据
      let userData = await getUserByClerkId(user.id);
      
      // 检查用户信息是否需要更新
      if (userData) {
        const needsUpdate = 
          userData.name !== user.fullName || 
          userData.email !== user.primaryEmailAddress?.emailAddress ||
          userData.avatar_url !== user.imageUrl;

        if (needsUpdate) {
          console.log('Updating user info...');
          userData = await createUser(
            user.id,
            user.primaryEmailAddress?.emailAddress || '',
            user.fullName || user.username || userData.name, // 保留原有名称作为后备
            user.imageUrl
          );
        }
      } else {
        // 创建新用户
        console.log('Creating new user...');
        userData = await createUser(
          user.id,
          user.primaryEmailAddress?.emailAddress || '',
          user.fullName || user.username || 'User',
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

  // 监听用户信息变化
  useEffect(() => {
    if (user) {
      refreshUser();
    } else {
      setDbUser(null);
      setIsLoading(false);
    }
  }, [
    user?.id,
    user?.fullName,
    user?.primaryEmailAddress?.emailAddress,
    user?.imageUrl
  ]); // 监听所有可能变化的用户信息

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