import { useUser, SignInButton, SignOutButton } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function UserProfile() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="flex justify-center p-4">
        <SignInButton>
          <Button>登录</Button>
        </SignInButton>
      </div>
    );
  }

  return (
    <Card className="p-6 m-4">
      <div className="flex items-center gap-4">
        <img 
          src={user.imageUrl} 
          alt={user.fullName || '用户头像'} 
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-xl font-semibold">{user.fullName}</h2>
          <p className="text-gray-600">{user.primaryEmailAddress?.emailAddress}</p>
        </div>
      </div>
      <div className="mt-4">
        <SignOutButton>
          <Button variant="ghost">退出登录</Button>
        </SignOutButton>
      </div>
    </Card>
  );
} 