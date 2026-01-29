"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, Smile, Clock, Sparkles, Frown, Trophy } from "lucide-react"

type FallingItem = {
  id: number
  type: "happy" | "angry" | "sparkle" | "super-sparkle" | "time"
  x: number
  y: number
  speed: number
  swayOffset: number
  swaySpeed: number
  crossedMidline: boolean
}

type ClickAnimation = {
  id: number
  x: number
  y: number
  text: string
  color: string
}

const GAME_DURATION = 60 // 初期制限時間60秒
const MIDLINE_BONUS = 5000
const MISS_PENALTY = -500

const COPYWRITING = [
  {
    title: "素晴らしいスコアです！",
    description: "あなたの反射神経は抜群です。もっと高得点を目指して、再挑戦してみませんか？",
    cta: "今すぐもう一度プレイ！",
  },
  {
    title: "お疲れ様でした！",
    description: "楽しんでいただけましたか？友達にもシェアして、一緒に競い合いましょう！",
    cta: "さらに楽しむ方法をチェック",
  },
  {
    title: "ナイスプレイ！",
    description: "あなたのスキルは素晴らしい！次回はさらに高得点を狙ってみてください。",
    cta: "もっと上達するコツを見る",
  },
]

// スタートページコンポーネント
const StartPage = ({ onStart }: { onStart: () => void }) => {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50">
      <Card className="max-w-2xl w-full p-8 md:p-12 shadow-2xl border-4 border-primary/20">
        <div className="text-center space-y-8">
          {/* タイトル */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-primary">
              にこちゃん
              <br />
              クリックゲーム
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
              落ちてくるにこちゃんをクリックしてポイントゲット！
            </p>
          </div>

          {/* 遊び方 */}
          <div className="bg-secondary/50 rounded-2xl p-6 space-y-4 text-left">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              遊び方
            </h2>
            <div className="space-y-3 text-base md:text-lg">
              <div className="flex items-start gap-3">
                <Smile className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                <p>
                  <span className="font-bold text-yellow-600">にこちゃん</span>をクリック：
                  <span className="font-bold text-primary">+10,000点</span>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Frown className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
                <p>
                  <span className="font-bold text-gray-600">おこちゃん</span>をクリック：
                  <span className="font-bold text-destructive">-5,000点</span>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                <p>
                  <span className="font-bold text-amber-500">キラキラにこちゃん</span>：
                  <span className="font-bold text-primary">+30,000点</span>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
                <p>
                  <span className="font-bold text-purple-600">超キラキラにこちゃん</span>：
                  <span className="font-bold text-primary">+70,000点</span>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <p>
                  <span className="font-bold text-blue-600">タイムマーク</span>：
                  <span className="font-bold text-primary">+10秒</span>
                </p>
              </div>
              <div className="border-t-2 border-border pt-3 mt-3">
                <p className="text-sm text-muted-foreground">
                  ⚠️ 中間線を越えると<span className="font-bold">+5,000点</span>のボーナス！
                  <br />
                  ⚠️ 画面外に出ると<span className="font-bold">-500点</span>
                </p>
              </div>
            </div>
          </div>

          {/* スタートボタン */}
          <Button
            size="lg"
            onClick={onStart}
            className="w-full text-2xl py-8 font-bold pulse-glow hover:scale-105 transition-transform"
          >
            ゲームスタート！
          </Button>
        </div>
      </Card>
    </div>
  )
}

// ゲームページコンポーネント
const GamePage = ({ onGameEnd }: { onGameEnd: (score: number) => void }) => {
  const router = useRouter()
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [difficulty, setDifficulty] = useState(1)
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([])
  const [clickAnimations, setClickAnimations] = useState<ClickAnimation[]>([])
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const itemIdCounter = useRef(0)
  const animationIdCounter = useRef(0)
  const spawnedTypes = useRef<Set<string>>(new Set())
  const gameStartTime = useRef<number>(0)

  // 難易度に応じた背景色
  const getBackgroundGradient = () => {
    if (difficulty === 1) return "from-lime-100 via-green-100 to-emerald-100"
    if (difficulty === 2) return "from-yellow-100 via-lime-100 to-green-200"
    if (difficulty === 3) return "from-orange-100 via-yellow-100 to-lime-200"
    if (difficulty === 4) return "from-red-100 via-orange-100 to-yellow-200"
    return "from-purple-100 via-pink-100 to-red-200"
  }

  // 難易度バッジ
  const getDifficultyBadge = () => {
    if (difficulty === 1) return { text: "イージー", color: "bg-green-500" }
    if (difficulty === 2) return { text: "ノーマル", color: "bg-yellow-500" }
    if (difficulty === 3) return { text: "ハード", color: "bg-orange-500" }
    if (difficulty === 4) return { text: "エキスパート", color: "bg-red-500" }
    return { text: "マスター", color: "bg-purple-500" }
  }

  // アイテムを生成
  const spawnItem = useCallback(() => {
    if (!gameAreaRef.current) return

    const rect = gameAreaRef.current.getBoundingClientRect()
    const currentTime = Date.now() - gameStartTime.current

    let type: FallingItem["type"]

    // 最初の15秒は全種類を確実に出す
    if (currentTime < 15000) {
      const unspawnedTypes = ["happy", "angry", "sparkle", "super-sparkle", "time"].filter(
        (t) => !spawnedTypes.current.has(t),
      )

      if (unspawnedTypes.length > 0) {
        type = unspawnedTypes[Math.floor(Math.random() * unspawnedTypes.length)] as FallingItem["type"]
        spawnedTypes.current.add(type)
      } else {
        // 全種類出た後は通常の確率
        const rand = Math.random()
        if (rand < 0.5) type = "happy"
        else if (rand < 0.75) type = "angry"
        else if (rand < 0.9) type = "sparkle"
        else if (rand < 0.97) type = "time"
        else type = "super-sparkle"
      }
    } else {
      // 15秒以降は通常の確率
      const rand = Math.random()
      if (rand < 0.5) type = "happy"
      else if (rand < 0.75) type = "angry"
      else if (rand < 0.9) type = "sparkle"
      else if (rand < 0.97) type = "time"
      else type = "super-sparkle"
    }

    // ポイントが高いほど速度と揺れを大きくする
    let baseSpeed = 1 + difficulty * 0.5
    let swayMultiplier = 1

    if (type === "super-sparkle") {
      baseSpeed *= 2.5 // 超キラキラは2.5倍速
      swayMultiplier = 4 // 揺れ幅4倍
    } else if (type === "sparkle") {
      baseSpeed *= 2.0 // キラキラは2倍速
      swayMultiplier = 3 // 揺れ幅3倍
    } else if (type === "time") {
      baseSpeed *= 1.8 // タイムマークは1.8倍速
      swayMultiplier = 2.5 // 揺れ幅2.5倍
    } else if (type === "happy") {
      baseSpeed *= 1.3 // にこちゃんは1.3倍速
      swayMultiplier = 1.5 // 揺れ幅1.5倍
    } else if (type === "angry") {
      baseSpeed *= 1.5 // おこちゃんは1.5倍速
      swayMultiplier = 2 // 揺れ幅2倍
    }

    const newItem: FallingItem = {
      id: itemIdCounter.current++,
      type,
      x: Math.random() * (rect.width - 80),
      y: -80,
      speed: baseSpeed,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: (0.03 + Math.random() * 0.03) * swayMultiplier,
      crossedMidline: false,
    }

    setFallingItems((prev) => [...prev, newItem])
  }, [difficulty])

  // クリックアニメーション追加
  const addClickAnimation = (x: number, y: number, text: string, color: string) => {
    const newAnimation: ClickAnimation = {
      id: animationIdCounter.current++,
      x,
      y,
      text,
      color,
    }
    setClickAnimations((prev) => [...prev, newAnimation])
    setTimeout(() => {
      setClickAnimations((prev) => prev.filter((a) => a.id !== newAnimation.id))
    }, 1000)
  }

  // アイテムクリック処理
  const handleItemClick = (item: FallingItem, event: React.MouseEvent) => {
    event.stopPropagation()

    const rect = (event.target as HTMLElement).getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    let points = 0
    let text = ""
    let color = ""

    switch (item.type) {
      case "happy":
        points = 10000
        text = "+10,000"
        color = "text-yellow-500"
        break
      case "angry":
        points = -5000
        text = "-5,000"
        color = "text-red-500"
        break
      case "sparkle":
        points = 30000
        text = "+30,000"
        color = "text-amber-500"
        break
      case "super-sparkle":
        points = 70000
        text = "+70,000"
        color = "text-purple-500"
        break
      case "time":
        setTimeLeft((prev) => prev + 10)
        text = "+10秒"
        color = "text-blue-500"
        break
    }

    if (points !== 0) {
      setScore((prev) => Math.max(0, prev + points))
    }

    addClickAnimation(x, y, text, color)
    setFallingItems((prev) => prev.filter((i) => i.id !== item.id))
  }

  // ゲーム開始
  useEffect(() => {
    if (!gameStarted) {
      setGameStarted(true)
      gameStartTime.current = Date.now()
    }
  }, [gameStarted])

  // アイテム生成タイマー（より速く、より多く）
  useEffect(() => {
    if (!gameStarted || gameOver) return

    const spawnInterval = Math.max(200, 600 - difficulty * 80)
    const interval = setInterval(spawnItem, spawnInterval)

    return () => clearInterval(interval)
  }, [gameStarted, gameOver, difficulty, spawnItem])

  // アイテム移動とチェック
  useEffect(() => {
    if (!gameStarted || gameOver || !gameAreaRef.current) return

    const interval = setInterval(() => {
      const rect = gameAreaRef.current!.getBoundingClientRect()
      const midlineY = rect.height / 2

      setFallingItems((prev) => {
        const updated = prev.map((item) => {
          const newY = item.y + item.speed

          // アイテムタイプごとに揺れ幅を設定
          let swayAmplitude = 20
          if (item.type === "super-sparkle") {
            swayAmplitude = 80 // 超キラキラは揺れ幅80px
          } else if (item.type === "sparkle") {
            swayAmplitude = 60 // キラキラは揺れ幅60px
          } else if (item.type === "time") {
            swayAmplitude = 50 // タイムマークは揺れ幅50px
          } else if (item.type === "angry") {
            swayAmplitude = 40 // おこちゃんは揺れ幅40px
          } else if (item.type === "happy") {
            swayAmplitude = 30 // にこちゃんは揺れ幅30px
          }

          const sway = Math.sin(item.swayOffset + newY * item.swaySpeed) * swayAmplitude
          const prevSway = Math.sin(item.swayOffset + item.y * item.swaySpeed) * swayAmplitude

          // 中間線を越えたかチェック
          if (!item.crossedMidline && newY > midlineY) {
            setScore((s) => s + MIDLINE_BONUS)
            addClickAnimation(rect.left + item.x + 40, rect.top + midlineY, "+5,000", "text-green-500")
            return {
              ...item,
              y: newY,
              x: item.x + sway - prevSway,
              crossedMidline: true,
            }
          }

          return { ...item, y: newY, x: item.x + sway - prevSway }
        })

        // 画面外に出たアイテムを削除してペナルティ
        const filtered = updated.filter((item) => {
          if (item.y > rect.height) {
            setScore((s) => Math.max(0, s + MISS_PENALTY))
            return false
          }
          return true
        })

        return filtered
      })
    }, 16)

    return () => clearInterval(interval)
  }, [gameStarted, gameOver])

  // タイマー
  useEffect(() => {
    if (!gameStarted || gameOver) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true)
          onGameEnd(score)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [gameStarted, gameOver, score, onGameEnd])

  // 難易度アップ
  useEffect(() => {
    const newDifficulty = Math.floor(score / 100000) + 1
    if (newDifficulty !== difficulty && newDifficulty <= 5) {
      setDifficulty(newDifficulty)
    }
  }, [score, difficulty])

  // タイマーバーの色
  const getTimerColor = () => {
    const percentage = (timeLeft / GAME_DURATION) * 100
    if (percentage > 50) return "bg-green-500"
    if (percentage > 20) return "bg-yellow-500"
    return "bg-red-500"
  }

  const difficultyBadge = getDifficultyBadge()

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} p-4`}>
      <div className="max-w-4xl mx-auto space-y-4">
        {/* ヘッダー */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-primary">{score.toLocaleString()}点</div>
              <Badge className={`${difficultyBadge.color} text-white text-lg px-4 py-1`}>{difficultyBadge.text}</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push("/")}>
              <Home className="w-4 h-4 mr-2" />
              ホーム
            </Button>
          </div>

          {/* タイマーバー */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">残り時間</span>
              <span className={`font-bold ${timeLeft <= 10 ? "text-red-500" : ""}`}>{timeLeft}秒</span>
            </div>
            <div className="h-6 bg-secondary rounded-full overflow-hidden relative">
              <div
                className={`h-full ${getTimerColor()} transition-all duration-300 ${
                  timeLeft <= 10 ? "blink-animation" : ""
                }`}
                style={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }}
              />
            </div>
          </div>
        </Card>

        {/* ゲームエリア */}
        <Card className="relative overflow-hidden" style={{ height: "500px" }}>
          <div ref={gameAreaRef} className="w-full h-full relative bg-gradient-to-b from-sky-100 to-sky-50">
            {/* 中間線 */}
            <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-primary/30 z-0" />

            {/* 落下アイテム */}
            {fallingItems.map((item) => (
              <button
                key={item.id}
                onClick={(e) => handleItemClick(item, e)}
                className="absolute cursor-pointer hover:scale-110 transition-transform z-10"
                style={{
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                  width: "80px",
                  height: "80px",
                }}
              >
                {item.type === "happy" && (
                  <div className="w-full h-full rounded-full bg-yellow-400 border-4 border-yellow-600 flex items-center justify-center text-4xl shadow-lg">
                    😊
                  </div>
                )}
                {item.type === "angry" && (
                  <div className="w-full h-full rounded-full bg-gray-600 border-4 border-gray-800 flex items-center justify-center text-4xl shadow-lg">
                    😠
                  </div>
                )}
                {item.type === "sparkle" && (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-300 to-amber-400 border-4 border-amber-600 flex items-center justify-center text-4xl shadow-lg sparkle-animation">
                    ✨😊
                  </div>
                )}
                {item.type === "super-sparkle" && (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-4 border-purple-600 flex items-center justify-center text-4xl shadow-lg pulse-glow sparkle-animation">
                    ⭐😊
                  </div>
                )}
                {item.type === "time" && (
                  <div className="w-full h-full rounded-full bg-blue-400 border-4 border-blue-600 flex items-center justify-center text-4xl shadow-lg">
                    ⏰
                  </div>
                )}
              </button>
            ))}

            {/* クリックアニメーション */}
            {clickAnimations.map((anim) => (
              <div
                key={anim.id}
                className={`absolute font-bold text-3xl pointer-events-none z-20 animate-bounce-in-up ${anim.color}`}
                style={{
                  left: `${anim.x}px`,
                  top: `${anim.y}px`,
                  transform: "translate(-50%, -50%)",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {anim.text}
              </div>
            ))}
          </div>
        </Card>

        {/* ボタン */}
        <div className="flex gap-4">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={() => router.push("/")}>
            もう一度
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              setGameOver(true)
              onGameEnd(score)
            }}
          >
            終了
          </Button>
        </div>
      </div>
    </div>
  )
}

// リザルトページコンポーネント
const ResultPage = ({ finalScore, onRestart, onExit }: { finalScore: number; onRestart: () => void; onExit: () => void }) => {
  const [selectedCopy, setSelectedCopy] = useState(COPYWRITING[0])

  useEffect(() => {
    // ランダムにコピーライティングを選択
    const randomIndex = Math.floor(Math.random() * COPYWRITING.length)
    setSelectedCopy(COPYWRITING[randomIndex])
  }, [])

  const getRank = () => {
    if (finalScore >= 500000) return { text: "S", color: "text-purple-500", bg: "bg-purple-100" }
    if (finalScore >= 300000) return { text: "A", color: "text-blue-500", bg: "bg-blue-100" }
    if (finalScore >= 150000) return { text: "B", color: "text-green-500", bg: "bg-green-100" }
    if (finalScore >= 50000) return { text: "C", color: "text-yellow-500", bg: "bg-yellow-100" }
    return { text: "D", color: "text-gray-500", bg: "bg-gray-100" }
  }

  const rank = getRank()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50">
      <Card className="max-w-2xl w-full p-8 md:p-12 shadow-2xl border-4 border-primary/20">
        <div className="text-center space-y-8">
          {/* タイトル */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <Trophy className="w-20 h-20 text-yellow-500 float-animation" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary">ゲーム終了！</h1>
          </div>

          {/* スコア表示 */}
          <div className="space-y-4">
            <div className={`inline-block px-8 py-4 rounded-2xl ${rank.bg}`}>
              <div className="text-sm text-muted-foreground mb-2">ランク</div>
              <div className={`text-6xl font-bold ${rank.color}`}>{rank.text}</div>
            </div>
            <div className="text-5xl md:text-6xl font-bold text-primary">
              {finalScore.toLocaleString()}
              <span className="text-2xl ml-2">点</span>
            </div>
          </div>

          {/* コピーライティング */}
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-primary">{selectedCopy.title}</h2>
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <p className="text-lg text-foreground leading-relaxed">{selectedCopy.description}</p>
            <div
              className="pt-4 border-t-2 border-border"
              dangerouslySetInnerHTML={{
                __html: `<a href="#" class="text-primary font-bold hover:underline text-lg">${selectedCopy.cta}</a>`,
              }}
            />
          </Card>

          {/* アフィリエイトエリア */}
          <Card className="bg-secondary/50 p-6">
            <div
              className="text-center text-sm text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: "<p>広告エリア - ここにアフィリエイトリンクが入ります</p>",
              }}
            />
          </Card>

          {/* ボタン */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              variant="outline"
              className="flex-1 text-xl py-6 bg-transparent"
              onClick={onRestart}
            >
              もう一度
            </Button>
            <Button
              size="lg"
              className="flex-1 text-xl py-6 pulse-glow"
              onClick={() => {
                // 大元のサイトに戻る（ここでは仮にホームに戻る）
                window.location.href = "/"
              }}
            >
              終了
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

// メインゲームコンポーネント
export default function ClickerGame() {
  const router = useRouter()
  const [gameState, setGameState] = useState<"start" | "game" | "result">("start")
  const [finalScore, setFinalScore] = useState(0)

  const handleStart = () => {
    setGameState("game")
  }

  const handleGameEnd = (score: number) => {
    setFinalScore(score)
    setGameState("result")
  }

  const handleRestart = () => {
    setFinalScore(0)
    setGameState("start")
  }

  const handleExit = () => {
    router.push("/")
  }

  return (
    <>
      {gameState === "start" && <StartPage onStart={handleStart} />}
      {gameState === "game" && <GamePage onGameEnd={handleGameEnd} />}
      {gameState === "result" && <ResultPage finalScore={finalScore} onRestart={handleRestart} onExit={handleExit} />}
    </>
  )
}
