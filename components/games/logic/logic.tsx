"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import ConfettiCanvas from "@/components/animations/ConfettiCanvas"
import { TermsOfService } from "@/components/terms-of-service/terms-of-service"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

// 行動セットの型定義
type ActionSet = {
  action: string          // 行動
  notDoReason1: string   // やらない理由1
  notDoReason2: string   // やらない理由2
  doReason: string       // やる理由
  benefit: string        // 得られる得
}

// 浮遊するやらない理由の型定義
type FloatingReason = {
  id: string
  actionText: string    // 行動テキスト
  reasonText: string    // やらない理由テキスト
  correctIndex: number  // 対応するやる理由のインデックス
  x: number
  y: number
  speed: number
  isSpecial: boolean    // 超高速かどうか
}

// アフィリエイトコンポーネント
const AffiliateComponent = ({ className = "" }: { className?: string }) => {
  const affiliateHtml = `<a href="https://px.a8.net/svt/ejp?a8mat=45167E+679KMQ+5OI8+5ZEMP" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www27.a8.net/svt/bgt?aid=250317482375&wid=001&eno=01&mid=s00000026504001005000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=45167E+679KMQ+5OI8+5ZEMP" alt="">`

  return (
    <div className={`w-full mx-auto mt-2 mb-2 ${className}`}>
      <div
        style={{
          fontFamily: "'Hiragino Sans', 'Yu Gothic', sans-serif",
          margin: 0,
          padding: "10px",
          backgroundColor: "#ffffffff",
          color: "#333",
          maxWidth: "600px",
          marginLeft: "auto",
          marginRight: "auto"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px"
          }}
          dangerouslySetInnerHTML={{ __html: affiliateHtml }}
        />

        <div
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            lineHeight: "1.6",
            marginBottom: "25px",
            textAlign: "justify",
            color: "#166534",
            backgroundColor: "transparent",
            padding: "15px",
            borderRadius: "8px"
          }}
        >
          心理学のマスター（公認心理士）が100％在籍するオンラインクリニックで、科学的な知識であなたを元気にします。
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              padding: "15px 30px",
              backgroundColor: "#ff6b6b",
              borderRadius: "50px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              minWidth: "200px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#ff5252"
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ff6b6b"
              e.currentTarget.style.transform = "translateY(0px)"
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)"
            }}
            dangerouslySetInnerHTML={{
              __html: `<a href="https://px.a8.net/svt/ejp?a8mat=45167E+679KMQ+5OI8+BW8O2&a8ejpredirect=https%3A%2F%2Fkimochi-mental.com%2Fclient%2Fhome" rel="nofollow">今すぐ予約</a>
<img border="0" width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=45167E+679KMQ+5OI8+BW8O2" alt="">`
            }}
          />
        </div>
      </div>
    </div>
  )
}

// スタート画面
const IntroPage = ({ onStart }: { onStart: () => void }) => {
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center animate-fade-in">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-green-100 via-green-200 to-green-300"></div>

      <div className="relative z-10 text-center space-y-6 bg-green-700 bg-opacity-70 p-8 rounded-lg max-w-2xl">
        <h1 className="text-4xl font-bold text-white">論法ゲーム</h1>
        <p className="text-lg text-white whitespace-pre-line">
          頭の中に出てくる「できない理由」を「できる理由」で打ち消して、{"\n"}
          行動したいという感情を作るゲームです。
        </p>
        <p className="text-base text-yellow-200 font-semibold">
          ゲーム内でのご回答していただいた内容は機密資料としての保管を徹底いたします。
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => setIsTermsOpen(true)}
              className="text-white underline hover:text-green-200 transition-colors"
            >
              利用規約を読む
            </button>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-8 h-8 rounded-full border-2 border-white cursor-pointer transition-all duration-300 hover:scale-125 hover:border-green-300 checked:scale-110 checked:bg-green-400"
              />
              <span className="text-white">利用規約に同意する</span>
            </label>
          </div>

          <Button
            onClick={onStart}
            disabled={!agreedToTerms}
            className={`bg-gradient-to-r from-green-500 to-green-700 hover:opacity-90 transition-opacity px-8 py-4 text-xl text-white ${
              !agreedToTerms ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            ゲームを始める
          </Button>
        </div>
      </div>

      <TermsOfService isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </div>
  )
}

// 記入画面
const InputPage = ({
  actionSets,
  onActionSetsComplete,
  onExit
}: {
  actionSets: ActionSet[]
  onActionSetsComplete: (sets: ActionSet[]) => void
  onExit: () => void
}) => {
  const [currentSets, setCurrentSets] = useState<ActionSet[]>(
    actionSets.length > 0 ? actionSets : Array(2).fill(null).map(() => ({
      action: "",
      notDoReason1: "",
      notDoReason2: "",
      doReason: "",
      benefit: ""
    }))
  )
  const [showConfetti, setShowConfetti] = useState(false)
  const [fieldAnimations, setFieldAnimations] = useState<{ [key: string]: boolean }>({})
  const [completedFields, setCompletedFields] = useState<{ [key: string]: boolean }>({})
  const [totalPoints, setTotalPoints] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleInputChange = (index: number, field: keyof ActionSet, value: string) => {
    const newSets = [...currentSets]
    newSets[index] = { ...newSets[index], [field]: value }
    setCurrentSets(newSets)

    // タイピング時に草エフェクトのみ表示
    if (value.trim() !== "") {
      const animationKey = `field-${index}-${field}`
      setFieldAnimations((prev) => ({ ...prev, [animationKey]: true }))

      setTimeout(() => {
        setFieldAnimations((prev) => {
          const newAnimations = { ...prev }
          delete newAnimations[animationKey]
          return newAnimations
        })
      }, 500)
    }
  }

  const handleFieldComplete = (index: number, field: keyof ActionSet) => {
    const fieldKey = `${index}-${field}`
    if (completedFields[fieldKey]) return

    setCompletedFields(prev => ({ ...prev, [fieldKey]: true }))
    setTotalPoints(prev => prev + 100)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 1000)
  }

  const isFieldComplete = (index: number, field: keyof ActionSet) => {
    return completedFields[`${index}-${field}`]
  }

  const handleComplete = () => {
    // 少なくとも1つのセットが完全に入力されているか確認
    const hasValidSet = currentSets.some(set =>
      set.action.trim() && set.notDoReason1.trim() && set.notDoReason2.trim() && set.doReason.trim() && set.benefit.trim()
    )

    if (hasValidSet) {
      onActionSetsComplete(currentSets)
    }
  }

  const hasValidInput = currentSets.some(set =>
    set.action.trim() && set.notDoReason1.trim() && set.notDoReason2.trim() && set.doReason.trim() && set.benefit.trim()
  )

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in bg-gradient-to-b from-green-50 via-green-100 to-green-200">
      <ConfettiCanvas isActive={showConfetti} duration={1000} particleCount={50} points={1000} />

      {/* ポイント表示 */}
      {totalPoints > 0 && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg z-50 text-2xl font-bold">
          🏆 {totalPoints}pt
        </div>
      )}

      <div className="relative z-10 max-w-4xl w-full space-y-6">
        <div className="bg-white bg-opacity-95 rounded-xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">行動とその理由を記入してください</h1>
          <p className="text-lg text-green-600 mb-8 text-center">
            最大2セットまで入力できます。各フィールドを入力して回答ボタンを押してください。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentSets.map((set, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-green-50 via-green-100 to-emerald-50 border-2 border-green-200 shadow-lg rounded-lg p-6"
              >
                <h2 className="text-xl font-bold mb-4 text-green-800">
                  セット {index + 1}
                </h2>

                <div className="space-y-4">
                  {/* 行動 */}
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-2">行動</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        {fieldAnimations[`field-${index}-action`] && (
                          <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-green-500 text-xl z-10 animate-bounce">
                            🌿
                          </span>
                        )}
                        <Input
                          type="text"
                          placeholder="例：毎朝ジョギングをする"
                          value={set.action}
                          onChange={(e) => handleInputChange(index, "action", e.target.value)}
                          className={`w-full ${fieldAnimations[`field-${index}-action`] ? "border-green-400 shadow-lg bg-green-50" : ""}`}
                        />
                      </div>
                      <Button
                        onClick={() => handleFieldComplete(index, "action")}
                        disabled={!set.action.trim() || isFieldComplete(index, "action")}
                        className={`px-4 py-2 text-sm font-medium ${
                          isFieldComplete(index, "action")
                            ? "bg-green-500 text-white cursor-default"
                            : !set.action.trim()
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        {isFieldComplete(index, "action") ? "✓" : "回答"}
                      </Button>
                    </div>
                  </div>

                  {/* やらない理由1 */}
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">やらない理由1</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        {fieldAnimations[`field-${index}-notDoReason1`] && (
                          <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-green-500 text-xl z-10 animate-bounce">
                            🌿
                          </span>
                        )}
                        <Input
                          type="text"
                          placeholder="例：朝は眠い"
                          value={set.notDoReason1}
                          onChange={(e) => handleInputChange(index, "notDoReason1", e.target.value)}
                          className={`w-full ${fieldAnimations[`field-${index}-notDoReason1`] ? "border-green-400 shadow-lg bg-green-50" : ""}`}
                        />
                      </div>
                      <Button
                        onClick={() => handleFieldComplete(index, "notDoReason1")}
                        disabled={!set.notDoReason1.trim() || isFieldComplete(index, "notDoReason1")}
                        className={`px-4 py-2 text-sm font-medium ${
                          isFieldComplete(index, "notDoReason1")
                            ? "bg-green-500 text-white cursor-default"
                            : !set.notDoReason1.trim()
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        {isFieldComplete(index, "notDoReason1") ? "✓" : "回答"}
                      </Button>
                    </div>
                  </div>

                  {/* やらない理由2 */}
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">やらない理由2</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        {fieldAnimations[`field-${index}-notDoReason2`] && (
                          <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-green-500 text-xl z-10 animate-bounce">
                            🌿
                          </span>
                        )}
                        <Input
                          type="text"
                          placeholder="例：時間がない"
                          value={set.notDoReason2}
                          onChange={(e) => handleInputChange(index, "notDoReason2", e.target.value)}
                          className={`w-full ${fieldAnimations[`field-${index}-notDoReason2`] ? "border-green-400 shadow-lg bg-green-50" : ""}`}
                        />
                      </div>
                      <Button
                        onClick={() => handleFieldComplete(index, "notDoReason2")}
                        disabled={!set.notDoReason2.trim() || isFieldComplete(index, "notDoReason2")}
                        className={`px-4 py-2 text-sm font-medium ${
                          isFieldComplete(index, "notDoReason2")
                            ? "bg-green-500 text-white cursor-default"
                            : !set.notDoReason2.trim()
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        {isFieldComplete(index, "notDoReason2") ? "✓" : "回答"}
                      </Button>
                    </div>
                  </div>

                  {/* やる理由 */}
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">やる理由</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        {fieldAnimations[`field-${index}-doReason`] && (
                          <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-green-500 text-xl z-10 animate-bounce">
                            🌿
                          </span>
                        )}
                        <Input
                          type="text"
                          placeholder="例：健康になりたい"
                          value={set.doReason}
                          onChange={(e) => handleInputChange(index, "doReason", e.target.value)}
                          className={`w-full ${fieldAnimations[`field-${index}-doReason`] ? "border-green-400 shadow-lg bg-green-50" : ""}`}
                        />
                      </div>
                      <Button
                        onClick={() => handleFieldComplete(index, "doReason")}
                        disabled={!set.doReason.trim() || isFieldComplete(index, "doReason")}
                        className={`px-4 py-2 text-sm font-medium ${
                          isFieldComplete(index, "doReason")
                            ? "bg-green-500 text-white cursor-default"
                            : !set.doReason.trim()
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        {isFieldComplete(index, "doReason") ? "✓" : "回答"}
                      </Button>
                    </div>
                  </div>

                  {/* 得られる得 */}
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">得られる得</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        {fieldAnimations[`field-${index}-benefit`] && (
                          <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-green-500 text-xl z-10 animate-bounce">
                            🌿
                          </span>
                        )}
                        <Input
                          type="text"
                          placeholder="例：元気な体"
                          value={set.benefit}
                          onChange={(e) => handleInputChange(index, "benefit", e.target.value)}
                          className={`w-full ${fieldAnimations[`field-${index}-benefit`] ? "border-green-400 shadow-lg bg-green-50" : ""}`}
                        />
                      </div>
                      <Button
                        onClick={() => handleFieldComplete(index, "benefit")}
                        disabled={!set.benefit.trim() || isFieldComplete(index, "benefit")}
                        className={`px-4 py-2 text-sm font-medium ${
                          isFieldComplete(index, "benefit")
                            ? "bg-green-500 text-white cursor-default"
                            : !set.benefit.trim()
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        {isFieldComplete(index, "benefit") ? "✓" : "回答"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={handleComplete}
            disabled={!hasValidInput}
            className={`w-full mt-8 py-6 text-xl font-bold ${
              !hasValidInput
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800 text-white shadow-xl shadow-green-500/50"
            } transition-all duration-300 rounded-xl`}
          >
            次へ
          </Button>

          <Button
            onClick={onExit}
            className="w-full mt-4 text-green-600 bg-transparent hover:text-green-700 hover:bg-green-50 border-0"
          >
            終了する
          </Button>
        </div>
      </div>
    </div>
  )
}

// メインゲーム画面（打ち消すゲーム）
const GamePage = ({
  actionSets,
  onGameComplete,
  onExit
}: {
  actionSets: ActionSet[]
  onGameComplete: (score: number) => void
  onExit: () => void
}) => {
  const [timeLeft, setTimeLeft] = useState(60)
  const [score, setScore] = useState(0)
  const [floatingReasons, setFloatingReasons] = useState<FloatingReason[]>([])
  const [draggedReasonId, setDraggedReasonId] = useState<string | null>(null)
  const [selectedDoReasonIndex, setSelectedDoReasonIndex] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [spawnSpeed, setSpawnSpeed] = useState(3000) // 初期スポーン間隔3秒
  const [hasSpawnedSpecial, setHasSpawnedSpecial] = useState(false)
  const gameAreaRef = useRef<HTMLDivElement>(null)

  // 有効な行動セットのみを抽出（useRefで保持して再レンダリングを防ぐ）
  const validSets = useRef(
    actionSets.filter(set =>
      set.action.trim() && set.notDoReason1.trim() && set.notDoReason2.trim() && set.doReason.trim() && set.benefit.trim()
    )
  ).current

  // すべてのセットの得られる得を表示
  const allBenefits = validSets.map(set => set.benefit).join(" / ")

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // タイマー
  useEffect(() => {
    if (timeLeft <= 0) {
      onGameComplete(score)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, score, onGameComplete])

  // スポーン速度の調整（時間経過で速くなる）
  useEffect(() => {
    const elapsed = 60 - timeLeft
    if (elapsed > 40) {
      setSpawnSpeed(800)
    } else if (elapsed > 30) {
      setSpawnSpeed(1200)
    } else if (elapsed > 20) {
      setSpawnSpeed(1800)
    } else if (elapsed > 10) {
      setSpawnSpeed(2400)
    }
  }, [timeLeft])

  // やらない理由の自動生成（やらない理由1と2を両方流す）
  useEffect(() => {
    if (validSets.length === 0 || timeLeft <= 0) return

    const spawnInterval = setInterval(() => {
      setHasSpawnedSpecial(prevHasSpawned => {
        // 序盤（50秒以上残っている時）に1回だけ超高速を出現させる
        const shouldSpawnSpecial = !prevHasSpawned && timeLeft > 50 && Math.random() > 0.7

        const randomSet = validSets[Math.floor(Math.random() * validSets.length)]
        const correctIndex = validSets.indexOf(randomSet)

        // やらない理由1と2のどちらかをランダムに選択
        const whichReason = Math.random() > 0.5 ? "notDoReason1" : "notDoReason2"
        const reasonText = randomSet[whichReason]

        const newReason: FloatingReason = {
          id: `reason-${Date.now()}-${Math.random()}`,
          actionText: randomSet.action,
          reasonText: reasonText,
          correctIndex,
          x: Math.random() * 60 + 20, // 20%〜80%の範囲
          y: 0,
          speed: shouldSpawnSpecial ? 8 : Math.random() * 2 + 1,
          isSpecial: shouldSpawnSpecial
        }

        setFloatingReasons(prev => [...prev, newReason])

        return shouldSpawnSpecial ? true : prevHasSpawned
      })
    }, spawnSpeed)

    return () => clearInterval(spawnInterval)
  }, [spawnSpeed])

  // やらない理由の移動
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setFloatingReasons(prev =>
        prev
          .map(reason => ({
            ...reason,
            y: reason.y + reason.speed * 0.5
          }))
          .filter(reason => reason.y < 70) // 画面外に出たら削除
      )
    }, 50)

    return () => clearInterval(moveInterval)
  }, [])

  const [hoveredReasonId, setHoveredReasonId] = useState<string | null>(null)
  const [hoveredDoReasonIndex, setHoveredDoReasonIndex] = useState<number | null>(null)

  // ホバー中のやらない理由がやる理由の上に来た時の判定
  useEffect(() => {
    if (hoveredReasonId === null || hoveredDoReasonIndex === null) return

    const hoveredReason = floatingReasons.find(r => r.id === hoveredReasonId)
    if (!hoveredReason) return

    // 正解判定
    if (hoveredDoReasonIndex === hoveredReason.correctIndex) {
      const points = hoveredReason.isSpecial ? 700 : 100
      setScore(prev => prev + points)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 500)
      setFloatingReasons(prev => prev.filter(r => r.id !== hoveredReasonId))
      setHoveredReasonId(null)
      setHoveredDoReasonIndex(null)
    } else {
      // 不正解
      setScore(prev => prev - 50)
      setFloatingReasons(prev => prev.filter(r => r.id !== hoveredReasonId))
      setHoveredReasonId(null)
      setHoveredDoReasonIndex(null)
    }
  }, [hoveredReasonId, hoveredDoReasonIndex])

  return (
    <div className="relative w-full h-screen flex flex-col bg-gradient-to-b from-green-50 via-green-100 to-green-200 overflow-hidden">
      <ConfettiCanvas isActive={showConfetti} duration={500} particleCount={30} points={0} />

      {/* ヘッダー */}
      <div className="bg-white bg-opacity-90 p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-green-800">
            ⏱️ {timeLeft}秒
          </div>
          <div className="text-lg font-bold text-purple-700">
            {allBenefits}
          </div>
          <div className="text-3xl font-bold text-green-700">
            🏆 {score}pt
          </div>
        </div>
      </div>

      {/* ゲームエリア（上部2/3） */}
      <div
        ref={gameAreaRef}
        className="relative flex-[2] bg-gradient-to-b from-green-100 to-green-200"
      >
        {floatingReasons.map(reason => (
          <motion.div
            key={reason.id}
            className={`absolute cursor-move ${
              reason.isSpecial
                ? "bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400 border-4 border-yellow-600 shadow-2xl shadow-yellow-500/50 animate-pulse"
                : "bg-red-100 border-2 border-red-400 shadow-lg"
            } rounded-lg px-4 py-2 font-bold text-center transition-all hover:scale-110 hover:z-50`}
            style={{
              left: `${reason.x}%`,
              top: `${reason.y}%`,
              fontSize: reason.isSpecial ? "1.2rem" : "0.9rem",
              color: reason.isSpecial ? "#000" : "#dc2626"
            }}
            onMouseEnter={() => setHoveredReasonId(reason.id)}
            onMouseLeave={() => setHoveredReasonId(null)}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <div className="font-bold text-green-800">{reason.actionText}</div>
            <div className="mt-1">{reason.reasonText}</div>
            {reason.isSpecial && <div className="text-xl">⚡</div>}
          </motion.div>
        ))}

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-2xl font-bold text-green-800 bg-white bg-opacity-70 px-6 py-3 rounded-lg">
            やらない理由を「やる理由」の上にホバーして打ち消そう！
          </p>
        </div>
      </div>

      {/* やる理由エリア（下部1/3） */}
      <div className="flex-1 bg-green-800 bg-opacity-90 p-4">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          <h3 className="text-xl font-bold text-white mb-3 text-center">やる理由（ホバーして重ねる）</h3>
          <div className="flex-1 flex gap-4 justify-center items-center">
            {validSets.map((set, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredDoReasonIndex(index)}
                onMouseLeave={() => setHoveredDoReasonIndex(null)}
                className={`p-6 rounded-lg font-bold text-center transition-all ${
                  hoveredDoReasonIndex === index
                    ? "bg-blue-500 text-white border-4 border-blue-300 scale-110 shadow-xl"
                    : "bg-blue-100 text-blue-800 border-2 border-blue-300 hover:bg-blue-200"
                } flex-1 max-w-xs`}
              >
                <div className="text-sm text-gray-600 mb-2">{set.action}</div>
                <div className="text-lg">{set.doReason}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 終了ボタン */}
      <div className="absolute top-20 right-4">
        <Button
          onClick={onExit}
          variant="outline"
          className="bg-white bg-opacity-80 hover:bg-opacity-100"
        >
          終了する
        </Button>
      </div>
    </div>
  )
}

// アンケート画面
const SurveyPage = ({
  enjoymentRating,
  improvementRating,
  setEnjoymentRating,
  setImprovementRating,
  onSubmit
}: {
  enjoymentRating: number
  improvementRating: number
  setEnjoymentRating: (rating: number) => void
  setImprovementRating: (rating: number) => void
  onSubmit: () => void
}) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in bg-gradient-to-b from-green-100 via-green-200 to-green-300">
      <div className="relative z-10 max-w-2xl w-full space-y-6">
        <div className="text-center bg-white bg-opacity-95 rounded-xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-green-800 mb-8">アンケート</h1>

          <div className="space-y-8">
            <div className="bg-white bg-opacity-90 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                このゲームは楽しかったですか？（1〜10）
              </h3>
              <input
                type="range"
                min="1"
                max="10"
                value={enjoymentRating}
                onChange={(e) => setEnjoymentRating(Number.parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-center text-gray-600 text-xl font-bold mt-2">{enjoymentRating}</p>
            </div>

            <div className="bg-white bg-opacity-90 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                このゲームで気分は改善されましたか？（1〜10）
              </h3>
              <input
                type="range"
                min="1"
                max="10"
                value={improvementRating}
                onChange={(e) => setImprovementRating(Number.parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-center text-gray-600 text-xl font-bold mt-2">{improvementRating}</p>
            </div>
          </div>

          <Button
            onClick={onSubmit}
            className="mt-8 bg-green-500 hover:bg-green-600 text-white px-8 py-3 w-full text-xl"
          >
            次へ
          </Button>
        </div>
      </div>
    </div>
  )
}

// 結果画面
const ResultPage = ({
  score,
  actionSets,
  enjoymentRating,
  improvementRating,
  onRestart,
  onExit
}: {
  score: number
  actionSets: ActionSet[]
  enjoymentRating: number
  improvementRating: number
  onRestart: () => void
  onExit: () => void
}) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const validSets = actionSets.filter(set =>
    set.action.trim() && set.notDoReason1.trim() && set.notDoReason2.trim() && set.doReason.trim() && set.benefit.trim()
  )

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in bg-gradient-to-b from-green-100 via-green-200 to-green-300">
      <div className="relative z-10 max-w-4xl w-full">
        <div className="text-center bg-white bg-opacity-95 rounded-xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-green-800 mb-6">ゲーム結果</h1>

          <div className="text-5xl font-bold text-green-700 mb-6">
            🏆 {score}pt
          </div>

          <div className="text-2xl font-bold text-purple-600 mb-6">
            ★yumeのゲーム　スクショしてSNSに投稿しよう！★
          </div>

          {/* 行動セットリスト */}
          {validSets.length > 0 && (
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                🎯 あなたの行動プラン
              </h2>
              <div className="space-y-4">
                {validSets.map((set, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm text-left">
                    <div className="flex items-start gap-3">
                      <span className="bg-green-500 text-white font-bold min-w-[32px] h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-700 mb-1">
                          <span className="font-bold text-green-700">行動：</span> {set.action}
                        </p>
                        <p className="text-gray-700 mb-1">
                          <span className="font-bold text-red-700">やらない理由1：</span> {set.notDoReason1}
                        </p>
                        <p className="text-gray-700 mb-1">
                          <span className="font-bold text-red-700">やらない理由2：</span> {set.notDoReason2}
                        </p>
                        <p className="text-gray-700 mb-1">
                          <span className="font-bold text-blue-700">やる理由：</span> {set.doReason}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-bold text-purple-700">得られる得：</span> {set.benefit}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* アフィリエイト */}
          <div className="mt-8 pt-8 border-t-2 border-gray-200">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">
              科学的なサポートで、さらに前進しませんか？
            </h2>
            <AffiliateComponent className="mx-auto" />
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-6">
          <Button
            onClick={onRestart}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-xl"
          >
            もう一度プレイ
          </Button>
          <Button
            onClick={onExit}
            className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 text-xl"
          >
            ホームに戻る
          </Button>
        </div>
      </div>
    </div>
  )
}

// メインコンポーネント
const LogicGame = () => {
  const router = useRouter()
  const [gameState, setGameState] = useState<"intro" | "input" | "game" | "survey" | "result">("intro")
  const [actionSets, setActionSets] = useState<ActionSet[]>([])
  const [score, setScore] = useState(0)
  const [enjoymentRating, setEnjoymentRating] = useState(5)
  const [improvementRating, setImprovementRating] = useState(5)

  const handleActionSetsComplete = (sets: ActionSet[]) => {
    setActionSets(sets)
    setGameState("game")
  }

  const handleGameComplete = (finalScore: number) => {
    setScore(finalScore)
    setGameState("survey")
  }

  const handleSurveySubmit = () => {
    // Supabaseにデータを保存
    if (supabase) {
      supabase.from("logic_game_responses").insert({
        score,
        action_sets: actionSets.filter(set =>
          set.action.trim() && set.notDoReason1.trim() && set.notDoReason2.trim() && set.doReason.trim() && set.benefit.trim()
        ).map(set => `行動: ${set.action}, やらない理由1: ${set.notDoReason1}, やらない理由2: ${set.notDoReason2}, やる理由: ${set.doReason}, 得: ${set.benefit}`),
        enjoyment_rating: enjoymentRating,
        improvement_rating: improvementRating
      }).then(({ error }) => {
        if (error) {
          console.error("データの保存に失敗しました:", error)
        } else {
          console.log("データが正常に保存されました")
        }
      })
    }

    setGameState("result")
  }

  const handleRestart = () => {
    setGameState("intro")
    setActionSets([])
    setScore(0)
    setEnjoymentRating(5)
    setImprovementRating(5)
  }

  const handleExit = () => {
    router.push("/")
  }

  return (
    <AnimatePresence mode="wait">
      {gameState === "intro" && <IntroPage key="intro" onStart={() => setGameState("input")} />}
      {gameState === "input" && (
        <InputPage
          key="input"
          actionSets={actionSets}
          onActionSetsComplete={handleActionSetsComplete}
          onExit={handleExit}
        />
      )}
      {gameState === "game" && (
        <GamePage
          key="game"
          actionSets={actionSets}
          onGameComplete={handleGameComplete}
          onExit={handleExit}
        />
      )}
      {gameState === "survey" && (
        <SurveyPage
          key="survey"
          enjoymentRating={enjoymentRating}
          improvementRating={improvementRating}
          setEnjoymentRating={setEnjoymentRating}
          setImprovementRating={setImprovementRating}
          onSubmit={handleSurveySubmit}
        />
      )}
      {gameState === "result" && (
        <ResultPage
          key="result"
          score={score}
          actionSets={actionSets}
          enjoymentRating={enjoymentRating}
          improvementRating={improvementRating}
          onRestart={handleRestart}
          onExit={handleExit}
        />
      )}
    </AnimatePresence>
  )
}

export default LogicGame
