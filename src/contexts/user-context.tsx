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
    if (!user) return;

    try {
      // 尝试获取用户
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
      
      setDbUser(userData);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  useEffect(() => {
    if (user) {
      refreshUser();
    }
    setIsLoading(false);
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