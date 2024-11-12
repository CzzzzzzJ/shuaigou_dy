import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { MainContent } from '@/components/main-content';

function App() {
  return (
    <div className="min-h-screen bg-[#FFFCF5]">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <MainContent />
        </div>
      </div>
    </div>
  );
}

export default App;