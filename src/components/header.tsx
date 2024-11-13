import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className={cn("flex h-16 items-center border-b px-6", className)}>
      <div 
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" 
        onClick={() => navigate('/')}
      >
        <img 
          src="/logo.svg" 
          alt="帅狗AIGC" 
          className="h-8 w-8"
        />
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-[#8B7355]">帅狗AIGC</span>
          <span className="text-xs text-[#B4A89A]">AI驱动的创作助手</span>
        </div>
      </div>
    </header>
  )
}