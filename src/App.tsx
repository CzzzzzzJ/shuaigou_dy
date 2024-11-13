import { Header } from "@/components/header"
import { DouyinTool } from "./components/tools/douyin-tool"
import { MainContent } from "./components/main-content"
import { Routes, Route } from "react-router-dom"

function App() {
  return (
    <div className="flex flex-col min-h-screen max-h-screen">
      <Header />
      <main className="flex-1 overflow-y-auto relative">
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/douyin" element={<DouyinTool onBack={() => {}} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App