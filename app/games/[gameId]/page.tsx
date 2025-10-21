// app/games/[gameId]/page.tsx
"use client"

import { notFound } from "next/navigation"

// 既存のゲームコンポーネントをインポート
import QuizGame from '@/components/games/pervasiveness/quiz-pervasiveness'
// 他のゲームコンポーネントもインポート
import SelfWorthGame from '@/components/games/selfworthre/selfworth'

const games = {
  pervasiveness: {
    component: QuizGame,
    title: "視野を広げるゲーム",
  },
  selfworth: {
    component: SelfWorthGame,  // 実際は別のコンポーネントを使用
    title: "自分の欲しいものを見つけるゲーム",
  },
}

interface GamePageProps {
  params: Promise<{ gameId: string }>
}

export default async function GamePage({ params }: GamePageProps) {
  const { gameId } = await params
  
  const game = games[gameId as keyof typeof games]
  
  if (!game) {
    notFound()
  }
  
  const GameComponent = game.component
  
  return <GameComponent />
}