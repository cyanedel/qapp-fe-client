import { Routes, Route, Outlet, Navigate } from "react-router-dom"
import { CollectionInfo } from "@/components/CollectionInfo"
import { Home } from "@/components/Home"
import { Login } from "@/components/Login"
import { NavBar } from "@/components/NavBar"
import { NotFound } from "@/components/NotFound"
import { QuizResult } from "@/components/QuizResult"
import { QuizView } from "@/components/QuizView"
import { Register } from "@/components/Register"
import { UserDetails } from "@/components/UserDetails"
import { useAuthStore } from "@/store/useAuthStore"

function App() {
  const isAuthenticated = useAuthStore((state)=>state.isAuthenticated)
  const ProtectedRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      <NavBar />
      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/collection" element={<CollectionInfo />} />
            <Route path="/quiz" element={<QuizView />} />
            <Route path="/quizresult" element={<QuizResult />} />
            <Route path="/accountinformation" element={<UserDetails />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
