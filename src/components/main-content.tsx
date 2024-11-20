import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Wand2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { DouyinTool } from './tools/douyin-tool';
import { XiaohongshuTool } from './tools/xiaohongshu-tool';

export function MainContent() {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);

  if (activeToolId === 'douyin-extractor') {
    return <DouyinTool onBack={() => setActiveToolId(null)} />;
  }

  if (activeToolId === 'xiaohongshu-generator') {
    return <XiaohongshuTool onBack={() => setActiveToolId(null)} />;
  }

  return (
    <main className="flex-1 overflow-auto">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-b from-[#FFF8E7] to-[#FFFCF5] flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        </div>
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-[#F5D0A9]" />
            <span className="text-sm text-[#8B7355]">AI驱动的创作助手</span>
          </div>
          <h1 className="text-4xl font-bold text-[#8B7355] mb-4">
            让内容创作更简单、更高效
          </h1>
          <p className="text-[#B4A89A] text-lg mb-8">
            集成抖音、小红书等平台的创作工具，让您专注于创意本身
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button 
              className="bg-[#F5D0A9] text-[#8B7355] hover:bg-[#F5D0A9]/90 px-8 py-6 text-lg"
              onClick={() => setActiveToolId('douyin-extractor')}
            >
              开始创作
            </Button>
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-[#8B7355] mb-4">创作工具</h2>
          <p className="text-[#B4A89A]">选择合适的工具，开启您的创作之旅</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="group p-6 bg-white/50 backdrop-blur-sm border-[#E8E3D7] hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F5D0A9] to-[#FFE4B5] opacity-20 group-hover:opacity-30 rounded-lg blur transition duration-300" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#FFF8E7] rounded-lg">
                    <Upload className="h-6 w-6 text-[#8B7355]" />
                  </div>
                  <h2 className="text-lg font-medium text-[#8B7355]">抖音文案提取 & AI仿写</h2>
                </div>
                <p className="text-[#B4A89A] mb-6">
                  从抖音视频链接中一键提取文案内容，支持批量处理，让创作更轻松。支持AI仿写，让创作更高效。
                </p>
                <Button 
                  className="w-full bg-[#F5D0A9] text-[#8B7355] hover:bg-[#F5D0A9]/90"
                  onClick={() => setActiveToolId('douyin-extractor')}
                >
                  开始提取
                </Button>
              </div>
            </div>
          </Card>

          <Card className="group p-6 bg-white/50 backdrop-blur-sm border-[#E8E3D7] hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F5D0A9] to-[#FFE4B5] opacity-20 group-hover:opacity-30 rounded-lg blur transition duration-300" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#FFF8E7] rounded-lg">
                    <Wand2 className="h-6 w-6 text-[#8B7355]" />
                  </div>
                  <h2 className="text-lg font-medium text-[#8B7355]">种草笔记生成器 & 小红书文案生成</h2>
                </div>
                <p className="text-[#B4A89A] mb-6">
                  上传图片，生成种草笔记，让创作更简单。
                </p>
                <Button 
                  className="w-full bg-[#F5D0A9] text-[#8B7355] hover:bg-[#F5D0A9]/90"
                  onClick={() => setActiveToolId('xiaohongshu-generator')}
                >
                  开始生成
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}