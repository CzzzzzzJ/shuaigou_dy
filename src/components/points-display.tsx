import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getUserPoints } from '@/lib/db';
import { Coins } from 'lucide-react';
import { useDbUser } from '@/contexts/user-context';

export function PointsDisplay() {
  const { user } = useUser();
  const { dbUser, refreshUser } = useDbUser();
  const [points, setPoints] = useState<number>(0);

  useEffect(() => {
    if (dbUser) {
      setPoints(dbUser.points);
    }
  }, [dbUser]);

  // 每分钟自动刷新一次
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        refreshUser();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [user, refreshUser]);

  return (
    <div className="relative group flex items-center gap-2 h-9 px-3 bg-gradient-to-r from-[#F5D0A9]/10 to-[#FFE4B5]/10 hover:from-[#F5D0A9]/20 hover:to-[#FFE4B5]/20 rounded-md border border-[#F5D0A9]/10 transition-all duration-300">
      <div className="flex items-center justify-center w-5 h-5">
        <Coins className="w-4 h-4 text-[#8B7355]/70" />
      </div>
      <span className="text-sm font-medium text-[#8B7355]">{points}</span>
      
      {/* 悬浮提示 */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-white rounded shadow-sm text-xs text-[#8B7355] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        每日免费积分，0点重置
      </div>
    </div>
  );
} 