import { Button } from '@/components/ui/button';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { PointsDisplay } from './points-display';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

export function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E8E3D7] bg-white/50 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo 部分 */}
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
            <img 
              src="/logo-removebg.png" 
              alt="Shuaigou AIGC" 
              className="h-12 w-auto object-contain"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))',
                transform: 'translateY(-1px)'
              }}
            />
            <div className="hidden md:flex flex-col justify-center">
              <span className="text-lg font-semibold text-[#8B7355]">SHUAIGOU AIGC</span>
            </div>
          </a>
        </div>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <PointsDisplay />
              <Link 
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#8B7355] hover:bg-[#FFF8E7] rounded-md transition-colors duration-200"
              >
                <User className="w-4 h-4" />
                <span className="hidden md:inline">个人中心</span>
              </Link>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-full border-2 border-[#F5D0A9]"
                  }
                }} 
              />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-[#8B7355] hover:bg-[#FFF8E7]">
                  登录
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="bg-[#F5D0A9] text-[#8B7355] hover:bg-[#F5D0A9]/90">
                  注册
                </Button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}