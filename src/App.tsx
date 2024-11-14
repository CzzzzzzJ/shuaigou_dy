import { Routes, Route } from "react-router-dom";
import { SignIn, SignUp, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { Header } from "@/components/header";
import { MainContent } from "@/components/main-content";
import { DouyinTool } from "@/components/tools/douyin-tool";
import { UserProfile } from "@/components/user-profile";
import { UserProvider } from "@/contexts/user-context";
import { ToastProvider } from "@/hooks/use-toast";

function App() {
  return (
    <ToastProvider>
      <UserProvider>
        <div className="flex flex-col min-h-screen max-h-screen">
          <Header />
          <main className="flex-1 overflow-y-auto relative">
            <Routes>
              <Route path="/" element={<MainContent />} />
              <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
              <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
              <Route
                path="/douyin"
                element={
                  <>
                    <SignedIn>
                      <DouyinTool onBack={() => {}} />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />
              <Route
                path="/profile"
                element={
                  <>
                    <SignedIn>
                      <UserProfile />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />
            </Routes>
          </main>
        </div>
      </UserProvider>
    </ToastProvider>
  );
}

export default App;