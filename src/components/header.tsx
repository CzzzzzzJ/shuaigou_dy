import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"
import { UserButton, SignInButton, useUser } from "@clerk/clerk-react"

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const navigate = useNavigate()
  const { isSignedIn } = useUser()

  return (
    <header className={cn("flex h-16 items-center justify-between border-b px-6", className)}>
      <div 
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" 
        onClick={() => navigate('/')}
      >
        <div className="h-8 w-8 rounded-lg bg-[#F5D0A9] flex items-center justify-center">
          <span className="text-[#8B7355] font-bold">AI</span>
        </div>
        <span className="text-lg font-medium text-[#8B7355]">帅狗AIGC</span>
      </div>

      <div className="flex items-center gap-4">
        {isSignedIn ? (
          <>
            <Button 
              variant="ghost" 
              className="text-[#8B7355]"
              onClick={() => navigate('/profile')}
            >
              个人中心
            </Button>
            <UserButton afterSignOutUrl="/" />
          </>
        ) : (
          <SignInButton mode="modal">
            <Button className="bg-[#F5D0A9] text-[#8B7355]">
              登录
            </Button>
          </SignInButton>
        )}
      </div>
    </header>
  )
}