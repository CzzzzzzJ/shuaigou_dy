import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { checkTodaySignIn, performSignIn } from '@/lib/db';
import { useDbUser } from '@/contexts/user-context';
import { Coins, CalendarCheck } from 'lucide-react';

export function SignInCard() {
  const [hasSignedIn, setHasSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { dbUser, refreshUser } = useDbUser();
  const { toast } = useToast();

  useEffect(() => {
    if (dbUser) {
      checkTodaySignIn(dbUser.clerk_id).then(setHasSignedIn);
    }
  }, [dbUser]);

  const handleSignIn = async () => {
    if (!dbUser) return;
    
    setIsLoading(true);
    try {
      const success = await performSignIn(dbUser.clerk_id);
      
      if (success) {
        await refreshUser();
        setHasSignedIn(true);
        toast({
          title: "签到成功",
          description: "获得 100 积分奖励！",
        });
      } else {
        toast({
          title: "签到失败",
          description: "今日已经签到过了",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "签到失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-white/50 backdrop-blur-sm border-[#E8E3D7]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#F5D0A9]/20 rounded-lg">
            <CalendarCheck className="w-6 h-6 text-[#8B7355]" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-[#8B7355]">每日签到</h3>
            <p className="text-sm text-[#8B7355]/70">每天登录签到可获得 100 积分</p>
          </div>
        </div>
        <Button
          onClick={handleSignIn}
          disabled={hasSignedIn || isLoading}
          className={`min-w-[120px] ${
            hasSignedIn 
              ? 'bg-[#E8E3D7] text-[#8B7355]/50' 
              : 'bg-[#F5D0A9] text-[#8B7355] hover:bg-[#F5D0A9]/90'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>签到中...</span>
            </div>
          ) : hasSignedIn ? (
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4" />
              <span>已签到</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4" />
              <span>立即签到</span>
            </div>
          )}
        </Button>
      </div>
    </Card>
  );
} 