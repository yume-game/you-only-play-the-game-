"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useRouter } from "next/navigation"
import ConfettiCanvas from "@/components/animations/ConfettiCanvas"

// ゲーム状態
type GameState =
  | "intro"
  | "question1"
  | "question2"
  | "question3"
  | "visualization"
  | "letterToFuture"
  | "result"

// アフィリエイトテキストパターン型
type AffiliateTextPattern = {
  headline: string
  description: string
}

// 猫動画リスト
const CAT_VIDEOS = [
  "/movie_output/second_half_animecat.mp4",
  "/movie_output/second_half_bangocat.mp4",
  "/movie_output/second_half_fatcat.mp4",
]

// アフィリエイトテキスト3パターン（expose.tsx と同仕様）
const affiliateTextPatterns: AffiliateTextPattern[] = [
  {
    headline: "「大切な人を心配させないために、あなたは回復する必要がある 」",
    description:
      "家のソファーで受けられるカウンセリングです。やさしくする重視のクリニックが多い中、心理学のマスター（公認心理士（国家資格））のみが在籍しているので、学問的な知識であなたを元気にします。",
  },
  {
    headline: "誰にも言えない話を聞いてもらってかつ科学によって回復できる",
    description:
      "やさしいだけカウンセリングではなく、心理学の国家資格公認心理士が100％のこのクリニックを予約してください。さらにオンラインなので家のソファーで受けられますよ。",
  },
  {
    headline:
      "あなたが心理学を利用したこのゲームで一瞬で変われたように 、心理学で助けてくれるクリニックです！",
    description:
      "カウンセリングは優しくしてくれるだけのところではありません。心理学という学問を学ぶ場でもあります。心理学のマスターしか在籍していない、クリニックがあります。オンラインなので家のソファーで受けられますよ。",
  },
]

// アフィリエイトバナーHTML（A8.net：変更禁止）
const AFFILIATE_BANNER_HTML = `<a href="https://px.a8.net/svt/ejp?a8mat=45167E+679KMQ+5OI8+5ZEMP" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www27.a8.net/svt/bgt?aid=250317482375&wid=001&eno=01&mid=s00000026504001005000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=45167E+679KMQ+5OI8+5ZEMP" alt="">`

// アフィリエイト予約ボタンHTML（A8.net：変更禁止）
const AFFILIATE_BUTTON_HTML = `<a href="https://px.a8.net/svt/ejp?a8mat=45167E+679KMQ+5OI8+BW8O2&a8ejpredirect=https%3A%2F%2Fkimochi-mental.com%2Fclient%2Fhome" rel="nofollow">今すぐ予約</a>
<img border="0" width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=45167E+679KMQ+5OI8+BW8O2" alt="">`

// ============================================================
// AffiliateComponent（expose.tsx と同仕様）
// ============================================================
const AffiliateComponent = ({
  className = "",
  affiliateTextPattern,
}: {
  className?: string
  affiliateTextPattern?: AffiliateTextPattern
}) => {
  return (
    <div className={`w-full mx-auto mt-2 mb-2 relative min-h-[400px] ${className}`}>
      {/* 背景画像 - PC版 */}
      <div className="absolute inset-0 hidden md:block">
        <Image src="/image/girlbackgroud.png" alt="背景" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-white/70" />
      </div>
      {/* 背景画像 - スマホ版 */}
      <div className="absolute inset-0 block md:hidden">
        <Image
          src="/image/girlbackgroud.png"
          alt="背景"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-white/70" />
      </div>

      <div
        className="relative z-10"
        style={{
          fontFamily: "'Hiragino Sans', 'Yu Gothic', sans-serif",
          margin: 0,
          padding: "10px",
          color: "#333",
          maxWidth: "600px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px",
          }}
          dangerouslySetInnerHTML={{ __html: AFFILIATE_BANNER_HTML }}
        />

        {affiliateTextPattern && (
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
              borderRadius: "8px",
            }}
          >
            {affiliateTextPattern.description}
          </div>
        )}

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
              cursor: "pointer",
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
            dangerouslySetInnerHTML={{ __html: AFFILIATE_BUTTON_HTML }}
          />
        </div>
      </div>
    </div>
  )
}

// 音声認識APIの型定義
interface SpeechRecognitionEvent {
  resultIndex: number
  results: {
    length: number
    [index: number]: {
      isFinal: boolean
      0: { transcript: string }
    }
  }
}

interface SpeechRecognitionErrorEvent {
  error: string
}

interface SpeechRecognitionInstance {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}

// 暗いパーティクル型
type DarkParticle = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  color: string
}

// 効果音フック
const useSound = (isMuted: boolean) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playSound = useCallback(
    (src: string): void => {
      if (isMuted) return
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      audioRef.current = new Audio(src)
      audioRef.current.volume = 0.5
      audioRef.current.play().catch(() => {})
    },
    [isMuted]
  )
  return playSound
}

// ============================================================
// IntroPage
// ============================================================
const IntroPage = ({
  onStart,
  isMuted,
  setIsMuted,
}: {
  onStart: () => void
  isMuted: boolean
  setIsMuted: (v: boolean) => void
}) => {
  const playSound = useSound(isMuted)

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "linear-gradient(to bottom, #1a1a2e, #16213e, #0f3460)" }}
    >
      <div className="w-full max-w-md space-y-6 text-center">
        <div>
          <p className="text-xs tracking-widest text-purple-300 uppercase mb-3 opacity-80">
            No-Regret Set
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
          >
            後悔しないセット
          </h1>
          <p className="text-purple-200 text-lg leading-relaxed">
            恐れを直視し、<br />
            本当にやりたいことへの<br />
            第一歩を踏み出そう。
          </p>
        </div>

        <div className="bg-white/10 rounded-2xl p-5 text-left space-y-3">
          <p className="text-white font-bold text-sm">このゲームでやること：</p>
          <div className="space-y-2 text-purple-200 text-sm">
            <p>❓ あなたの恐れを言語化する</p>
            <p>💭 本当にやりたいことを見つける</p>
            <p>🎯 叶う小さな行動を決める</p>
            <p>🧘 恐れを30秒間想像する</p>
          </div>
        </div>

        <button
          onClick={() => {
            playSound("/sound/nextpage.mp3")
            onStart()
          }}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-full text-lg shadow-lg hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all"
        >
          はじめる →
        </button>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-purple-300 text-sm underline"
        >
          {isMuted ? "🔇 ミュート中（タップで解除）" : "🔊 サウンドON（タップでミュート）"}
        </button>
      </div>
    </div>
  )
}

// ============================================================
// QuestionPage（expose.tsx の「何をする」入力画面を参考）
// ============================================================
const QuestionPage = ({
  question,
  placeholder,
  questionNumber,
  totalQuestions,
  value,
  onChange,
  onSubmit,
  totalPoints,
  isMuted,
  onExit,
  catVideo,
}: {
  question: string
  placeholder: string
  questionNumber: number
  totalQuestions: number
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  totalPoints: number
  isMuted: boolean
  onExit: () => void
  catVideo: string
}) => {
  const playSound = useSound(isMuted)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleSubmit = (): void => {
    if (!value.trim()) return
    playSound("/sound/100pt.mp3")
    setShowConfetti(true)
    setTimeout(() => {
      setShowConfetti(false)
      onSubmit()
    }, 1000)
  }

  const progress = (questionNumber / totalQuestions) * 100

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-purple-50">
      <ConfettiCanvas isActive={showConfetti} duration={1000} particleCount={40} points={300} />

      {/* 上部エリア */}
      <div className="flex-shrink-0 px-4 pt-4">
        {/* プログレスバー */}
        <div className="w-full max-w-md mx-auto mb-2">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 丸インジケーター */}
        <div className="flex justify-center gap-3 mb-2">
          {Array.from({ length: totalQuestions }, (_, i) => (
            <div
              key={i}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                i < questionNumber
                  ? "bg-purple-500 shadow-lg shadow-purple-500/50"
                  : "bg-gray-300"
              }`}
            >
              <span className="text-xs font-semibold text-white">Q{i + 1}</span>
            </div>
          ))}
        </div>

        {/* ポイント */}
        <div className="text-center text-purple-600 text-lg font-extrabold mb-2">
          🏆 {totalPoints}pt
        </div>

        {/* 質問文 */}
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-3 border-2 border-purple-400 mb-2 w-full max-w-md mx-auto">
          <p
            className="text-center text-purple-800 text-base font-bold px-2"
            style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
          >
            {question}
          </p>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* キャラと吹き出し */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border-4 border-purple-400 shadow-lg">
            <video
              src={catVideo}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
              loop
            />
          </div>
          <div className="relative bg-white rounded-2xl px-5 py-3 shadow-lg border-2 border-purple-300">
            <div className="absolute left-0 top-1/2 transform -translate-x-3 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-purple-300 border-b-8 border-b-transparent" />
            <p className="text-lg font-bold text-purple-700">Q{questionNumber}</p>
          </div>
        </div>

        {/* 回答表示ライン（expose.tsx の「何をする」画面の二本線エリアを参考） */}
        <div className="w-full max-w-md mb-2">
          <div className="border-b-2 border-gray-300 py-2 min-h-[40px] flex items-center justify-center">
            <span className={`text-lg ${value ? "text-gray-800 font-bold" : "text-gray-400"}`}>
              {value || "入力してください"}
            </span>
          </div>
          <div className="border-b-2 border-gray-300 h-1" />
        </div>

        {/* 入力エリア（expose.tsx の「何をする」：自由記述のみ） */}
        <div className="w-full max-w-md">
          <div className="p-3 rounded-xl border-4 border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-lg shadow-yellow-400/30">
            <p className="text-sm text-yellow-700 font-bold mb-1">自由記述 (+300pt)</p>
            <Input
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full text-base"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && value.trim()) handleSubmit()
              }}
            />
          </div>
        </div>
      </div>

      {/* 下部エリア */}
      <div className="flex-shrink-0 px-4 pb-8">
        <div className="w-full max-w-md mx-auto mb-4">
          <Button
            onClick={handleSubmit}
            disabled={!value.trim()}
            className={`w-full py-3 text-lg font-bold rounded-xl transition-all block ${
              value.trim()
                ? "bg-purple-500 hover:bg-purple-600 text-white shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            回答する
          </Button>
        </div>

        {/* アフィリエイトバナー（expose.tsx の ActionPlanPage と同仕様） */}
        <div className="w-full max-w-md mx-auto mb-6">
          <div
            className="flex justify-center"
            dangerouslySetInnerHTML={{ __html: AFFILIATE_BANNER_HTML }}
          />
        </div>

        <div className="w-full max-w-md mx-auto">
          <Button
            onClick={onExit}
            className="w-full py-2 text-purple-600 bg-transparent hover:bg-purple-50 border-0 text-sm block"
          >
            終了する
          </Button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// VisualizationPage（expose.tsx の AnxietyVisualizationPage を参考）
// ============================================================
const VisualizationPage = ({
  fearDescription,
  totalPoints,
  onComplete,
  onAddPoints,
  onExit,
  isMuted,
}: {
  fearDescription: string
  totalPoints: number
  onComplete: () => void
  onAddPoints: () => void
  onExit: () => void
  isMuted: boolean
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<DarkParticle[]>([])
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const lastTimeRef = useRef(0)

  const [elapsedTime, setElapsedTime] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [hasAddedPoints, setHasAddedPoints] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(true)
  const [micPermissionDenied, setMicPermissionDenied] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const playKirariSound = useCallback((): void => {
    if (isMuted) return
    const audio = new Audio("/sound/メルヘンチックなキラキラ音.mp3")
    audio.volume = 0.3
    audio.play().catch(() => {})
  }, [isMuted])

  const incrementTime = useCallback((): void => {
    setElapsedTime((prev) => {
      const next = Math.min(prev + 1, 30)
      if (next > prev) playKirariSound()
      return next
    })
  }, [playKirariSound])

  useEffect(() => {
    const win = window as unknown as Record<string, unknown>
    const SpeechRecognitionCtor =
      (win.SpeechRecognition as new () => SpeechRecognitionInstance) ||
      (win.webkitSpeechRecognition as new () => SpeechRecognitionInstance)

    if (!SpeechRecognitionCtor) {
      setSpeechSupported(false)
      return
    }

    const recognition = new SpeechRecognitionCtor()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "ja-JP"

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (transcript.length > 0) {
          const now = Date.now()
          if (now - lastTimeRef.current > 500) {
            lastTimeRef.current = now
            incrementTime()
          }
        }
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "not-allowed") setMicPermissionDenied(true)
      setIsListening(false)
    }

    recognition.onend = () => {
      if (isListening && !micPermissionDenied) {
        try {
          recognition.start()
        } catch {}
      }
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch {}
      }
    }
  }, [isListening, micPermissionDenied, incrementTime])

  useEffect(() => {
    if (elapsedTime >= 30 && !hasAddedPoints) {
      setHasAddedPoints(true)
      onAddPoints()
      if (!isMuted) {
        const audio = new Audio("/sound/300ptnextpage.mp3")
        audio.volume = 0.5
        audio.play().catch(() => {})
      }
      setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
        onComplete()
      }, 1500)
    }
  }, [elapsedTime, hasAddedPoints, onAddPoints, onComplete, isMuted])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = (): void => {
      canvas.width = window.innerWidth
      canvas.height = Math.max(container.scrollHeight, window.innerHeight * 2)
    }
    resize()
    window.addEventListener("resize", resize)

    const colors = ["#4c1d95", "#5b21b6", "#6d28d9", "#7c3aed", "#312e81", "#1e1b4b", "#3730a3"]
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 60; i++) {
        particlesRef.current.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight + window.innerHeight,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(Math.random() * 1.2 + 0.3),
          radius: Math.random() * 22 + 8,
          alpha: Math.random() * 0.25 + 0.08,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
    }

    let animId: number
    const animate = (): void => {
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height)
      grad.addColorStop(0, "#0f0f23")
      grad.addColorStop(1, "#1a0533")
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.y < -100) {
          p.y = canvas.height + 50
          p.x = Math.random() * canvas.width
          p.alpha = Math.random() * 0.25 + 0.08
        }
        if (p.x < -50) p.x = canvas.width + 50
        if (p.x > canvas.width + 50) p.x = -50
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        const hex = Math.floor(p.alpha * 255)
          .toString(16)
          .padStart(2, "0")
        ctx.fillStyle = `${p.color}${hex}`
        ctx.fill()
      })

      ctx.globalAlpha = 1
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  const startListening = (): void => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start()
        setIsListening(true)
        setMicPermissionDenied(false)
        lastTimeRef.current = Date.now()
      } catch {}
    }
  }

  const stopListening = (): void => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop()
        setIsListening(false)
      } catch {}
    }
  }

  const getProgress = (): number => (elapsedTime / 30) * 100

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col items-center p-6"
      style={{ background: "linear-gradient(to bottom, #0f0f23, #1a0533)" }}
    >
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <ConfettiCanvas isActive={showConfetti} duration={1000} particleCount={50} points={300} />

      <div className="w-full max-w-2xl space-y-6 relative z-10 pb-20">
        <div className="text-center py-4">
          <p className="text-xs tracking-widest text-purple-300 uppercase mb-3 opacity-80">
            Exposure
          </p>
          <h1
            className="text-3xl md:text-4xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
          >
            🧘 恐れを想像する
          </h1>
          <div className="text-purple-300 text-xl font-extrabold mt-2">🏆 {totalPoints}pt</div>
        </div>

        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 rounded-2xl p-6 shadow-xl border-4 border-purple-500/50">
          <p
            className="text-center text-white text-xl md:text-2xl font-black leading-relaxed mb-4"
            style={{
              fontFamily: "'Kosugi Maru', sans-serif",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            🔮 恐れているものを<br />想像してください
          </p>
          <p className="text-center text-purple-300 text-xs mb-3">
            例えば、行動した結果アンチが来ることが怖いなど
          </p>
          {fearDescription && (
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-center text-purple-200 text-base font-semibold">
                「{fearDescription}」
              </p>
            </div>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-500/30">
          <div className="text-center mb-4">
            <p className="text-white text-sm mb-2">想像タイム</p>
            <div className="text-5xl font-bold text-purple-300">
              {elapsedTime}
              <span className="text-2xl">秒</span>
            </div>
            <p className="text-purple-400 text-xs mt-1">目標: 30秒</p>
          </div>
          <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-purple-300 mt-1">
            <span>0秒</span>
            <span>30秒</span>
          </div>
        </div>

        {speechSupported && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-purple-500/30">
            <p className="text-center text-white text-sm mb-1 font-bold">
              🎤 声に出すと時間が進みます（任意）
            </p>
            <p className="text-center text-white text-base font-black mb-3">
              言われたら怖い言葉を自分で言ってみましょう
            </p>
            {micPermissionDenied ? (
              <p className="text-center text-red-300 text-sm">⚠️ マイクが許可されていません</p>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`px-8 py-3 rounded-full font-bold text-lg transition-all ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  }`}
                >
                  {isListening ? "🔴 停止する" : "🎙️ 話す"}
                </button>
              </div>
            )}
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30">
          <p className="text-center text-purple-200 text-sm mb-3">
            声を出さない場合は、想像した秒数だけタップ
          </p>
          <div className="flex justify-center">
            <button
              onClick={incrementTime}
              disabled={elapsedTime >= 30}
              className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all disabled:opacity-40"
            >
              +1秒
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onComplete}
            className="px-8 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg transition-all"
          >
            次へ
          </button>
        </div>

        <div className="text-center">
          <button onClick={onExit} className="text-purple-300 text-sm underline">
            終了する
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// LetterPage
// ============================================================
const LetterPage = ({
  letterTo,
  letterFrom,
  onChangeTo,
  onChangeFrom,
  onComplete,
  onExit,
}: {
  letterTo: string
  letterFrom: string
  onChangeTo: (v: string) => void
  onChangeFrom: (v: string) => void
  onComplete: () => void
  onExit: () => void
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-purple-950 p-6">
      <div className="w-full max-w-md mx-auto space-y-6 pb-10">
        <div className="text-center pt-6">
          <p className="text-xs tracking-widest text-purple-300 uppercase mb-3 opacity-80">
            Letter
          </p>
          <h1
            className="text-2xl font-bold text-white mb-2"
            style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
          >
            三年後の自分へ手紙を書こう
          </h1>
          <p className="text-purple-300 text-sm">
            三年後の自分と、三年後の自分からのメッセージを書いてみましょう
          </p>
        </div>

        {/* 三年後の自分へ */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-purple-500/30">
          <p className="text-white font-bold text-base mb-1">✉️ 三年後の自分へ</p>
          <p className="text-purple-300 text-xs mb-3">今の自分から三年後の自分へのメッセージ</p>
          <textarea
            value={letterTo}
            onChange={(e) => onChangeTo(e.target.value)}
            placeholder="三年後の自分へ..."
            rows={6}
            className="w-full bg-white/5 border border-purple-400/30 rounded-xl p-3 text-white placeholder-purple-400/50 text-sm resize-none focus:outline-none focus:border-purple-400"
          />
        </div>

        {/* 三年後の自分から */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-purple-500/30">
          <p className="text-white font-bold text-base mb-1">💌 三年後の自分から</p>
          <p className="text-purple-300 text-xs mb-3">三年後の自分が今の自分に送るメッセージを想像して書いてみましょう</p>
          <textarea
            value={letterFrom}
            onChange={(e) => onChangeFrom(e.target.value)}
            placeholder="三年後の自分から..."
            rows={6}
            className="w-full bg-white/5 border border-purple-400/30 rounded-xl p-3 text-white placeholder-purple-400/50 text-sm resize-none focus:outline-none focus:border-purple-400"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={onComplete}
            className="px-10 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg transition-all"
          >
            次へ
          </button>
        </div>

        <div className="text-center">
          <button onClick={onExit} className="text-purple-300 text-sm underline">
            終了する
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// ResultPage
// ============================================================
const ResultPage = ({
  answers,
  totalPoints,
  affiliateTextPattern,
  onRestart,
  onExit,
}: {
  answers: { fear: string; desire: string; smallAction: string }
  totalPoints: number
  affiliateTextPattern: AffiliateTextPattern
  onRestart: () => void
  onExit: () => void
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 p-6">
      <div className="w-full max-w-md mx-auto space-y-6 pb-10">
        <div className="text-center py-6">
          <h1
            className="text-4xl font-bold text-white mb-2"
            style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
          >
            🎉 完了！
          </h1>
          <div className="text-purple-300 text-2xl font-bold">🏆 {totalPoints}pt</div>
        </div>

        {/* 回答まとめ */}
        <div className="bg-white/15 rounded-2xl p-5 border border-purple-400/30">
          <p className="text-white font-bold text-lg mb-4">📝 あなたの後悔しないセット</p>
          <div className="space-y-4">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-purple-300 text-xs font-bold mb-1">Q1. あなたが恐れすぎていること</p>
              <p className="text-white font-semibold">{answers.fear || "（未回答）"}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-purple-300 text-xs font-bold mb-1">Q2. 誰もいないときにやりたいこと</p>
              <p className="text-white font-semibold">{answers.desire || "（未回答）"}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-purple-300 text-xs font-bold mb-1">Q3. それが叶う小さな行動</p>
              <p className="text-white font-semibold">{answers.smallAction || "（未回答）"}</p>
            </div>
          </div>
        </div>

        <div className="text-center text-purple-300 text-sm font-bold">
          ★yumeのゲーム　スクショしてSNSに投稿しよう！★
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={onRestart}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3"
          >
            もう一度
          </Button>
          <Button
            onClick={onExit}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3"
          >
            ホームへ
          </Button>
        </div>

        {/* アフィリエイト（expose.tsx の ResultPage と同仕様） */}
        <div className="mt-8 pt-8 border-t-2 border-purple-700/50">
          <h2 className="text-2xl font-bold text-orange-400 mt-4 mb-2 text-center">
            {affiliateTextPattern.headline}
          </h2>
          <div className="text-center">
            <AffiliateComponent className="mx-auto" affiliateTextPattern={affiliateTextPattern} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// NoRegretGame（メインコンポーネント）
// ============================================================
export default function NoRegretGame() {
  const router = useRouter()
  const [gameState, setGameState] = useState<GameState>("intro")
  const [isMuted, setIsMuted] = useState(false)
  const [totalPoints, setTotalPoints] = useState(0)
  const [fear, setFear] = useState("")
  const [desire, setDesire] = useState("")
  const [smallAction, setSmallAction] = useState("")
  const [letterTo, setLetterTo] = useState("")
  const [letterFrom, setLetterFrom] = useState("")
  const bgmRef = useRef<HTMLAudioElement | null>(null)

  // 各質問でランダムな猫動画を割り当て
  const [catVideos] = useState<string[]>(() =>
    [0, 1, 2].map(() => CAT_VIDEOS[Math.floor(Math.random() * CAT_VIDEOS.length)])
  )

  // アフィリエイトパターンをランダム選択
  const [affiliateTextPattern] = useState<AffiliateTextPattern>(
    () => affiliateTextPatterns[Math.floor(Math.random() * affiliateTextPatterns.length)]
  )

  const addPoints = (pts: number): void => setTotalPoints((prev) => prev + pts)

  // BGM管理
  useEffect(() => {
    const shouldPlay = gameState !== "intro" && gameState !== "result" && !isMuted
    if (shouldPlay) {
      if (!bgmRef.current) {
        bgmRef.current = new Audio("/sound/gamebgmchild.mp3")
        bgmRef.current.loop = true
        bgmRef.current.volume = 0.15
      }
      bgmRef.current.play().catch(() => {})
    } else {
      bgmRef.current?.pause()
    }
    return () => {
      bgmRef.current?.pause()
    }
  }, [gameState, isMuted])

  const handleRestart = (): void => {
    setGameState("intro")
    setTotalPoints(0)
    setFear("")
    setDesire("")
    setSmallAction("")
    setLetterTo("")
    setLetterFrom("")
  }

  const handleExit = (): void => {
    router.push("/")
  }

  if (gameState === "intro") {
    return (
      <IntroPage
        onStart={() => setGameState("question1")}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />
    )
  }

  if (gameState === "question1") {
    return (
      <QuestionPage
        question="あなたは何をするのに恐れすぎていましたか？"
        placeholder="例：知らない人に話しかけること"
        questionNumber={1}
        totalQuestions={3}
        value={fear}
        onChange={setFear}
        onSubmit={() => {
          addPoints(300)
          setGameState("question2")
        }}
        totalPoints={totalPoints}
        isMuted={isMuted}
        onExit={handleExit}
        catVideo={catVideos[0]}
      />
    )
  }

  if (gameState === "question2") {
    return (
      <QuestionPage
        question="あなたが誰もいないときにやりたいことは何ですか？"
        placeholder="例：大声で歌う、踊る"
        questionNumber={2}
        totalQuestions={3}
        value={desire}
        onChange={setDesire}
        onSubmit={() => {
          addPoints(300)
          setGameState("question3")
        }}
        totalPoints={totalPoints}
        isMuted={isMuted}
        onExit={handleExit}
        catVideo={catVideos[1]}
      />
    )
  }

  if (gameState === "question3") {
    return (
      <QuestionPage
        question="それが叶う小さな行動は何ですか？"
        placeholder="例：毎晩寝る前に1分だけやってみる"
        questionNumber={3}
        totalQuestions={3}
        value={smallAction}
        onChange={setSmallAction}
        onSubmit={() => {
          addPoints(300)
          setGameState("visualization")
        }}
        totalPoints={totalPoints}
        isMuted={isMuted}
        onExit={handleExit}
        catVideo={catVideos[2]}
      />
    )
  }

  if (gameState === "visualization") {
    return (
      <VisualizationPage
        fearDescription={fear}
        totalPoints={totalPoints}
        onComplete={() => setGameState("letterToFuture")}
        onAddPoints={() => addPoints(300)}
        onExit={handleExit}
        isMuted={isMuted}
      />
    )
  }

  if (gameState === "letterToFuture") {
    return (
      <LetterPage
        letterTo={letterTo}
        letterFrom={letterFrom}
        onChangeTo={setLetterTo}
        onChangeFrom={setLetterFrom}
        onComplete={() => setGameState("result")}
        onExit={handleExit}
      />
    )
  }

  return (
    <ResultPage
      answers={{ fear, desire, smallAction }}
      totalPoints={totalPoints}
      affiliateTextPattern={affiliateTextPattern}
      onRestart={handleRestart}
      onExit={handleExit}
    />
  )
}
