import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export const NavBar: React.FC = () => {
  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <nav className="flex items-center space-x-2">
          <Button variant="ghost" asChild>
            <Link to="/home">Home</Link>
          </Button>
          {/* <Button variant="ghost" asChild>
            <Link to="/quiz">Quiz</Link>
          </Button> */}
          <Button variant="ghost" asChild>
            <Link to="/quizresult">Results</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}