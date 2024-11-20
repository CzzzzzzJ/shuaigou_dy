import { ArrowLeft, Copy, Wand2, Brain, Loader2, Image, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface XiaohongshuToolProps {
  onBack: () => void;
}

// 模板数据
const TEMPLATES = [
  {
    id: 'template1',
    name: '日常随拍',
    thumbnail: '/templates/daily.jpg',
  },
  {
    id: 'template2',
    name: '美食探店',
    thumbnail: '/templates/food.jpg',
  },
  {
    id: 'template3',
    name: '穿搭分享',
    thumbnail: '/templates/fashion.jpg',
  },
  {
    id: 'template4',
    name: '种草测评',
    thumbnail: '/templates/review.jpg',
  },
];

export function XiaohongshuTool({ onBack }: XiaohongshuToolProps) {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0].id);
  const [imageUrls, setImageUrls] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');

  const handleGenerate = async () => {
    if (!imageUrls.trim()) {
      toast({
        title: "请输入图片链接",
        variant: "destructive",
      });
      return;
    }

    if (!sourceText.trim()) {
      toast({
        title: "请输入文案素材",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // TODO: 调用生成 API
      await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟 API 调用
      
      // 模拟生成结果
      setGeneratedImages(['/demo-note.jpg']);
      setGeneratedTitle('这是一个生成的标题');
      setGeneratedContent('这是生成的正文内容...');
      
      toast({
        title: "生成成功",
        description: "笔记已生成",
      });
    } catch (error) {
      toast({
        title: "生成失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
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

  return (
    <div className="flex-1 overflow-hidden bg-[#FFFCF5] px-3 py-4 md:p-6">
      {/* 顶部导航 */}
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-[#8B7355] hover:bg-[#FFF8E7] h-8 w-8 md:h-10 md:w-10"
        >
          <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
        <h1 className="text-lg md:text-2xl font-semibold text-[#8B7355]">小红书笔记生成</h1>
      </div>

      {/* 主要内容区域 */}
      <div className="h-[calc(100%-4rem)] flex gap-4 md:gap-6">
        {/* 左侧输入区域 */}
        <div className="w-full md:w-1/2 flex flex-col gap-4 overflow-auto">
          {/* 模板选择 */}
          <Card className="p-4 bg-white/50 backdrop-blur-sm border-[#E8E3D7]">
            <Label className="text-[#8B7355] mb-3 block">选择模板</Label>
            <Tabs defaultValue={selectedTemplate} onValueChange={setSelectedTemplate}>
              <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {TEMPLATES.map((template) => (
                  <TabsTrigger
                    key={template.id}
                    value={template.id}
                    className="relative aspect-square p-0 overflow-hidden"
                  >
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-white text-sm">{template.name}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </Card>

          {/* 图片输入 */}
          <Card className="p-4 bg-white/50 backdrop-blur-sm border-[#E8E3D7]">
            <Label className="text-[#8B7355] flex items-center gap-2 mb-3">
              <Image className="h-4 w-4" />
              <span>图片素材</span>
            </Label>
            <Textarea
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
              placeholder="请输入图片链接，多个链接请换行分隔..."
              className="min-h-[100px] border-[#E8E3D7] bg-white/80 focus:ring-[#F5D0A9]"
            />
          </Card>

          {/* 文本输入 */}
          <Card className="p-4 bg-white/50 backdrop-blur-sm border-[#E8E3D7]">
            <Label className="text-[#8B7355] flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4" />
              <span>文案素材</span>
            </Label>
            <Textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="请输入文案素材..."
              className="min-h-[200px] border-[#E8E3D7] bg-white/80 focus:ring-[#F5D0A9]"
            />
          </Card>

          {/* 生成按钮 */}
          <Button 
            className="bg-[#F5D0A9] text-[#8B7355] hover:bg-[#F5D0A9]/90 h-10"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>生成中...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                <span>开始生成</span>
              </div>
            )}
          </Button>
        </div>

        {/* 右侧预览区域 */}
        <div className="hidden md:flex w-1/2 flex-col gap-4">
          <Card className="flex-1 p-4 bg-white/50 backdrop-blur-sm border-[#E8E3D7] overflow-auto">
            {generatedImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {generatedImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Generated ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-[#8B7355]/50">
                生成的笔记图片将在这里显示
              </div>
            )}
          </Card>

          <Card className="p-4 bg-white/50 backdrop-blur-sm border-[#E8E3D7]">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-[#8B7355]">笔记标题</Label>
              {generatedTitle && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#8B7355]"
                  onClick={() => copyToClipboard(generatedTitle)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Input
              value={generatedTitle}
              readOnly
              placeholder="生成的标题将在这里显示..."
              className="border-[#E8E3D7] bg-white/80"
            />
          </Card>

          <Card className="p-4 bg-white/50 backdrop-blur-sm border-[#E8E3D7]">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-[#8B7355]">笔记正文</Label>
              {generatedContent && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#8B7355]"
                  onClick={() => copyToClipboard(generatedContent)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Textarea
              value={generatedContent}
              readOnly
              placeholder="生成的正文将在这里显示..."
              className="min-h-[200px] border-[#E8E3D7] bg-white/80"
            />
          </Card>
        </div>
      </div>
    </div>
  );
} 