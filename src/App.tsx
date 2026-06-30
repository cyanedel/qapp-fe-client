import { Routes, Route } from "react-router-dom"
import { NavBar } from "@/components/NavBar"
import { Home } from "@/components/Home"
import { QuizView } from "@/components/QuizView"
import { QuizResult } from "@/components/QuizResult"

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      <NavBar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/quiz" element={<QuizView />} />
          <Route path="/quizresult" element={<QuizResult />} />
          {/* <Route path="/history" element={<HistoryView />} /> */}
        </Routes>
      </main>
    </div>
  )
}

export default App