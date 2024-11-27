import SnakeGame from '../components/SnakeGame'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Snake Game</h1>
      <SnakeGame />
    </main>
  )
}

