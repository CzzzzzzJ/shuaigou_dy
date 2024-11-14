import { ArrowLeft, Copy, Wand2, Brain, Loader2 } from 'lucide-react';
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
import { useState } from 'react';
import { extractDouyinContent, rewriteContent } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

interface DouyinToolProps {
  onBack: () => void;
}

export function DouyinTool({ onBack }: DouyinToolProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewriteInput, setRewriteInput] = useState('');
  const [rewrittenContent, setRewrittenContent] = useState('');
  const [useExtractedContent, setUseExtractedContent] = useState(true);
  const [customContent, setCustomContent] = useState('');
  const { toast } = useToast();

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
    const sourceContent = useExtractedContent ? content : customContent;
    
    if (!sourceContent) {
      toast({
        title: useExtractedContent ? "请先提取文案" : "请输入需要仿写的文案",
        variant: "destructive",
      });
      return;
    }

    if (!rewriteInput) {
      toast({
        title: "请输入仿写要求",
        variant: "destructive",
      });
      return;
    }

    setIsRewriting(true);
    try {
      const result = await rewriteContent(sourceContent, rewriteInput);
      setRewrittenContent(result.content);
      toast({
        title: "仿写成功",
        description: "新文案已生成",
      });
    } catch (error) {
      toast({
        title: "仿写失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsRewriting(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-[#FFFCF5] p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-[#8B7355] hover:bg-[#FFF8E7]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold text-[#8B7355]">抖音文案提取</h1>
      </div>

      {/* URL Input Section */}
      <Card className="p-6 bg-white/50 backdrop-blur-sm border-[#E8E3D7] mb-6 relative overflow-hidden">
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

      {/* Content Display Section */}
      <Card className="p-6 bg-white/50 backdrop-blur-sm border-[#E8E3D7] relative">
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

      {/* AI Analysis Section */}
      <Accordion type="single" collapsible className="mt-6">
        <AccordionItem value="ai-analysis" className="border-[#E8E3D7]">
          <AccordionTrigger className="text-[#8B7355] hover:text-[#8B7355] hover:no-underline">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              <span>AI 智能分析</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card className="p-6 bg-white/50 backdrop-blur-sm border-[#E8E3D7]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-[#8B7355]">文案结构分析</h3>
                  <p className="text-[#B4A89A]">AI将分析文案的开头、主体、结尾结构</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-[#8B7355]">情感基调分析</h3>
                  <p className="text-[#B4A89A]">分析文案的情感倾向和表达方式</p>
                </div>
              </div>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ai-rewrite" className="border-[#E8E3D7]">
          <AccordionTrigger className="text-[#8B7355] hover:text-[#8B7355] hover:no-underline">
            <div className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              <span>AI 文案仿写</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card className="p-6 bg-white/50 backdrop-blur-sm border-[#E8E3D7]">
              <div className="space-y-6">
                {/* 文案来源选择 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant={useExtractedContent ? "default" : "outline"}
                      onClick={() => setUseExtractedContent(true)}
                      className="flex-1 bg-[#F5D0A9] text-[#8B7355] hover:bg-[#F5D0A9]/90"
                    >
                      使用提取的文案
                    </Button>
                    <Button
                      variant={!useExtractedContent ? "default" : "outline"}
                      onClick={() => setUseExtractedContent(false)}
                      className="flex-1 bg-[#F5D0A9] text-[#8B7355] hover:bg-[#F5D0A9]/90"
                    >
                      自定义文案
                    </Button>
                  </div>

                  {/* 显示选中的文案 */}
                  {useExtractedContent ? (
                    <div className="relative">
                      <Textarea
                        value={content}
                        readOnly
                        placeholder="请先提取文案..."
                        className="min-h-[120px] border-[#E8E3D7] bg-white/80 focus:ring-[#F5D0A9]"
                      />
                      {!content && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-md">
                          <p className="text-[#8B7355]/70">请先在上方提取文案</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Textarea
                      value={customContent}
                      onChange={(e) => setCustomContent(e.target.value)}
                      placeholder="请输入需要仿写的文案..."
                      className="min-h-[120px] border-[#E8E3D7] bg-white/80 focus:ring-[#F5D0A9]"
                    />
                  )}
                </div>

                {/* 仿写要求输入 */}
                <div className="space-y-2">
                  <Label className="text-[#8B7355]">仿写要求</Label>
                  <Textarea
                    value={rewriteInput}
                    onChange={(e) => setRewriteInput(e.target.value)}
                    placeholder="请输入您的仿写需求（例如：改成卖汉服的）..."
                    className="border-[#E8E3D7] bg-white/80 focus:ring-[#F5D0A9]"
                  />
                </div>

                {/* 生成按钮 */}
                <Button 
                  className="w-full bg-[#F5D0A9] text-[#8B7355] hover:bg-[#F5D0A9]/90"
                  onClick={handleRewrite}
                  disabled={isRewriting}
                >
                  {isRewriting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>生成中...</span>
                    </div>
                  ) : '开始仿写'}
                </Button>

                {/* 仿写结果 */}
                {rewrittenContent && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-[#8B7355]">仿写结果</Label>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#8B7355]"
                        onClick={() => copyToClipboard(rewrittenContent)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={rewrittenContent}
                      readOnly
                      className="min-h-[200px] border-[#E8E3D7] bg-white/80"
                    />
                  </div>
                )}
              </div>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}