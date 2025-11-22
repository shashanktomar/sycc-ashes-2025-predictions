import { Analytics } from '@vercel/analytics/react'
import Leaderboard from './pages/Leaderboard'

function App() {
  return (
    <>
      <Leaderboard />
      <Analytics />
    </>
  )
}

export default App
