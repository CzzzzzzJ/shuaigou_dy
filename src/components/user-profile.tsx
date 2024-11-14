import { SignInCard } from './sign-in-card';

export function UserProfile() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-semibold text-[#8B7355]">个人中心</h2>
      <SignInCard />
      {/* 其他个人中心内容 */}
    </div>
  );
} 