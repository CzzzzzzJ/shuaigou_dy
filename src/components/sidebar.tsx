import { Home, Video, BookOpen, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: Home, label: '主页', active: true },
  { icon: Video, label: '抖音工具', active: false },
  { icon: BookOpen, label: '小红书工具', active: false },
  { icon: Settings, label: '设置', active: false },
];

export function Sidebar() {
  return (
    <div className="w-64 border-r border-[#E8E3D7] bg-white flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-[#E8E3D7]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#F5D0A9] flex items-center justify-center">
            <span className="text-[#8B7355] font-bold">SG</span>
          </div>
          <span className="font-semibold text-[#8B7355]">帅狗工具</span>
        </div>
      </div>
      <nav className="flex-1 pt-4">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={cn(
              'flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors',
              item.active
                ? 'bg-[#FFF8E7] text-[#8B7355]'
                : 'text-[#B4A89A] hover:bg-[#FFF8E7] hover:text-[#8B7355]'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}