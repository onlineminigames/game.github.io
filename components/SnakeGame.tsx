'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Apple } from 'lucide-react'

const GRID_SIZE = 20
const SNAKE_COLOR = '#4CAF50'
const SNAKE_BORDER_COLOR = '#45a049'

export default function SnakeGame() {
  const [gameState, setGameState] = useState('menu') // 'menu', 'playing', 'gameover'
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [snake, setSnake] = useState([{ x: 5, y: 5 }])
  const [food, setFood] = useState({ x: 10, y: 10 })
  const [direction, setDirection] = useState('right')
  const gameLoopRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const storedHighScore = localStorage.getItem('snakeHighScore')
    if (storedHighScore) setHighScore(parseInt(storedHighScore))
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': setDirection(prev => prev !== 'down' ? 'up' : prev); break
        case 'ArrowDown': setDirection(prev => prev !== 'up' ? 'down' : prev); break
        case 'ArrowLeft': setDirection(prev => prev !== 'right' ? 'left' : prev); break
        case 'ArrowRight': setDirection(prev => prev !== 'left' ? 'right' : prev); break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const startGame = () => {
    setGameState('playing')
    setScore(0)
    setSnake([{ x: 5, y: 5 }])
    setFood(generateFood())
    setDirection('right')
    if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    gameLoopRef.current = setInterval(updateGame, 100)
  }

  const generateFood = () => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 10, y: 10 }
    const x = Math.floor(Math.random() * (canvas.width / GRID_SIZE))
    const y = Math.floor(Math.random() * (canvas.height / GRID_SIZE))
    return { x, y }
  }

  const updateGame = () => {
    setSnake(prevSnake => {
      const newSnake = [...prevSnake]
      const head = { ...newSnake[0] }

      switch (direction) {
        case 'up': head.y--; break
        case 'down': head.y++; break
        case 'left': head.x--; break
        case 'right': head.x++; break
      }

      newSnake.unshift(head)

      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood())
        setScore(prevScore => {
          const newScore = prevScore + 1
          if (newScore > highScore) {
            setHighScore(newScore)
            localStorage.setItem('snakeHighScore', newScore.toString())
          }
          return newScore
        })
      } else {
        newSnake.pop()
      }

      if (checkCollision(head)) {
        setGameState('gameover')
        if (gameLoopRef.current) clearInterval(gameLoopRef.current)
      }

      return newSnake
    })
  }

  const checkCollision = (head: { x: number; y: number }) => {
    const canvas = canvasRef.current
    if (!canvas) return true
    return (
      head.x < 0 || head.x >= canvas.width / GRID_SIZE ||
      head.y < 0 || head.y >= canvas.height / GRID_SIZE ||
      snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    )
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw snake
    snake.forEach((segment, index) => {
      const x = segment.x * GRID_SIZE
      const y = segment.y * GRID_SIZE

      ctx.fillStyle = SNAKE_COLOR
      ctx.strokeStyle = SNAKE_BORDER_COLOR

      if (index === 0) {
        // Draw head
        ctx.beginPath()
        ctx.arc(x + GRID_SIZE / 2, y + GRID_SIZE / 2, GRID_SIZE / 2, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()

        // Draw eyes
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(x + GRID_SIZE / 3, y + GRID_SIZE / 3, GRID_SIZE / 8, 0, 2 * Math.PI)
        ctx.arc(x + 2 * GRID_SIZE / 3, y + GRID_SIZE / 3, GRID_SIZE / 8, 0, 2 * Math.PI)
        ctx.fill()

        ctx.fillStyle = 'black'
        ctx.beginPath()
        ctx.arc(x + GRID_SIZE / 3, y + GRID_SIZE / 3, GRID_SIZE / 16, 0, 2 * Math.PI)
        ctx.arc(x + 2 * GRID_SIZE / 3, y + GRID_SIZE / 3, GRID_SIZE / 16, 0, 2 * Math.PI)
        ctx.fill()
      } else {
        // Draw body
        ctx.beginPath()
        ctx.arc(x + GRID_SIZE / 2, y + GRID_SIZE / 2, GRID_SIZE / 2 - 1, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
      }
    })

    // Draw food (apple)
    const appleSize = GRID_SIZE * 0.8
    const appleX = food.x * GRID_SIZE + (GRID_SIZE - appleSize) / 2
    const appleY = food.y * GRID_SIZE + (GRID_SIZE - appleSize) / 2

    ctx.fillStyle = '#FF0000'
    ctx.beginPath()
    ctx.arc(appleX + appleSize / 2, appleY + appleSize / 2, appleSize / 2, 0, 2 * Math.PI)
    ctx.fill()

    // Draw leaf
    ctx.fillStyle = '#00AA00'
    ctx.beginPath()
    ctx.ellipse(appleX + appleSize * 0.7, appleY, appleSize * 0.25, appleSize * 0.15, Math.PI / 4, 0, 2 * Math.PI)
    ctx.fill()

  }, [snake, food])

  return (
    <div className="flex flex-col items-center">
      {gameState === 'menu' && (
        <Button onClick={startGame} className="mb-4">Start Game</Button>
      )}
      {gameState === 'playing' && (
        <>
          <div className="mb-4 text-lg flex items-center">
            <Apple className="mr-2 text-red-500" />
            Score: {score} | High Score: {highScore}
          </div>
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="border-2 border-gray-300"
          />
        </>
      )}
      {gameState === 'gameover' && (
        <div className="text-center">
          <h2 className="text-2xl mb-4">Game Over!</h2>
          <p className="mb-4">Your score: {score}</p>
          <Button onClick={startGame}>Play Again</Button>
        </div>
      )}
    </div>
  )
}

