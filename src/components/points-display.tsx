import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getUserPoints } from '@/lib/db';
import { Coins, RefreshCw } from 'lucide-react';

// 本地存储键
const STORAGE_KEY = 'user_points';

export function PointsDisplay() {
  const { user } = useUser();
  const [points, setPoints] = useState<number>(() => {
    // 从本地存储初始化
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored).points : 0;
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function fetchPoints() {
    if (!user) return;
    
    setIsRefreshing(true);
    try {
      const userPoints = await getUserPoints(user.id);
      setPoints(userPoints);
      // 更新本地存储
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        points: userPoints,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error fetching points:', error);
    } finally {
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    // 检查本地存储是否过期
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const { timestamp } = JSON.parse(stored);
      const isExpired = Date.now() - timestamp > 60000; // 1分钟过期
      if (isExpired) {
        fetchPoints();
      }
    } else {
      fetchPoints();
    }

    // 每分钟更新一次
    const interval = setInterval(fetchPoints, 60000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div 
      className="relative group flex items-center gap-2 h-9 px-3 bg-gradient-to-r from-[#F5D0A9]/10 to-[#FFE4B5]/10 hover:from-[#F5D0A9]/20 hover:to-[#FFE4B5]/20 rounded-md border border-[#F5D0A9]/10 transition-all duration-300"
      title="每日免费积分，每天0点重置"
    >
      {/* 积分图标 */}
      <div className="flex items-center justify-center w-5 h-5">
        <Coins className={`w-4 h-4 text-[#8B7355]/70 ${isRefreshing ? 'animate-pulse' : ''}`} />
      </div>
      
      {/* 积分数值 */}
      <div className="flex items-center gap-1.5">
        <span className={`text-sm font-medium text-[#8B7355] ${isRefreshing ? 'opacity-70' : ''}`}>
          {points}
        </span>
        <button 
          onClick={() => {
            if (!isRefreshing) fetchPoints();
          }}
          className="p-0.5 rounded-full hover:bg-[#F5D0A9]/20 transition-colors disabled:opacity-50"
          disabled={isRefreshing}
        >
          <RefreshCw 
            className={`w-3 h-3 text-[#8B7355]/50 ${
              isRefreshing ? 'animate-spin' : 'hover:text-[#8B7355]'
            }`}
          />
        </button>
      </div>

      {/* 装饰效果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#F5D0A9]/5 to-[#FFE4B5]/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
} 