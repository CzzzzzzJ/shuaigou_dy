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
    <main className="flex-1 overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-b from-[#FFF8E7] to-[#FFFCF5] flex items-center justify-center overflow-hidden">
        {/* 动态背景效果 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
          {/* 动态光晕效果 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#F5D0A9] opacity-[0.07] rounded-full blur-[100px] animate-pulse-slow" />
          {/* 浮动圆点装饰 */}
          <div className="absolute top-20 left-20 w-3 h-3 bg-[#F5D0A9] rounded-full animate-float-slow" />
          <div className="absolute bottom-40 right-32 w-2 h-2 bg-[#F5D0A9] rounded-full animate-float-delay" />
          <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-[#FFE4B5] rounded-full animate-float" />
          {/* 科技线条 */}
          <div className="absolute inset-0 bg-[url('/tech-pattern.svg')] bg-repeat opacity-[0.03] animate-slide" />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-lg">
            <Sparkles className="h-4 w-4 text-[#F5D0A9] animate-pulse" />
            <span className="text-sm text-[#8B7355]">AI驱动的自媒体创作助手</span>
          </div>
          <h1 className="text-4xl font-bold text-[#8B7355] mb-4 drop-shadow-sm">
          让创作回归简单
          </h1>
          <p className="text-[#B4A89A] text-lg mb-8">
            集成抖音、小红书等平台的创作工具，让您专注于创意本身。
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button 
              className="bg-[#F5D0A9] text-[#8B7355] hover:bg-[#F5D0A9]/90 px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              onClick={() => setActiveToolId('douyin-extractor')}
            >
              开始创作
            </Button>
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div className="relative max-w-6xl mx-auto px-6 py-16">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#F5D0A9] opacity-[0.03] rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 left-0 w-[300px] h-[300px] bg-[#FFE4B5] opacity-[0.05] rounded-full blur-[80px]" />
        </div>

        <div className="relative">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-[#8B7355] mb-4">创作工具</h2>
            <p className="text-[#B4A89A]">选择合适的工具，3分钟完成创意构思</p>
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
                    从抖音视频链接中一键提取文案内容，支持批量处理，让创作更轻松。支持AI仿写，一键模仿爆款，创意信手拈来。
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
                    <h2 className="text-lg font-medium text-[#8B7355]">种草笔记生成器 & 小红书笔记生成</h2>
                  </div>
                  <p className="text-[#B4A89A] mb-6">
                  让你轻松创建精美的种草笔记！只需一键，快速生成吸引眼球的图片和文案，分享你的购物心得与推荐。
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
      </div>
    </main>
  );
}