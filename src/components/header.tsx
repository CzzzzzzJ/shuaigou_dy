import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="h-16 border-b border-[#E8E3D7] bg-white/50 backdrop-blur-sm flex items-center px-6 justify-between">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="搜索工具..."
          className="w-64 px-4 py-2 rounded-lg border border-[#E8E3D7] bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#F5D0A9] focus:border-transparent"
        />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5 text-[#B4A89A]" />
        </Button>
        <div className="h-8 w-8 rounded-full bg-[#F5D0A9] flex items-center justify-center">
          <span className="text-sm font-medium text-[#8B7355]">SG</span>
        </div>
      </div>
    </header>
  );
}