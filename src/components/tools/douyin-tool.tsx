import { ArrowLeft, Copy, Wand2, Brain, Loader2, ArrowUp, Coins, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { extractDouyinContent, rewriteContent } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useUser, useClerk } from "@clerk/clerk-react";
import { useDbUser } from "@/contexts/user-context";
import { usePoints } from "@/lib/db";

interface DouyinToolProps {
  onBack: () => void;
}

export function DouyinTool({ onBack }: DouyinToolProps) {
  const { isSignedIn, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const { dbUser, refreshUser } = useDbUser();
  const { toast } = useToast();
  
  // 添加所有必要的状态声明
  const [url, setUrl] = useState(() => localStorage.getItem('douyin_url') || '');
  const [title, setTitle] = useState(() => localStorage.getItem('douyin_title') || '');
  const [content, setContent] = useState(() => localStorage.getItem('douyin_content') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewriteInput, setRewriteInput] = useState(() => localStorage.getItem('douyin_rewrite_input') || '');
  const [rewrittenContent, setRewrittenContent] = useState('');
  const [useExtractedContent, setUseExtractedContent] = useState(true);
  const [customContent, setCustomContent] = useState(() => localStorage.getItem('douyin_custom_content') || '');
  
  // 保存状态到 localStorage
  useEffect(() => {
    localStorage.setItem('douyin_url', url);
    localStorage.setItem('douyin_title', title);
    localStorage.setItem('douyin_content', content);
    localStorage.setItem('douyin_rewrite_input', rewriteInput);
    localStorage.setItem('douyin_custom_content', customContent);
  }, [url, title, content, rewriteInput, customContent]);

  const handleExtract = async () => {
    if (!url.trim()) {
      toast({
        title: "请输入视频链接",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await extractDouyinContent(url);
      setTitle(result.title);
      setContent(result.content);
      toast({
        title: "提取成功",
        description: "文案已成功提取",
      });
    } catch (error) {
      toast({
        title: "提取失败",
        description: "请检查链接是否正确",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "复制成功",
        description: "内容已复制到剪贴板",
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "请手动复制内容",
        variant: "destructive",
      });
    }
  };

  const handleRewrite = async () => {
    console.log('Starting rewrite process...');
    
    if (!isLoaded) {
      console.log('User not loaded yet');
      return;
    }
    
    if (!isSignedIn) {
      console.log('User not signed in');
      // 打开登录窗口，并保持在当前页面
      openSignIn({
        redirectUrl: window.location.pathname,
        afterSignInUrl: window.location.pathname,
        appearance: {
          elements: {
            rootBox: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
          },
        },
      });
      return;
    }

    console.log('User status:', { isSignedIn, dbUser });

    if (!dbUser || dbUser.points < 30) {
      console.log('Insufficient points:', dbUser?.points);
      toast({
        title: "积分不足",
        description: "使用 AI 仿写功能需要 30 积分",
        variant: "destructive",
      });
      return;
    }

    const sourceContent = useExtractedContent ? content : customContent;
    console.log('Source content:', sourceContent);
    console.log('Rewrite input:', rewriteInput);
    
    if (!sourceContent) {
      console.log('No source content');
      toast({
        title: useExtractedContent ? "请先提取文案" : "请输入需要仿写的文案",
        variant: "destructive",
      });
      return;
    }

    if (!rewriteInput) {
      console.log('No rewrite input');
      toast({
        title: "请输入仿写要求",
        variant: "destructive",
      });
      return;
    }

    setIsRewriting(true);
    try {
      console.log('Calling rewriteContent API...');
      const result = await rewriteContent(sourceContent, rewriteInput);
      console.log('API result:', result);
      
      console.log('Attempting to deduct points...');
      const success = await usePoints(dbUser.clerk_id, 30);
      
      if (!success) {
        throw new Error('积分扣除失败');
      }
      
      console.log('Points deducted successfully');
      
      await refreshUser();
      
      setRewrittenContent(result.content);
      
      toast({
        title: "仿写成功",
        description: "新文案已生成，已扣除 30 积分",
      });
    } catch (error: unknown) {
      console.error('Rewrite error:', error);
      toast({
        title: "仿写失败",
        description: error instanceof Error ? error.message : "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsRewriting(false);
    }
  };

  // 清理函数
  useEffect(() => {
    return () => {
      // 组件卸载时不清除 localStorage，保持用户输入
    };
  }, []);

  return (
    <div className="flex-1 overflow-auto bg-[#FFFCF5] p-6">
      {/* 顶部导航 */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-[#8B7355] hover:bg-[#FFF8E7]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold text-[#8B7355]">AI 文案助手</h1>
      </div>

      {/* 流程步骤容 */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 步骤 1: 文案提取 */}
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F5D0A9] text-[#8B7355] font-bold">1</div>
            <h2 className="text-xl font-medium text-[#8B7355]">抖音文案提取</h2>
          </div>
          
          {/* URL 输入框 */}
          <Card className="p-6 bg-white/50 backdrop-blur-sm border-[#E8E3D7] relative overflow-hidden">
            <div className="flex gap-4">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="请输入抖音视频链接..."
                className="flex-1 border-[#E8E3D7] bg-white/80 focus:ring-[#F5D0A9]"
              />
              <Button 
                className="bg-[#F5D0A9] text-[#8B7355] hover:bg-[#F5D0A9]/90 min-w-[100px]"
                onClick={handleExtract}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>提取中</span>
                  </div>
                ) : '提取文案'}
              </Button>
            </div>
          </Card>

          {/* 提取结果 */}
          <Card className="mt-4 p-6 bg-white/50 backdrop-blur-sm border-[#E8E3D7] relative">
            {/* 标题部分 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-[#8B7355]">视频标题</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-[#8B7355]"
                  onClick={() => copyToClipboard(title)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="视频标题将在这里显示..."
                className="h-10 min-h-[40px] resize-none border-[#E8E3D7] bg-white/80 focus:ring-[#F5D0A9]"
              />
            </div>

            {/* 分隔线 */}
            <div className="h-px bg-[#E8E3D7] mb-6" />

            {/* 正文部分 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-[#8B7355]">文案正文</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-[#8B7355]"
                  onClick={() => copyToClipboard(content)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="文案正文将在这里显示..."
                className="min-h-[240px] border-[#E8E3D7] bg-white/80 focus:ring-[#F5D0A9]"
              />
            </div>

            {/* 加载状态遮罩 */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-[inherit]">
                <div className="flex flex-col items-center gap-6 p-8 bg-white/80 rounded-2xl shadow-lg">
                  <div className="relative">
                    {/* 外层光晕效果 */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#F5D0A9]/40 to-[#FFE4B5]/40 rounded-full opacity-75 blur-lg animate-pulse"></div>
                    {/* 主要加载动画 */}
                    <div className="relative">
                      <div className="h-16 w-16">
                        {/* 外圈旋转 */}
                        <div className="absolute h-16 w-16 rounded-full border-4 border-[#F5D0A9] border-t-transparent animate-spin"></div>
                        {/* 中圈旋转 */}
                        <div className="absolute h-12 w-12 m-2 rounded-full border-4 border-[#8B7355] border-b-transparent animate-spin-reverse"></div>
                        {/* 内圈旋转 */}
                        <div className="absolute h-8 w-8 m-4 rounded-full border-4 border-[#F5D0A9] border-l-transparent animate-spin-slow"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-[#8B7355] font-medium">正在智能提取文案</p>
                    <p className="text-[#B4A89A] text-sm animate-pulse">请稍候...</p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* 连接线 */}
          <div className="absolute left-4 top-[100%] w-px h-8 bg-[#E8E3D7]" />
        </div>

        {/* 步骤 2: AI 仿写 */}
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F5D0A9] text-[#8B7355] font-bold">2</div>
            <h2 className="text-xl font-medium text-[#8B7355]">AI 文案仿写</h2>
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-[#FFF8E7] rounded-full border border-[#F5D0A9]/30">
              <Coins className="w-4 h-4 text-[#8B7355]" />
              <span className="text-sm text-[#8B7355]">消耗 30 积分</span>
            </div>
          </div>

          <Card className="p-6 bg-white/50 backdrop-blur-sm border-[#E8E3D7]">
            <div className="space-y-6">
              {/* 文案来源选择 */}
              <div className="p-4 rounded-lg border border-[#E8E3D7] bg-gradient-to-br from-white to-[#FFF8E7]">
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    variant={useExtractedContent ? "default" : "outline"}
                    onClick={() => setUseExtractedContent(true)}
                    className={cn(
                      "flex-1 transition-all duration-300",
                      useExtractedContent
                        ? "bg-[#F5D0A9] text-[#8B7355] hover:bg-[#F5D0A9]/90 shadow-md"
                        : "hover:bg-[#F5D0A9]/10"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      <span>使用提取的文案</span>
                    </div>
                  </Button>
                  <Button
                    variant={!useExtractedContent ? "default" : "outline"}
                    onClick={() => setUseExtractedContent(false)}
                    className={cn(
                      "flex-1 transition-all duration-300",
                      !useExtractedContent
                        ? "bg-[#F5D0A9] text-[#8B7355] hover:bg-[#F5D0A9]/90 shadow-md"
                        : "hover:bg-[#F5D0A9]/10"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Wand2 className="h-4 w-4" />
                      <span>自定义文案</span>
                    </div>
                  </Button>
                </div>

                {/* 文案内容展示/输入框 */}
                {useExtractedContent ? (
                  <div className="relative group">
                    <Textarea
                      value={content}
                      readOnly
                      placeholder="请先提取文案..."
                      className="min-h-[120px] border-[#E8E3D7] bg-white/80 focus:ring-[#F5D0A9] transition-all duration-300 group-hover:bg-white/90"
                    />
                    {!content && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-md">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-sm">
                          <ArrowUp className="h-4 w-4 text-[#8B7355] animate-bounce" />
                          <p className="text-[#8B7355]/70">请先完成步骤 1 的文案提取</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Textarea
                    value={customContent}
                    onChange={(e) => setCustomContent(e.target.value)}
                    placeholder="请输入需要仿写的文案..."
                    className="min-h-[120px] border-[#E8E3D7] bg-white/80 focus:ring-[#F5D0A9] transition-all duration-300 hover:bg-white/90"
                  />
                )}
              </div>

              {/* 仿写要求输入 */}
              <div className="space-y-2">
                <Label className="text-[#8B7355] flex items-center gap-2">
                  <Wand2 className="h-4 w-4" />
                  <span>仿写要求</span>
                </Label>
                <div className="relative">
                  <Textarea
                    value={rewriteInput}
                    onChange={(e) => setRewriteInput(e.target.value)}
                    placeholder="请输入您的仿写需求（例如：改成卖汉服的）..."
                    className="border-[#E8E3D7] bg-white/80 focus:ring-[#F5D0A9] transition-all duration-300 hover:bg-white/90"
                  />
                  <div className="absolute right-2 top-2 flex items-center gap-1 px-2 py-1 bg-[#FFF8E7] rounded-full text-xs text-[#8B7355]/70">
                    <Info className="w-3 h-3" />
                    <span>每次生成消耗 30 积分</span>
                  </div>
                </div>
              </div>

              {/* 生成按钮 */}
              <div className="flex justify-center">
                <Button 
                  className={cn(
                    "px-8 bg-[#F5D0A9] text-[#8B7355] hover:bg-[#F5D0A9]/90 transition-all duration-300",
                    "shadow-[0_0_0_0_rgba(245,208,169,0.3)] hover:shadow-[0_0_0_8px_rgba(245,208,169,0)]",
                    "animate-pulse-shadow"
                  )}
                  onClick={handleRewrite}
                  disabled={isRewriting}
                >
                  {isRewriting ? (
                    <div className="flex items-center gap-2">
                      <div className="relative w-4 h-4">
                        <div className="absolute inset-0 rounded-full border-2 border-[#8B7355] border-l-transparent animate-spin" />
                      </div>
                      <span>生成中...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Wand2 className="h-4 w-4" />
                      <span>开始仿写</span>
                    </div>
                  )}
                </Button>
              </div>

              {/* 仿写结果 */}
              {(rewrittenContent || isRewriting) && (
                <div className="mt-6 space-y-2 p-4 bg-[#FFF8E7] rounded-lg border border-[#E8E3D7]">
                  <div className="flex items-center justify-between">
                    <Label className="text-[#8B7355] font-medium flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      <span>AI 仿写结果</span>
                    </Label>
                    {rewrittenContent && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#8B7355] hover:bg-[#F5D0A9]/20"
                        onClick={() => copyToClipboard(rewrittenContent)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Textarea
                    value={rewrittenContent}
                    readOnly
                    placeholder={isRewriting ? "正在生成中..." : "仿写结果将在这里显示..."}
                    className="min-h-[200px] border-[#E8E3D7] bg-white/80 focus:ring-[#F5D0A9]"
                  />
                  {isRewriting && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-md">
                      <div className="flex flex-col items-center gap-4 p-6 bg-white/90 rounded-xl shadow-lg">
                        <div className="relative">
                          <div className="absolute -inset-4 bg-gradient-to-r from-[#F5D0A9]/40 to-[#FFE4B5]/40 rounded-full opacity-75 blur-lg animate-pulse" />
                          <div className="relative w-12 h-12">
                            <div className="absolute inset-0 rounded-full border-4 border-[#F5D0A9] border-t-transparent animate-spin" />
                            <div className="absolute inset-2 rounded-full border-4 border-[#8B7355] border-b-transparent animate-spin-reverse" />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-[#8B7355] font-medium">AI 正在创作中</p>
                          <p className="text-[#B4A89A] text-sm animate-pulse">请稍候...</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}