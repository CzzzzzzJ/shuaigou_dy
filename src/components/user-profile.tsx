import { SignInCard } from './sign-in-card';
import { MessageCircle, Users } from 'lucide-react';

export function UserProfile() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-semibold text-[#8B7355]">个人中心</h2>
      <SignInCard />
      
      {/* 联系方式卡片 */}
      <div className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-lg border border-[#E8E3D7]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#FFF8E7] rounded-lg">
            <MessageCircle className="h-5 w-5 text-[#8B7355]" />
          </div>
          <h3 className="text-lg font-medium text-[#8B7355]">联系我们</h3>
        </div>
        
        <p className="text-[#B4A89A] leading-relaxed mb-6 max-w-2xl">
          如果您对我们的工具有任何建议或反馈，欢迎联系作者进行交流。我们会认真听取每一位用户的意见，不断改进产品体验。
        </p>
        
        <div className="flex flex-wrap gap-8 justify-center md:justify-start">
          {/* 个人二维码 */}
          <div className="flex flex-col items-center">
            <div className="p-3 bg-white rounded-lg border border-[#E8E3D7] shadow-sm mb-2 hover:shadow-md transition-shadow duration-300">
              <img 
                src="/self_qr.png" 
                alt="作者微信" 
                className="w-32 h-32 object-cover"
              />
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[#8B7355]">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>添加作者微信</span>
            </div>
          </div>

          {/* 社群二维码 */}
          <div className="flex flex-col items-center">
            <div className="p-3 bg-white rounded-lg border border-[#E8E3D7] shadow-sm mb-2 hover:shadow-md transition-shadow duration-300">
              <img 
                src="/cox_qr.png" 
                alt="社群二维码" 
                className="w-32 h-32 object-cover"
              />
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[#8B7355]">
              <Users className="h-3.5 w-3.5" />
              <span>加入用户交流群</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-xs text-[#B4A89A] text-center md:text-left">
          * 添加时请注明来意，感谢您的支持！
        </div>
      </div>
    </div>
  );
} 