"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import ConfettiCanvas from "@/components/animations/ConfettiCanvas"
import DarkAnimationCanvas from "@/components/animations/DarkAnimationCanvas"
import { TermsOfService } from "@/components/terms-of-service/terms-of-service"
import { useLanguage } from "@/contexts/LanguageContext"
import { exposeTranslations, type TranslationKey } from "@/locales/expose-translations"

// Supabaseクライアントの設定（Selfworth用プロジェクト）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_SELFWORTH
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_SELFWORTH

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

// 行動プランの型定義
type ActionPlan = {
  when: string        // いつ
  where: string       // どこで
  what: string        // どんなことが起こる
}

// Leaf animation interface for canvas
interface Leaf {
  x: number
  y: number
  vx: number
  vy: number
  width: number
  height: number
  rotation: number
  rotationSpeed: number
  color: string
  alpha: number
  swayOffset: number
  swaySpeed: number
}

// 効果音再生用のカスタムフック
const useInteractionSounds = (isMuted: boolean) => {
  const typingAudioRef = useRef<HTMLAudioElement | null>(null)
  const hoverAudioRef = useRef<HTMLAudioElement | null>(null)

  const playTyping = useCallback(() => {
    if (isMuted) return
    if (!typingAudioRef.current) {
      typingAudioRef.current = new Audio('/sound/typing.mp3')
      typingAudioRef.current.volume = 0.3
    }
    typingAudioRef.current.currentTime = 0
    typingAudioRef.current.play().catch(() => {})
  }, [isMuted])

  const playClick = useCallback(() => {
    if (isMuted) return
    const audio = new Audio('/sound/typing.mp3')
    audio.volume = 0.4
    audio.play().catch(() => {})
  }, [isMuted])

  const playHover = useCallback(() => {
    if (isMuted) return
    if (!hoverAudioRef.current) {
      hoverAudioRef.current = new Audio('/sound/typing.mp3')
      hoverAudioRef.current.volume = 0.15
    }
    hoverAudioRef.current.currentTime = 0
    hoverAudioRef.current.play().catch(() => {})
  }, [isMuted])

  return { playTyping, playClick, playHover }
}

// アフィリエイト用のテキストパターン
const affiliateTextPatterns = [
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

const AffiliateComponent = ({ className = "", affiliateTextPattern }: { className?: string; affiliateTextPattern?: any }) => {
  const affiliateHtml = `<a href="https://px.a8.net/svt/ejp?a8mat=45167E+679KMQ+5OI8+5ZEMP" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www27.a8.net/svt/bgt?aid=250317482375&wid=001&eno=01&mid=s00000026504001005000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=45167E+679KMQ+5OI8+5ZEMP" alt="">`

  return (
    <div className={`w-full mx-auto mt-2 mb-2 relative min-h-[400px] ${className}`}>
      {/* 背景画像 - PC版 */}
      <div className="absolute inset-0 hidden md:block">
        <Image
          src="/image/ladywhoclever.png"
          alt="背景"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-white/70" />
      </div>
      {/* 背景画像 - スマホ版 */}
      <div className="absolute inset-0 block md:hidden">
        <Image
          src="/image/ladywhocleverphone.png"
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
          marginRight: "auto"
        }}
      >
        {/* アフィリエイトHTMLをそのまま挿入 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px"
          }}
          dangerouslySetInnerHTML={{ __html: affiliateHtml }}
        />

        {/* 説明文 */}
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
              borderRadius: "8px"
            }}
          >
            {affiliateTextPattern.description}
          </div>
        )}

        {/* ボタンコンテナ */}
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

// ローディングページ（黄緑色基調）- BGMプリロード機能付き
const LoadingPage = ({ onLoadComplete }: { onLoadComplete: () => void }) => {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('準備中...')
  const [audioLoaded, setAudioLoaded] = useState(false)

  const loadingMessages = [
    '準備中...',
    'BGMを読み込んでいます...',
    '効果音を準備中...',
    '完了間近です...',
  ]

  // プリロードする音声ファイル
  const audioFiles = [
    '/sound/gamebgmchild.mp3',  // メインBGM
    '/sound/nextpage.mp3',      // ページ遷移音
    '/sound/typing.mp3',        // タイピング音
    '/sound/100pt.mp3',         // ポイント音
    '/sound/point.mp3',         // 結果音
    '/sound/timeup.mp3',        // タイムアップ音
  ]

  useEffect(() => {
    let loadedCount = 0
    const totalFiles = audioFiles.length

    // 音声ファイルをプリロード
    const preloadAudio = () => {
      audioFiles.forEach((src) => {
        const audio = new Audio()
        audio.preload = 'auto'
        audio.src = src
        audio.addEventListener('canplaythrough', () => {
          loadedCount++
          setProgress((prev) => Math.min(prev + (70 / totalFiles), 70))
          if (loadedCount >= totalFiles) {
            setAudioLoaded(true)
          }
        }, { once: true })
        audio.addEventListener('error', () => {
          loadedCount++
          if (loadedCount >= totalFiles) {
            setAudioLoaded(true)
          }
        }, { once: true })
        // 読み込み開始
        audio.load()
      })
    }

    preloadAudio()

    // ローディングメッセージの切り替え
    const messageInterval = setInterval(() => {
      setLoadingText((prev) => {
        const currentIndex = loadingMessages.indexOf(prev)
        const nextIndex = (currentIndex + 1) % loadingMessages.length
        return loadingMessages[nextIndex]
      })
    }, 800)

    return () => {
      clearInterval(messageInterval)
    }
  }, [])

  // 音声ファイルがすべて読み込まれたらローディング完了
  useEffect(() => {
    if (audioLoaded) {
      setProgress(100)
      const timer = setTimeout(() => {
        onLoadComplete()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [audioLoaded, onLoadComplete])

  // フォールバック: 5秒経っても完了しない場合は強制的に完了
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!audioLoaded) {
        setProgress(100)
        setTimeout(() => {
          onLoadComplete()
        }, 500)
      }
    }, 5000)

    return () => clearTimeout(fallbackTimer)
  }, [audioLoaded, onLoadComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-lime-400 via-green-400 to-emerald-500 flex flex-col items-center justify-center z-50">
      {/* 背景の装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/20 animate-pulse"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 flex flex-col items-center">
        {/* ロゴ/アイコン */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center animate-bounce">
              <span className="text-4xl">🌿</span>
            </div>
          </div>
        </div>

        {/* タイトル */}
        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
          エクスポージャー
        </h1>
        <p className="text-white/80 mb-8 text-lg">心の回復ゲーム</p>

        {/* プログレスバー */}
        <div className="w-64 h-3 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
          <div
            className="h-full bg-white rounded-full transition-all duration-300 ease-out shadow-md"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* パーセンテージ */}
        <p className="mt-4 text-white font-bold text-xl drop-shadow">
          {Math.min(Math.round(progress), 100)}%
        </p>

        {/* ローディングメッセージ */}
        <p className="mt-2 text-white/90 text-sm animate-pulse">
          {loadingText}
        </p>

        {/* スピナー */}
        <div className="mt-6">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      </div>
    </div>
  )
}

const IntroPage = ({ onStart, isMuted, setIsMuted }: { onStart: () => void; isMuted: boolean; setIsMuted: (value: boolean) => void }) => {
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const { language } = useLanguage()
  const t = (key: TranslationKey) => exposeTranslations[language][key]
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 効果音再生
  const playSound = useCallback((soundFile: string) => {
    if (isMuted) return
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    audioRef.current = new Audio(soundFile)
    audioRef.current.volume = 0.5
    audioRef.current.play().catch(() => {})
  }, [isMuted])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-start md:justify-center animate-fade-in overflow-y-auto py-4 md:py-0">
      {/* 背景画像 - PC版 */}
      <div className="absolute inset-0 z-0 hidden md:block">
        <Image
          src="/image/ladywhoclever.png"
          alt="背景"
          fill
          className="object-cover object-top"
          priority
        />
      </div>
      {/* 背景画像 - スマホ版 */}
      <div className="absolute inset-0 z-0 block md:hidden">
        <Image
          src="/image/ladywhocleverphone.png"
          alt="背景"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      <div className="relative z-10 text-center space-y-4 md:space-y-6 bg-green-700 bg-opacity-70 p-4 md:p-8 rounded-lg max-w-2xl mx-4 my-4 md:my-0">
        <h1 className="text-4xl font-bold text-white">{t("intro_title")}</h1>
        <p className="text-lg text-white whitespace-pre-line">
          {t("intro_subtitle")}{"\n"}
          {t("intro_description")}
        </p>
        <p className="text-base text-red-300 font-bold">
          {t("intro_warning")}
        </p>
        <p className="text-base text-yellow-200 font-semibold">
          {t("intro_privacy")}
        </p>

        {/* 消音モードボタン */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all shadow-lg border-2 ${
              isMuted
                ? "bg-gray-700 hover:bg-gray-800 border-gray-500 text-white"
                : "bg-white hover:bg-yellow-50 border-yellow-400 text-gray-800"
            } font-bold`}
          >
            <span className="text-2xl">{isMuted ? "🔊" : "🔇"}</span>
            <span>{isMuted ? (language === "ja" ? "BGMをオンにする" : "Turn BGM On") : (language === "ja" ? "消音にする" : "Mute")}</span>
          </button>
        </div>

        {/* BGMの説明 */}
        <p className="text-sm text-yellow-200 text-center px-4">
          ※BGMがふざけているのは、感情を真剣にとらえないことで、不快感に向き合いやすくするためであります。
        </p>

        {/* 利用規約セクション */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => setIsTermsOpen(true)}
              className="text-white underline hover:text-green-200 transition-colors"
            >
              {t("intro_terms")}
            </button>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-8 h-8 rounded-full border-2 border-white cursor-pointer transition-all duration-300 hover:scale-125 hover:border-green-300 checked:scale-110 checked:bg-green-400"
              />
              <span className="text-white">{t("intro_agree")}</span>
            </label>
          </div>

          {/* 注意書き */}
          <p className="text-red-300 text-sm text-center mb-4">
            重度のトラウマなどお持ちの方は私のゲームではなく、精神科医にかかる事を推奨いたします
          </p>

          <Button
            onClick={() => {
              playSound('/sound/nextpage.mp3')
              onStart()
            }}
            disabled={!agreedToTerms}
            className={`bg-gradient-to-r from-green-500 to-green-700 hover:opacity-90 transition-opacity px-8 py-4 text-xl text-white ${
              !agreedToTerms ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {t("intro_start")}
          </Button>
        </div>
      </div>

      {/* 利用規約ポップアップ */}
      <TermsOfService isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </div>
  )
}

// クイズページ用の猫動画リスト
const QUIZ_CAT_VIDEOS = [
  '/movie_output/second_half_animecat.mp4',
  '/movie_output/second_half_bangocat.mp4',
  '/movie_output/second_half_fatcat.mp4',
]

// エクスポージャー理解クイズページ
const ExposureQuizPage = ({
  onComplete,
  onExit,
  totalPoints,
  setTotalPoints,
  isMuted,
  onWrongAnswersUpdate
}: {
  onComplete: () => void
  onExit: () => void
  totalPoints: number
  setTotalPoints: (value: number | ((prev: number) => number)) => void
  isMuted: boolean
  onWrongAnswersUpdate?: (wrongAnswers: number[]) => void
}) => {
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showPointAnimation, setShowPointAnimation] = useState(false)
  const [explainPage, setExplainPage] = useState(0) // 説明ページ（0, 1, 2）
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]) // 間違えた問題のインデックス
  const audioRef = useRef<HTMLAudioElement | null>(null)
  // 連続正解とキャラクター用のstate
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0)
  const [showCatVideo, setShowCatVideo] = useState(false)
  const [currentCatVideo] = useState(() => QUIZ_CAT_VIDEOS[Math.floor(Math.random() * QUIZ_CAT_VIDEOS.length)])
  // 説明ページ用の静止猫画像（ランダム選択）
  const [explainCatVideo] = useState(() => QUIZ_CAT_VIDEOS[Math.floor(Math.random() * QUIZ_CAT_VIDEOS.length)])
  const videoRef = useRef<HTMLVideoElement | null>(null)
  // 効果音フック
  const { playTyping, playClick, playHover } = useInteractionSounds(isMuted)

  // アフィリエイトHTML（CLAUDE.mdの指示に従い変更禁止）
  const affiliateHtml = `<a href="https://px.a8.net/svt/ejp?a8mat=45167E+679KMQ+5OI8+5ZEMP" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www27.a8.net/svt/bgt?aid=250317482375&wid=001&eno=01&mid=s00000026504001005000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=45167E+679KMQ+5OI8+5ZEMP" alt="">`

  // Wobbleアニメーション用のスタイル
  const wobbleAnimation = {
    animate: {
      rotate: [-1, 1, -1],
      transition: {
        duration: 0.3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  // 効果音再生
  const playSound = useCallback((soundFile: string) => {
    if (isMuted) return
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    audioRef.current = new Audio(soundFile)
    audioRef.current.volume = 0.5
    audioRef.current.play().catch(() => {})
  }, [isMuted])

  const questions = [
    {
      q: "エクスポージャーとはどのような治療法ですか？",
      options: [
        "薬を使って不安を抑える治療法",
        "怖いものに段階的に向き合い、脳に再学習させる治療法",
        "不安な気持ちをひたすら我慢する訓練"
      ],
      correct: 1,
      fb_correct: "✅ 正解！　エクスポージャーは、怖いトリガーに意図的・段階的に向き合うことで、脳に「これは本当は危険じゃない」と再学習させる行動療法です。",
      fb_wrong: "❌ 不正解。　エクスポージャーは薬でも我慢でもありません。怖いものに段階的に向き合い、脳に「安全だった」と繰り返し学習させることで不安を減らしていく治療法です。"
    },
    {
      q: "エクスポージャーが効果的な理由として、正しいものはどれですか？",
      options: [
        "怖いものに向き合い安全だった結果、脳が恐怖反応をださなくなるから",
        "不安を感じないようにリラックスできるようになるから",
        "怖いものの記憶が完全に消えるから"
      ],
      correct: 0,
      fb_correct: "✅ 正解！　怖いトリガーに繰り返しさらされ、何も悪いことが起きない体験を積むと、脳がそのトリガーへの恐怖反応を徐々に弱めていきます（これを「消去」といいます）。",
      fb_wrong: "❌ 不正解。　エクスポージャーの効果は「記憶を消す」でも「リラックスする」でもありません。実際には向き合い続けることで脳が恐怖反応を弱め、「危険じゃない」と学習し直すことで不安が減ります。"
    },
    {
      q: "不快感から逃げると、不快感はどうなるでしょう？",
      options: [
        "不安が少しずつ減っていく",
        "不安がさらに大きく強くなる",
        "何も変わらない"
      ],
      correct: 1,
      fb_correct: "✅ 正解！　回避すると脳は、自律神経をより活性化させ、さらに向き合うのを難しくします。生活への支障も大きくなっていきます。",
      fb_wrong: "❌ 不正解。　逃げることで一時は楽になっても、脳はまだ「危険だから逃げた」と学習しています。その結果、不安はどんどん大きくなります。"
    },
    {
      q: "危険なものに対してエクスポージャーをしてもいいですか？",
      options: [
        "はい",
        "いいえ",
        "どちらでもない"
      ],
      correct: 1,
      fb_correct: "✅ 正解！　危険じゃないものに出る誤認警報を直すことが正しく、正しい警報は消してはいけない",
      fb_wrong: "❌ 不正解。　危険なものに対して出る誤認警報を直すことが正しく、正しい警報は消してはいけない"
    },
    {
      q: "エクスポージャー中に不快感・不安感が高まったとき、その後どうなりますか？",
      options: [
        "向き合い続けると、不快感は徐々に減っていく",
        "向き合い続けるほど、不快感はずっと増え続ける",
        "すぐに消えるので心配しなくてよい"
      ],
      correct: 0,
      fb_correct: "✅ 正解！　不快感はピークを迎えた後、必ず落ち着いてきます。「ずっとこのまま」ということはありません。これを体験することが治療の大きな一歩です。",
      fb_wrong: "❌ 不正解。　怖い場面に向き合い続けると、不快感は一時的に高まるものの、必ず落ち着いていきます。永遠に続く不快感はありません。"
    }
  ]

  const handleSelectAnswer = (idx: number) => {
    if (answered) return
    setAnswered(true)
    setSelectedAnswer(idx)
    playClick() // クリック効果音
    if (idx === questions[currentQuestion].correct) {
      setScore(prev => prev + 1)
      // 連続正解カウント
      const newConsecutive = consecutiveCorrect + 1
      setConsecutiveCorrect(newConsecutive)
      // 連続正解ボーナス: 連続正解で300pt、通常100pt
      const points = newConsecutive >= 2 ? 300 : 100
      setTotalPoints((prev) => prev + points)
      playSound('/sound/100pt.mp3')
      setShowPointAnimation(true)
      // 正解時に猫動画を表示
      setShowCatVideo(true)
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.play().catch(() => {})
      }
      setTimeout(() => {
        setShowPointAnimation(false)
        setShowCatVideo(false)
      }, 1500)
    } else {
      // 間違えた問題を記録
      setWrongAnswers(prev => [...prev, currentQuestion])
      // 連続正解リセット
      setConsecutiveCorrect(0)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setAnswered(false)
      setSelectedAnswer(null)
    } else {
      setShowResult(true)
    }
  }

  const handleRetry = () => {
    setCurrentQuestion(0)
    setScore(0)
    setAnswered(false)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  // 説明カード表示（クイズ開始前）- 3ページに分割
  if (!quizStarted) {
    return (
      <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in overflow-y-auto"
        style={{ background: "#f5f7f2" }}>
        <div className="w-full max-w-2xl space-y-6 pb-20">
          {/* タイトル */}
          <div className="text-center py-4">
            <p className="text-xs tracking-widest text-green-600 uppercase mb-2 opacity-80">Exposure Therapy</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
              🌿 エクスポージャー理解チェック
            </h1>
            <p className="text-gray-500 text-sm mt-1">大切なポイントを確認しよう</p>
            {/* ページインジケーター */}
            <div className="flex justify-center gap-2 mt-3">
              {[0, 1, 2].map((page) => (
                <div
                  key={page}
                  className={`w-3 h-3 rounded-full transition-all ${
                    page === explainPage ? "bg-green-500 w-6" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* 猫の画像（静止） */}
            <div className="flex justify-center mt-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-green-400 shadow-lg">
                <video
                  src={explainCatVideo}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  preload="metadata"
                />
              </div>
            </div>
          </div>

          {/* ページ1: エクスポージャーとは何か？ */}
          {explainPage === 0 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              {/* クイズ点数の説明 */}
              <div className="bg-yellow-50 rounded-xl p-4 mb-6 border-2 border-yellow-300">
                <p className="text-yellow-800 font-bold text-center">
                  📝 この内容のクイズも点数になるよ！しっかり読んでね
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-green-400 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-green-400" />
                <h2 className="text-green-600 text-lg font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
                  <span>🌿</span> エクスポージャーとは何か？
                </h2>
                <div className="space-y-5">
                  <div className="flex gap-4 bg-green-50 p-4 rounded-xl">
                    <span className="text-3xl">💡</span>
                    <div>
                      <motion.p
                        className="font-bold text-base text-gray-800 mb-2"
                        animate={{ rotate: [-0.5, 0.5, -0.5] }}
                        transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        安全であるのに怖いものに向き合い、脳にこれは危険じゃないと学習させること
                      </motion.p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        エクスポージャーとは、まず、不快感を思い出すこと。それに対して
                        <span className="text-green-600 font-semibold">考えないようにしたりせず、苦しみを感じて、安全を感じる</span>ことで、
                        脳に「あ、これ危険だと思って不快感出してたけど、あんまり危険じゃないかも」と再学習させることで、脳は次の機会には不快感を出さないようになるというもの。
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 bg-green-50 p-4 rounded-xl">
                    <span className="text-3xl">🪜</span>
                    <div>
                      <motion.p
                        className="font-bold text-base text-gray-800 mb-2"
                        animate={{ rotate: [-0.5, 0.5, -0.5] }}
                        transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        怖さを10段階に分けて、簡単なものからやってみる
                      </motion.p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        いきなり一番怖いものに向き合う必要はない。怖さのレベルを1〜10に分け、
                        <span className="text-green-600 font-semibold">低いレベルから順番に</span>向き合っていく。
                        各段階で不安が十分に落ち着いてから次に進む。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ページ2: なぜエクスポージャーは効果的なのか？ */}
          {explainPage === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-green-400 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-green-400" />
                <h2 className="text-green-600 font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
                  <span>💖</span> なぜエクスポージャーは効果的なのか？
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-4 bg-green-50 p-4 rounded-xl">
                    <div className="w-8 h-8 min-w-[32px] bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-sm font-bold text-white">1</div>
                    <div>
                      <motion.p
                        className="font-bold text-base text-gray-800 mb-2"
                        animate={{ rotate: [-0.5, 0.5, -0.5] }}
                        transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        脳の学習能力を用いているから
                      </motion.p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        怖いトリガーに繰り返しさらされ、何も悪いことが起きない体験を積むと、
                        <span className="text-green-600 font-semibold">脳がトリガーへの恐怖反応を徐々に弱めていく</span>（これを「消去」という）。
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 bg-green-50 p-4 rounded-xl">
                    <div className="w-8 h-8 min-w-[32px] bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-sm font-bold text-white">2</div>
                    <div>
                      <motion.p
                        className="font-bold text-base text-gray-800 mb-2"
                        animate={{ rotate: [-0.5, 0.5, -0.5] }}
                        transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        逃げるという、さらに不快感が大きくなる行動ではないから
                      </motion.p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        回避をやめることで、脳は初めて<span className="text-green-600 font-semibold">「逃げなくても大丈夫だった」</span>という事実に触れられる。
                        逃げ続ける限り、<span className="text-green-600 font-semibold">この学習の機会は永遠に生まれない。</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 bg-green-50 p-4 rounded-xl">
                    <div className="w-8 h-8 min-w-[32px] bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-sm font-bold text-white">3</div>
                    <div>
                      <motion.p
                        className="font-bold text-base text-gray-800 mb-2"
                        animate={{ rotate: [-0.5, 0.5, -0.5] }}
                        transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        エクスポージャー中、不安はピークを越えると、自然に落ち着く
                      </motion.p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        人間の不安反応は、向き合い続ければ<span className="text-green-600 font-semibold">必ず徐々に減っていく</span>ことがわかっている。
                        「ずっとこの不快感が続く」は脳の勘違いで、実際には時間とともに落ち着く。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ページ3: 治療前に知ってほしいこと */}
          {explainPage === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-green-400 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-green-400" />
                <h2 className="text-green-600 font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
                  <span>💖</span> この三つの意識が、あなたのエクスポージャーをただす。
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-4 bg-green-50 p-4 rounded-xl">
                    <span className="text-3xl">💖</span>
                    <div>
                      <motion.p
                        className="font-bold text-base text-gray-800 mb-2"
                        animate={{ rotate: [-0.5, 0.5, -0.5] }}
                        transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        逃げは、いい戦略ではなかったことを意識
                      </motion.p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        怖いものから逃げると一時的に楽になる。しかし脳の
                        <span className="text-green-600 font-semibold">危険なものに対しては逃げよう</span>となったままであること。不快感から逃げないことが、危険じゃないものであると再学習する機会である。
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 bg-green-50 p-4 rounded-xl">
                    <span className="text-3xl">💖</span>
                    <div>
                      <motion.p
                        className="font-bold text-base text-gray-800 mb-2"
                        animate={{ rotate: [-0.5, 0.5, -0.5] }}
                        transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        不安は「誤作動した警報」である
                      </motion.p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        本来、不安は危険から身を守るために必要なもの。しかし今あなたが感じている不安は、
                        <span className="text-green-600 font-semibold">実際には危険でないものに対して鳴り続けている誤作動した警報</span>。
                        エクスポージャーはその警報をリセットする作業だ。
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 bg-green-50 p-4 rounded-xl">
                    <span className="text-3xl">💖</span>
                    <div>
                      <motion.p
                        className="font-bold text-base text-gray-800 mb-2"
                        animate={{ rotate: [-0.5, 0.5, -0.5] }}
                        transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        不快感とその安全な結果のセットは脳に学習の機会を与え、不快じゃなくする方法である。
                      </motion.p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        エクスポージャー中の不快感は効いているサイン。
                        <span className="text-green-600 font-semibold">向き合い続けることで、脳が安全な結果を学習し落ち着いていく</span>。
                        この体験を繰り返すことが、脳の再学習につながる。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ナビゲーションボタン */}
          <div className="text-center py-6 space-y-4">
            {explainPage < 2 ? (
              <button
                onClick={() => {
                  playSound('/sound/nextpage.mp3')
                  setExplainPage(prev => prev + 1)
                }}
                className="bg-gradient-to-r from-green-500 to-green-600 text-gray-900 font-black px-12 py-4 rounded-full text-base tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                次へ →
              </button>
            ) : (
              <button
                onClick={() => {
                  playSound('/sound/nextpage.mp3')
                  setQuizStarted(true)
                }}
                onMouseEnter={playHover}
                className="bg-gradient-to-r from-green-500 to-green-600 text-gray-900 font-black px-12 py-4 rounded-full text-base tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                🌿 理解度クイズに挑戦する →
              </button>
            )}

            {/* 戻るボタン（2ページ目以降） */}
            {explainPage > 0 && (
              <div>
                <button
                  onClick={() => {
                    playSound('/sound/nextpage.mp3')
                    setExplainPage(prev => prev - 1)
                  }}
                  className="text-green-600 hover:text-green-700 underline text-sm mr-4"
                >
                  ← 戻る
                </button>
              </div>
            )}

            {/* アフィリエイト画像 */}
            <div className="mt-6 flex justify-center">
              <div dangerouslySetInnerHTML={{ __html: affiliateHtml }} />
            </div>

            {/* 終了ボタン */}
            <div>
              <button
                onClick={() => {
                  playSound('/sound/nextpage.mp3')
                  onExit()
                }}
                className="text-gray-500 hover:text-gray-700 underline text-sm"
              >
                終了する
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // クイズ結果表示
  if (showResult) {
    const total = questions.length
    let icon = "🎉"
    let msg = ""
    let sub = ""
    if (score === total) {
      icon = "🌟"
      msg = "完璧！準備バッチリです"
      sub = "エクスポージャーの大切なポイントをすべて理解できています。不快感は一時的なものであり、向き合うことで必ず楽になります。治療を一歩一歩進めていきましょう。"
    } else if (score >= 3) {
      icon = "👍"
      msg = "よくできました！ほぼ理解できています"
      sub = "大部分は理解できています。間違えた問題の解説をもう一度確認して、治療のポイントをしっかり押さえましょう。"
    } else {
      icon = "📚"
      msg = "もう一度、一緒に確認しよう"
      sub = "上の説明をもう一度読んでから、再チャレンジしてみてください。理解が深まるほど、治療の効果も上がります。"
    }

    return (
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in overflow-y-auto"
        style={{ background: "#f5f7f2" }}>
        <div className="text-center space-y-6 max-w-md">
          <div className="text-6xl">{icon}</div>
          <div className="text-5xl font-bold text-green-600 font-serif">{score} / {total}</div>
          <div className="text-lg font-bold text-gray-800">{msg}</div>
          <p className="text-sm text-gray-500 max-w-md leading-relaxed">{sub}</p>
          {wrongAnswers.length > 0 && (
            <p className="text-sm text-orange-600 font-semibold">
              📝 間違えた問題は後で復習できます！
            </p>
          )}
          <div className="flex gap-4 justify-center pt-4">
            <button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                handleRetry()
              }}
              className="border-2 border-green-500 text-green-600 font-bold px-8 py-3 rounded-full hover:bg-green-500 hover:text-white transition-all"
            >
              もう一度チャレンジ
            </button>
            <button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                if (onWrongAnswersUpdate) {
                  onWrongAnswersUpdate(wrongAnswers)
                }
                onComplete()
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-gray-900 font-black px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              次へ進む →
            </button>
          </div>

          {/* アフィリエイト画像 */}
          <div className="pt-4 flex justify-center">
            <div dangerouslySetInnerHTML={{ __html: affiliateHtml }} />
          </div>

          <div className="pt-4">
            <button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                onExit()
              }}
              className="text-gray-500 hover:text-gray-700 underline text-sm"
            >
              終了する
            </button>
          </div>
        </div>
      </div>
    )
  }

  // クイズ表示
  const q = questions[currentQuestion]
  const progress = ((currentQuestion) / questions.length) * 100

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in"
      style={{ background: "#f5f7f2" }}>
      {/* ポイントアニメーション */}
      <ConfettiCanvas isActive={showPointAnimation} duration={1000} particleCount={30} points={consecutiveCorrect >= 2 ? 300 : 100} />

      {/* 正解時の猫動画 */}
      <AnimatePresence>
        {showCatVideo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="w-48 h-48 rounded-full overflow-hidden shadow-2xl border-4 border-green-400">
              <video
                ref={videoRef}
                src={currentCatVideo}
                className="w-full h-full object-cover"
                muted
                playsInline
                autoPlay
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-2xl space-y-6">
        {/* ポイント表示と連続正解ボーナス */}
        <div className="flex justify-between items-center">
          {consecutiveCorrect >= 2 && (
            <div className="text-orange-500 text-sm font-bold animate-pulse">
              🔥 {consecutiveCorrect}連続正解！ボーナス+300pt
            </div>
          )}
          <div className="text-green-600 text-xl font-extrabold ml-auto">🏆 {totalPoints}pt</div>
        </div>

        {/* プログレスバー */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-400"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap">{currentQuestion + 1} / {questions.length}</span>
        </div>

        {/* 猫と吹き出し付きの問題文 */}
        <div className="flex items-start gap-4">
          {/* 猫（正解時に動く） */}
          <div className={`w-20 h-20 rounded-full overflow-hidden border-4 border-green-400 shadow-lg flex-shrink-0 ${showCatVideo ? 'animate-bounce' : ''}`}>
            <video
              ref={videoRef}
              src={currentCatVideo}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
              autoPlay={showCatVideo}
            />
          </div>
          {/* 吹き出し付き問題文 */}
          <div className="relative flex-1 bg-white rounded-2xl p-4 shadow-md border-2 border-green-300">
            {/* 吹き出しの三角形 */}
            <div className="absolute left-0 top-6 transform -translate-x-2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-green-300 border-b-8 border-b-transparent" />
            <p className="text-xs tracking-widest text-green-600 mb-2 opacity-70">
              QUESTION {String(currentQuestion + 1).padStart(2, "0")}
            </p>
            <p className="text-base font-bold leading-relaxed" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>{q.q}</p>
          </div>
        </div>

        {/* クイズカード */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-green-100">

          {/* 選択肢 */}
          <div className="space-y-3">
            {q.options.map((opt, i) => {
              let optionClass = "bg-gray-50 border-green-100 hover:border-green-500 hover:bg-green-50 hover:translate-x-1"
              if (answered) {
                if (i === q.correct) {
                  optionClass = "bg-green-50 border-green-500"
                } else if (i === selectedAnswer && i !== q.correct) {
                  optionClass = "bg-red-50 border-red-400"
                } else {
                  optionClass = "bg-gray-50 border-gray-200 opacity-60"
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelectAnswer(i)}
                  disabled={answered}
                  className={`w-full text-left border-2 rounded-xl p-4 text-sm flex items-center gap-3 transition-all ${optionClass} ${answered ? "cursor-default" : "cursor-pointer"}`}
                >
                  <span className={`w-6 h-6 min-w-[24px] rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    answered && i === q.correct ? "border-green-500 text-green-600 bg-green-100" :
                    answered && i === selectedAnswer && i !== q.correct ? "border-red-400 text-red-500 bg-red-100" :
                    "border-gray-400 text-gray-500"
                  }`}>
                    {answered ? (i === q.correct ? "✓" : (i === selectedAnswer ? "✗" : String.fromCharCode(65 + i))) : String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>

          {/* フィードバック */}
          {answered && (
            <div className={`mt-5 p-4 rounded-lg text-sm leading-relaxed ${
              selectedAnswer === q.correct
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-600"
            }`}>
              {selectedAnswer === q.correct ? q.fb_correct : q.fb_wrong}
            </div>
          )}

          {/* 次へボタン */}
          {answered && (
            <div className="mt-5 text-center">
              <button
                onClick={() => {
                  playSound('/sound/nextpage.mp3')
                  handleNextQuestion()
                }}
                className="border-2 border-green-500 text-green-600 font-bold px-8 py-3 rounded-full hover:bg-green-500 hover:text-white transition-all"
              >
                {currentQuestion < questions.length - 1 ? "次の問題へ →" : "結果を見る →"}
              </button>
            </div>
          )}

          {/* アフィリエイト画像 */}
          <div className="mt-5 flex justify-center">
            <div dangerouslySetInnerHTML={{ __html: affiliateHtml }} />
          </div>

          {/* 終了ボタン */}
          <div className="mt-5 text-center">
            <button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                onExit()
              }}
              className="text-gray-500 hover:text-gray-700 underline text-sm"
            >
              終了する
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// クイズ復習ページ（間違えた問題のみ表示）
const QuizReviewPage = ({
  wrongAnswers,
  totalPoints,
  setTotalPoints,
  onComplete,
  onExit,
  isMuted
}: {
  wrongAnswers: number[]
  totalPoints: number
  setTotalPoints: (value: number | ((prev: number) => number)) => void
  onComplete: () => void
  onExit: () => void
  isMuted: boolean
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showPointAnimation, setShowPointAnimation] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const affiliateHtml = `<a href="https://px.a8.net/svt/ejp?a8mat=45167E+679KMQ+5OI8+5ZEMP" rel="nofollow"><img border="0" width="300" height="250" alt="" src="https://www27.a8.net/svt/bgt?aid=250317482375&wid=001&eno=01&mid=s00000026504001005000&mc=1"></a><img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=45167E+679KMQ+5OI8+5ZEMP" alt="">`

  const playSound = useCallback((soundFile: string) => {
    if (isMuted) return
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0 }
    audioRef.current = new Audio(soundFile)
    audioRef.current.volume = 0.5
    audioRef.current.play().catch(() => {})
  }, [isMuted])

  const allQuestions = [
    { q: "エクスポージャーとはどのような治療法ですか？", options: ["薬を使って不安を抑える治療法", "怖いものに段階的に向き合い、脳に再学習させる治療法", "不安な気持ちをひたすら我慢する訓練"], correct: 1, fb_correct: "✅ 正解！", fb_wrong: "❌ 不正解。怖いものに段階的に向き合い、脳に再学習させる治療法です。" },
    { q: "エクスポージャーが効果的な理由として、正しいものはどれですか？", options: ["怖いものに向き合い安全だった結果、脳が恐怖反応をださなくなるから", "不安を感じないようにリラックスできるようになるから", "怖いものの記憶が完全に消えるから"], correct: 0, fb_correct: "✅ 正解！", fb_wrong: "❌ 不正解。脳が恐怖反応を弱めていくからです。" },
    { q: "不快感から逃げると、不快感はどうなるでしょう？", options: ["不安が少しずつ減っていく", "不安がさらに大きく強くなる", "何も変わらない"], correct: 1, fb_correct: "✅ 正解！", fb_wrong: "❌ 不正解。逃げると不安はさらに大きくなります。" },
    { q: "危険なものに対してエクスポージャーをしてもいいですか？", options: ["はい", "いいえ", "どちらでもない"], correct: 1, fb_correct: "✅ 正解！", fb_wrong: "❌ 不正解。危険なものには行いません。" },
    { q: "エクスポージャー中に不快感・不安感が高まったとき、その後どうなりますか？", options: ["向き合い続けると、不快感は徐々に減っていく", "向き合い続けるほど、不快感はずっと増え続ける", "すぐに消えるので心配しなくてよい"], correct: 0, fb_correct: "✅ 正解！", fb_wrong: "❌ 不正解。不快感は徐々に減っていきます。" }
  ]

  const questions = wrongAnswers.map(idx => allQuestions[idx])
  const currentQuestion = questions[currentIndex]
  if (!currentQuestion) return null

  const handleSelectAnswer = (idx: number) => {
    if (answered) return
    setAnswered(true)
    setSelectedAnswer(idx)
    if (idx === currentQuestion.correct) {
      setTotalPoints((prev) => prev + 50)
      playSound('/sound/100pt.mp3')
      setShowPointAnimation(true)
      setTimeout(() => setShowPointAnimation(false), 1000)
    }
  }

  const handleNext = () => {
    playSound('/sound/nextpage.mp3')
    if (currentIndex < questions.length - 1) { setCurrentIndex(prev => prev + 1); setAnswered(false); setSelectedAnswer(null) }
    else { onComplete() }
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in overflow-y-auto" style={{ background: "#f5f7f2" }}>
      <ConfettiCanvas isActive={showPointAnimation} duration={1000} particleCount={30} points={50} />
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center py-4"><h1 className="text-2xl font-bold text-gray-800">💖 間違えた問題の復習 💖</h1><p className="text-sm text-gray-500 mt-2">正解すると50pt獲得できます！</p></div>
        <div className="flex justify-end"><div className="text-green-600 text-xl font-extrabold">🏆 {totalPoints}pt</div></div>
        <div className="flex items-center gap-3"><div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all" style={{ width: `${(currentIndex / questions.length) * 100}%` }} /></div><span className="text-xs text-gray-500">{currentIndex + 1} / {questions.length}</span></div>
        <div className="bg-white rounded-2xl p-8 shadow-md border border-orange-100">
          <p className="text-xs tracking-widest text-orange-600 mb-4">💖 復習問題 {String(currentIndex + 1).padStart(2, "0")}</p>
          <p className="text-lg font-bold leading-relaxed mb-7">{currentQuestion.q}</p>
          <div className="space-y-3">{currentQuestion.options.map((opt, i) => (<button key={i} onClick={() => handleSelectAnswer(i)} disabled={answered} className={`w-full text-left border-2 rounded-xl p-4 text-sm flex items-center gap-3 transition-all ${answered ? (i === currentQuestion.correct ? "bg-green-50 border-green-500" : i === selectedAnswer ? "bg-red-50 border-red-400" : "bg-gray-50 border-gray-200 opacity-60") : "bg-gray-50 border-orange-100 hover:border-orange-500"}`}><span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${answered && i === currentQuestion.correct ? "border-green-500 text-green-600 bg-green-100" : answered && i === selectedAnswer ? "border-red-400 text-red-500 bg-red-100" : "border-gray-400 text-gray-500"}`}>{answered ? (i === currentQuestion.correct ? "✓" : i === selectedAnswer ? "✗" : String.fromCharCode(65 + i)) : String.fromCharCode(65 + i)}</span>{opt}</button>))}</div>
          {answered && (<div className={`mt-5 p-4 rounded-lg text-sm ${selectedAnswer === currentQuestion.correct ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-600"}`}>{selectedAnswer === currentQuestion.correct ? currentQuestion.fb_correct : currentQuestion.fb_wrong}</div>)}
          {answered && (<div className="mt-5 text-center"><button onClick={handleNext} className="border-2 border-orange-500 text-orange-600 font-bold px-8 py-3 rounded-full hover:bg-orange-500 hover:text-white transition-all">{currentIndex < questions.length - 1 ? "次の問題へ →" : "復習完了！ →"}</button></div>)}
          <div className="mt-5 flex justify-center"><div dangerouslySetInnerHTML={{ __html: affiliateHtml }} /></div>
          <div className="mt-5 text-center"><button onClick={onExit} className="text-gray-500 hover:text-gray-700 underline text-sm">終了する</button></div>
        </div>
      </div>
    </div>
  )
}

// 統合プロフィールセットアップページ（理解度チェックUIに統一）
const ProfileSetupPage = ({
  gender,
  setGender,
  ageGroup,
  setAgeGroup,
  valuableThings,
  setValuableThings,
  selfCareAnswer,
  setSelfCareAnswer,
  whyAnswers,
  setWhyAnswers,
  strongestDesire,
  setStrongestDesire,
  discomfortOrigin,
  setDiscomfortOrigin,
  fearDescription,
  setFearDescription,
  totalPoints,
  setTotalPoints,
  onComplete,
  onExit,
  isMuted,
}: {
  gender: string
  setGender: (value: string) => void
  ageGroup: string
  setAgeGroup: (value: string) => void
  valuableThings: string
  setValuableThings: (value: string) => void
  selfCareAnswer: string
  setSelfCareAnswer: (value: string) => void
  whyAnswers: string[]
  setWhyAnswers: (value: string[]) => void
  strongestDesire: number | null
  setStrongestDesire: (value: number | null) => void
  discomfortOrigin: string
  setDiscomfortOrigin: (value: string) => void
  fearDescription: string
  setFearDescription: (value: string) => void
  totalPoints: number
  setTotalPoints: (value: number | ((prev: number) => number)) => void
  onComplete: () => void
  onExit: () => void
  isMuted: boolean
}) => {
  const { language } = useLanguage()
  const [showConfetti, setShowConfetti] = useState(false)
  const [currentPoints, setCurrentPoints] = useState(0)
  const [showDiligentMessage, setShowDiligentMessage] = useState(false)
  const [completedWhyFields, setCompletedWhyFields] = useState<boolean[]>([false, false, false, false, false])
  const [discomfortCompleted, setDiscomfortCompleted] = useState(false)
  const [fearCompleted, setFearCompleted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  // 効果音フック
  const { playTyping, playClick, playHover } = useInteractionSounds(isMuted)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // 効果音再生
  const playSound = useCallback((soundFile: string) => {
    if (isMuted) return
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    audioRef.current = new Audio(soundFile)
    audioRef.current.volume = 0.5
    audioRef.current.play().catch(() => {})
  }, [isMuted])

  // 自分を大切にする行動の回答処理（300pt）
  const handleSelfCareSelect = (answer: string) => {
    if (selfCareAnswer) return // 既に回答済み
    setSelfCareAnswer(answer)
    setTotalPoints((prev) => prev + 300)
    setCurrentPoints(300)
    playSound('/sound/100pt.mp3')
    setShowConfetti(true)
    setTimeout(() => {
      setShowConfetti(false)
      setShowDiligentMessage(true)
    }, 1000)
  }

  // なぜワークの入力完了処理（各100pt）
  const handleWhyFieldBlur = (index: number, value: string) => {
    if (value.trim() && !completedWhyFields[index]) {
      const newCompleted = [...completedWhyFields]
      newCompleted[index] = true
      setCompletedWhyFields(newCompleted)
      setTotalPoints((prev) => prev + 100)
      setCurrentPoints(100)
      playSound('/sound/100pt.mp3')
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 1000)
    }
  }

  // 不快感の始まり入力完了処理（100pt）
  const handleDiscomfortBlur = (value: string) => {
    if (value.trim() && !discomfortCompleted) {
      setDiscomfortCompleted(true)
      setTotalPoints((prev) => prev + 100)
      setCurrentPoints(100)
      playSound('/sound/100pt.mp3')
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 1000)
    }
  }

  // 恐れているもの入力完了処理（100pt）
  const handleFearBlur = (value: string) => {
    if (value.trim() && !fearCompleted) {
      setFearCompleted(true)
      setTotalPoints((prev) => prev + 100)
      setCurrentPoints(100)
      playSound('/sound/100pt.mp3')
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 1000)
    }
  }

  // 次へ進む条件（全部埋めなくても進めるように緩和）
  const canProceed = true

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in overflow-y-auto"
      style={{ background: "#f5f7f2" }}>
      <ConfettiCanvas isActive={showConfetti} duration={1000} particleCount={50} points={currentPoints} />

      <div className="w-full max-w-2xl space-y-6 pb-20">
        {/* タイトルとポイント */}
        <div className="text-center py-4">
          <p className="text-xs tracking-widest text-green-600 uppercase mb-2 opacity-80">Profile Setup</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-serif leading-tight">
            💕 あなたについて教えてください 💕
          </h1>
          <p className="text-sm text-pink-400 mt-1">💗💗💗</p>
          <p className="text-sm text-gray-500 mt-1">（自由記述です。入力しなくても次へ進めます）</p>
          <div className="text-green-600 text-xl font-extrabold mt-2">🏆 {totalPoints}pt</div>
        </div>

        {/* カード1: 性別・年代 */}
        <div className="bg-white rounded-2xl p-7 shadow-md border border-green-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-400" />
          <h2 className="text-green-600 font-serif text-base mb-5 flex items-center gap-2">
            <span>👤</span> 基本情報
          </h2>
          <div className="space-y-4">
            {/* 性別 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">性別</label>
              <div className="flex flex-wrap gap-2">
                {["男性", "女性", "その他", "回答しない"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setGender(option)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm transition-all ${
                      gender === option
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-gray-50 text-gray-700 border-green-100 hover:border-green-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            {/* 年代 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">年代</label>
              <div className="flex flex-wrap gap-2">
                {["10代", "20代", "30代", "40代", "50代", "60代以上"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setAgeGroup(option)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm transition-all ${
                      ageGroup === option
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-gray-50 text-gray-700 border-green-100 hover:border-green-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* カード2: 自分を大切にする行動（300pt） */}
        <div className="bg-white rounded-2xl p-7 shadow-md border border-green-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-400" />
          <h2 className="text-green-600 font-serif text-base mb-5 flex items-center gap-2">
            <span>💚</span> 自己ケア
            <span className="ml-auto text-yellow-600 text-sm font-bold">+300pt</span>
          </h2>
          <p className="text-lg font-bold text-gray-800 mb-4">
            あなたは自分のことを大切にする行動をしていますか？
          </p>
          <div className="flex flex-wrap gap-3">
            {["はい", "いいえ", "どちらでもない"].map((option) => (
              <button
                key={option}
                onClick={() => handleSelfCareSelect(option)}
                disabled={!!selfCareAnswer}
                className={`px-6 py-3 rounded-xl border-2 text-base font-medium transition-all ${
                  selfCareAnswer === option
                    ? "bg-green-500 text-white border-green-500"
                    : selfCareAnswer
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-gray-50 text-gray-700 border-green-100 hover:border-green-500 hover:bg-green-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {showDiligentMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
            >
              <p className="text-yellow-700 font-bold text-center">🌟 勤勉な人だ！ 🌟</p>
            </motion.div>
          )}
        </div>

        {/* カード3: なぜを問うワーク（各100pt） */}
        <div className="bg-white rounded-2xl p-7 shadow-md border border-green-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-400" />
          <h2 className="text-green-600 font-serif text-base mb-3 flex items-center gap-2">
            <span>🔍</span> 強い欲求を見つけるワーク
            <span className="ml-auto text-yellow-600 text-sm font-bold">各+100pt</span>
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            あなたを不快感に向かわせるモチベーションとしてあなたの欲求を見つけましょう。<br />
            あなたの欲しいものについて５回どうしてと問いた先があなたの感情です。
          </p>

          <div className="space-y-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <div key={index}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-600 font-bold text-sm">{index + 1}.</span>
                  {completedWhyFields[index] && <span className="text-green-500 text-xs">✓ +100pt</span>}
                </div>
                <Input
                  type="text"
                  value={whyAnswers[index] || ''}
                  onChange={(e) => {
                    const newAnswers = [...whyAnswers]
                    newAnswers[index] = e.target.value
                    setWhyAnswers(newAnswers)
                  }}
                  onBlur={(e) => handleWhyFieldBlur(index, e.target.value)}
                  placeholder={index === 0 ? "あなたが価値あると思っていることは何ですか？" : "それはどうしてですか？"}
                  className="w-full border-2 border-green-200 rounded-xl focus:border-green-500"
                />
                {index < 4 && (
                  <div className="flex flex-col items-center my-2">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span className="text-green-600 text-xs font-bold">どうして？</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* カード5: 強い欲求の選択 */}
        <div className="bg-white rounded-2xl p-7 shadow-md border border-green-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-400" />
          <h2 className="text-green-600 font-serif text-base mb-5 flex items-center gap-2">
            <span>⭐</span> 一番強い欲求を選択
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            上の1〜5番の中から、一番あなたの強い欲求として当てはまるものを選んでください。<br />
            <span className="text-green-600 font-bold">この選択はゲーム中ずっと表示されます。</span>
          </p>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => setStrongestDesire(num)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                  strongestDesire === num
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-gray-50 text-gray-700 border-green-100 hover:border-green-500"
                }`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  strongestDesire === num ? "bg-white text-green-600" : "bg-green-100 text-green-600"
                }`}>
                  {num}
                </span>
                <span className="text-sm">
                  {whyAnswers[num - 1] || `（${num}番目の回答を入力してください）`}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* カード6: 不快感の始まり（100pt） */}
        <div className="bg-white rounded-2xl p-7 shadow-md border border-green-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-400" />
          <h2 className="text-green-600 font-serif text-base mb-5 flex items-center gap-2">
            <span>🌱</span> 不快感の起源
            <span className="ml-auto text-yellow-600 text-sm font-bold">+100pt</span>
            {discomfortCompleted && <span className="text-green-500 text-xs">✓</span>}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            あなたの不快感の始まりだと考えられるのは何ですか？<br />
            <span className="text-gray-500 text-xs">（この質問はエクスポージャーに取り組むのに役立ちます）</span>
          </p>
          <textarea
            value={discomfortOrigin}
            onChange={(e) => setDiscomfortOrigin(e.target.value)}
            onBlur={(e) => handleDiscomfortBlur(e.target.value)}
            onKeyDown={playTyping}
            placeholder="例：幼少期の経験、特定の出来事、人間関係など"
            className="w-full h-24 p-4 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none resize-none text-sm"
          />
        </div>

        {/* カード7: あなたが解決したい不快感（100pt） */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 shadow-lg border-4 border-orange-400 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 to-red-400" />
          <h2 className="text-orange-600 font-bold text-lg mb-3 flex items-center gap-2" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            <span>🎯</span> あなたが解決したい不快感を書いてください
            <span className="ml-auto text-yellow-600 text-sm font-bold">+100pt</span>
            {fearCompleted && <span className="text-green-500 text-xs">✓</span>}
          </h2>
          <p className="text-sm text-orange-700 mb-3">
            エクスポージャーで向き合いたい不安や恐れを具体的に書いてください。
          </p>
          <textarea
            value={fearDescription}
            onChange={(e) => setFearDescription(e.target.value)}
            onBlur={(e) => handleFearBlur(e.target.value)}
            onKeyDown={playTyping}
            placeholder="例：人前で話すこと、失敗すること、拒絶されること、高所、特定の状況など"
            className="w-full h-28 p-4 border-2 border-orange-300 rounded-xl focus:border-orange-500 focus:outline-none resize-none text-base"
          />
        </div>

        {/* 次へボタン */}
        <div className="text-center py-6 space-y-4">
          <button
            onClick={() => {
              playSound('/sound/nextpage.mp3')
              onComplete()
            }}
            disabled={!canProceed}
            className={`px-12 py-4 rounded-full text-base tracking-wide shadow-lg transition-all ${
              canProceed
                ? "bg-gradient-to-r from-green-500 to-green-600 text-gray-900 font-black hover:shadow-xl hover:-translate-y-0.5"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            次へ進む →
          </button>
          <div>
            <button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                onExit()
              }}
              className="text-gray-500 hover:text-gray-700 underline text-sm"
            >
              終了する
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 行動プランページ（Duolingoライクな新UI）
type ActionStep = 'when' | 'where' | 'what' | 'confirmation'

// 動画ファイルリスト
const CAT_VIDEOS = [
  '/movie_output/second_half_animecat.mp4',
  '/movie_output/second_half_bangocat.mp4',
  '/movie_output/second_half_fatcat.mp4',
]

const ActionPlanPage = ({
  actionPlans,
  totalPoints,
  setTotalPoints,
  onActionPlanAdd,
  onComplete,
  onTimeUp,
  onExit,
  onFieldComplete,
  isMuted,
  strongestDesireText,
}: {
  actionPlans: ActionPlan[]
  totalPoints: number
  setTotalPoints: (value: number | ((prev: number) => number)) => void
  onActionPlanAdd: (when: string, where: string, what: string) => void
  onComplete: () => void
  onTimeUp: () => void
  onExit: () => void
  onFieldComplete: () => void
  isMuted: boolean
  strongestDesireText: string | null
}) => {
  const { language } = useLanguage()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // ランダムな動画を選択（コンポーネントマウント時に一度だけ）
  const [selectedVideo] = useState(() => CAT_VIDEOS[Math.floor(Math.random() * CAT_VIDEOS.length)])
  // 動画再生状態
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // 説明ページ表示状態
  const [showIntro, setShowIntro] = useState(true)

  // ステップ管理
  const [currentStep, setCurrentStep] = useState<ActionStep>('when')
  const [currentLevel, setCurrentLevel] = useState(actionPlans.length + 1)

  // 回答管理
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [customInput, setCustomInput] = useState('')
  const [isCustomMode, setIsCustomMode] = useState(false)

  // 現在の行動プラン
  const [currentPlan, setCurrentPlan] = useState<ActionPlan>({ when: '', where: '', what: '' })

  // アニメーション
  const [showConfetti, setShowConfetti] = useState(false)
  const [currentPoints, setCurrentPoints] = useState(0)

  // BGM再生
  const playSound = useCallback((soundFile: string) => {
    if (isMuted) return
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    audioRef.current = new Audio(soundFile)
    audioRef.current.volume = 0.5
    audioRef.current.play().catch(() => {})
  }, [isMuted])

  // 選択肢の定義
  const whenOptions = ['朝', '昼', '夜']
  const whereOptions = ['学校', '職場', '飲み会', '遊び']

  // プログレス計算（3ステップ）
  const getProgress = () => {
    if (currentStep === 'when') return 33
    if (currentStep === 'where') return 66
    if (currentStep === 'what') return 100
    return 100
  }

  // 回答を選択
  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    setIsCustomMode(false)
    setCustomInput('')
  }

  // 自由記述モードに切り替え
  const handleCustomMode = () => {
    setIsCustomMode(true)
    setSelectedAnswer('')
  }

  // 回答を送信
  const handleSubmit = () => {
    const answer = isCustomMode ? customInput : selectedAnswer
    if (!answer.trim()) return

    // ポイント計算
    let points = 0
    if (currentStep === 'when') {
      points = isCustomMode ? 300 : 100
    } else if (currentStep === 'where') {
      points = isCustomMode ? 300 : 200
    } else if (currentStep === 'what') {
      points = 300 // 何をするは自由記述のみなので300pt
    }

    // ポイント追加
    setTotalPoints((prev) => prev + points)
    setCurrentPoints(points)
    onFieldComplete()

    // サウンド再生
    playSound('/sound/100pt.mp3')

    // アニメーション表示
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 1500)

    // 動画再生を開始
    const playVideo = () => {
      setIsVideoPlaying(true)
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.play().catch(() => {})
      }
    }

    // 現在のプランを更新
    if (currentStep === 'when') {
      setCurrentPlan((prev) => ({ ...prev, when: answer }))
      setTimeout(() => {
        playVideo()
        setCurrentStep('where')
        setSelectedAnswer('')
        setCustomInput('')
        setIsCustomMode(false)
      }, 1000)
    } else if (currentStep === 'where') {
      setCurrentPlan((prev) => ({ ...prev, where: answer }))
      setTimeout(() => {
        playVideo()
        setCurrentStep('what')
        setSelectedAnswer('')
        setCustomInput('')
        setIsCustomMode(true) // 何をするは自由記述のみ
      }, 1000)
    } else if (currentStep === 'what') {
      const finalPlan = { ...currentPlan, what: answer }
      setCurrentPlan(finalPlan)
      setTimeout(() => {
        playVideo()
        setCurrentStep('confirmation')
      }, 1000)
    }
  }

  // レベルを追加してリセット
  const handleAddLevel = () => {
    // 現在のプランを保存
    onActionPlanAdd(currentPlan.when, currentPlan.where, currentPlan.what)

    // 状態をリセット
    setCurrentLevel((prev) => prev + 1)
    setCurrentStep('when')
    setCurrentPlan({ when: '', where: '', what: '' })
    setSelectedAnswer('')
    setCustomInput('')
    setIsCustomMode(false)
  }

  // エクスポージャーへ進む
  const handleProceedToExposure = () => {
    // まだ保存していないプランがあれば保存
    if (currentPlan.when || currentPlan.where || currentPlan.what) {
      onActionPlanAdd(currentPlan.when, currentPlan.where, currentPlan.what)
    }
    onComplete()
  }

  // 終了してアフィリエイトページへ
  const handleExitToAffiliate = () => {
    window.open('https://px.a8.net/svt/ejp?a8mat=45167E+679KMQ+5OI8+BW8O2&a8ejpredirect=https%3A%2F%2Fkimochi-mental.com%2Fclient%2Fhome', '_blank')
    onExit()
  }

  // 抽象的な問題文を取得
  const getAbstractQuestion = () => {
    if (currentStep === 'when') {
      return `恐れている行動のLv${currentLevel}の行動をいつするかを書いてください（めちゃくちゃ簡単）`
    } else if (currentStep === 'where') {
      return `恐れている行動のLv${currentLevel}の行動をどこでする行動かを書いてください`
    } else if (currentStep === 'what') {
      return `恐れている行動のLv${currentLevel}の行動を書いてください`
    }
    return ''
  }

  // 吹き出しテキストを取得
  const getBubbleText = () => {
    if (currentStep === 'when') return 'いつする行動？'
    if (currentStep === 'where') return 'どこでする行動？'
    if (currentStep === 'what') return '何をする？'
    return ''
  }

  // 完了したレベル数
  const completedLevels = actionPlans.length

  // アフィリエイトHTML
  const affiliateHtml = `<a href="https://px.a8.net/svt/ejp?a8mat=45167E+679KMQ+5OI8+5ZEMP" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www27.a8.net/svt/bgt?aid=250317482375&wid=001&eno=01&mid=s00000026504001005000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=45167E+679KMQ+5OI8+5ZEMP" alt="">`

  // 説明ページ（行動リスト開始前）
  if (showIntro) {
    return (
      <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in overflow-y-auto"
        style={{ background: "#f5f7f2" }}>
        <div className="w-full max-w-2xl space-y-6 pb-20">
          {/* タイトル */}
          <div className="text-center py-4">
            <p className="text-xs tracking-widest text-green-600 uppercase mb-2 opacity-80">Action List</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
              🎯 行動リストの作成
            </h1>
          </div>

          {/* 目的の説明カード */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-green-400 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-green-400" />
            <h2 className="text-green-600 font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
              <span>📝</span> これからやること
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 bg-green-50 p-4 rounded-xl">
                <span className="text-3xl">🎯</span>
                <div>
                  <p className="font-bold text-base text-gray-800 mb-2">恐れている行動をリストアップ</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    あなたが恐れている行動を、<span className="text-green-600 font-semibold">怖さのレベル1〜6に分けて</span>リストアップします。
                    レベル1が一番簡単で、レベル6が一番難しいものです。
                  </p>
                </div>
              </div>
              <div className="flex gap-4 bg-green-50 p-4 rounded-xl">
                <span className="text-3xl">⏰</span>
                <div>
                  <p className="font-bold text-base text-gray-800 mb-2">いつ・どこで・何をするか</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    各レベルの行動について、<span className="text-green-600 font-semibold">「いつ」「どこで」「何をするか」</span>を具体的に書きます。
                    具体的であるほど、実行しやすくなります。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 目的の説明カード */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-blue-400 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-blue-400" />
            <h2 className="text-blue-600 font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
              <span>💡</span> なぜこれをするのか
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p className="leading-relaxed">
                エクスポージャーは<span className="text-blue-600 font-semibold">段階的に</span>行うことが大切です。
              </p>
              <p className="leading-relaxed">
                いきなり最も怖いものに向き合う必要はありません。
                <span className="text-blue-600 font-semibold">簡単なものから始めて、少しずつ難しいものに挑戦</span>していきます。
              </p>
              <p className="leading-relaxed">
                このリストがあなたの回復の道筋になります。
              </p>
            </div>
          </div>

          {/* 開始ボタン */}
          <div className="text-center py-6">
            <button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                setShowIntro(false)
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-gray-900 font-black px-12 py-4 rounded-full text-base tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              行動リストを作成する →
            </button>
          </div>

          {/* 終了ボタン */}
          <div className="text-center">
            <button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                onExit()
              }}
              className="text-gray-500 hover:text-gray-700 underline text-sm"
            >
              終了する
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 確認画面
  if (currentStep === 'confirmation') {
    return (
      <div className="relative w-full min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-green-100 overflow-y-auto">
        {/* Confetti Animation */}
        <ConfettiCanvas isActive={showConfetti} duration={1500} particleCount={50} points={currentPoints} />

        {/* メインコンテンツ */}
        <div className="flex-1 flex flex-col items-center justify-start p-4">
          {/* 強い欲求の表示 */}
          {strongestDesireText && (
            <div className="w-full max-w-md mb-3 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl p-3 border-2 border-yellow-400 shadow-md">
              <p className="text-center text-sm text-yellow-800">
                <span className="font-bold">⭐ あなたの強い欲求：</span>
                <span className="text-yellow-900 font-semibold">{strongestDesireText}</span>
              </p>
            </div>
          )}

          {/* プログレスゲージ */}
          <div className="w-full max-w-md mb-2">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 transition-all duration-500" style={{ width: '100%' }} />
            </div>
          </div>

          {/* 6つの丸インジケーター */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <div
                key={level}
                className={`w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center ${
                  level <= completedLevels + 1
                    ? 'bg-green-500 shadow-lg shadow-green-500/50'
                    : 'bg-gray-300'
                }`}
              >
                <span className="text-xs font-semibold text-gray-400">Lv{level}</span>
              </div>
            ))}
          </div>

          {/* ポイント表示 */}
          <div className="text-green-600 text-2xl font-extrabold mb-4">🏆 {totalPoints}pt</div>

          {/* 完了メッセージ */}
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md mb-4">
            <h2 className="text-xl font-bold text-green-800 mb-4 text-center">
              レベル{currentLevel}の行動プランが完成しました！
            </h2>
            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700"><span className="font-bold text-blue-700">いつ：</span>{currentPlan.when}</p>
              <p className="text-gray-700"><span className="font-bold text-blue-700">どこで：</span>{currentPlan.where}</p>
              <p className="text-gray-700"><span className="font-bold text-blue-700">何をする：</span>{currentPlan.what}</p>
            </div>
          </div>

          {/* 2つのボタン */}
          <div className="w-full max-w-md space-y-3 mb-8">
            {/* レベル追加ボタン（目立たせる） */}
            <Button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                handleAddLevel()
              }}
              disabled={completedLevels >= 5}
              className="w-full py-6 text-xl font-bold bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800 text-white animate-pulse hover:animate-none shadow-xl shadow-green-500/50 border-2 border-green-400 hover:border-green-200 transform hover:scale-105 transition-all duration-300 rounded-xl"
            >
              レベル{currentLevel + 1}を追加する ✨
            </Button>

            {/* エクスポージャーに進むボタン */}
            <Button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                handleProceedToExposure()
              }}
              className="w-full py-4 text-lg font-bold bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-xl"
            >
              エクスポージャーに進む →
            </Button>
          </div>

          {/* 広告（余白を追加、スクロールバー削除） */}
          <div className="w-full max-w-md mt-6 mb-6">
            <div
              className="flex justify-center"
              dangerouslySetInnerHTML={{ __html: affiliateHtml }}
            />
          </div>

          {/* 終了ボタン */}
          <div className="w-full max-w-md mt-6 pb-6">
            <Button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                onExit()
              }}
              className="w-full py-3 text-green-600 bg-white hover:bg-green-50 border-2 border-green-300 rounded-xl block"
            >
              終了する
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // いつ・どこで・何をする画面
  return (
    <div className="relative w-full min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-green-100 overflow-y-auto">
      {/* Confetti Animation */}
      <ConfettiCanvas isActive={showConfetti} duration={1500} particleCount={50} points={currentPoints} />

      {/* 強い欲求の表示（固定ヘッダー） */}
      {strongestDesireText && (
        <div className="flex-shrink-0 w-full bg-gradient-to-r from-yellow-100 to-amber-100 px-4 py-2 border-b-2 border-yellow-400">
          <p className="text-center text-sm text-yellow-800 max-w-md mx-auto">
            <span className="font-bold">⭐ あなたの強い欲求：</span>
            <span className="text-yellow-900 font-semibold">{strongestDesireText}</span>
          </p>
        </div>
      )}

      {/* 上部エリア（コンパクト） */}
      <div className="flex-shrink-0 px-4 pt-2">
        {/* プログレスゲージ */}
        <div className="w-full max-w-md mx-auto mb-1">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        </div>

        {/* 6つの丸インジケーター */}
        <div className="flex justify-center gap-2 mb-1">
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <div
              key={level}
              className={`w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center ${
                level <= completedLevels
                  ? 'bg-green-500 shadow-lg shadow-green-500/50'
                  : 'bg-gray-300'
              }`}
            >
              <span className="text-xs font-semibold text-gray-400">Lv{level}</span>
            </div>
          ))}
        </div>

        {/* ポイント表示 */}
        <div className="text-center text-green-600 text-lg font-extrabold mb-1">🏆 {totalPoints}pt</div>

        {/* 抽象的な問題文（大きく目立たせる） */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-3 border-2 border-green-400 mb-2">
          <p className="text-center text-green-800 text-base font-bold px-2" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            {getAbstractQuestion()}
          </p>
        </div>
      </div>

      {/* メインコンテンツエリア（スクロールなし） */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* キャラスペース＋吹き出し（2倍のサイズ） */}
        <div className="flex items-center justify-center gap-4 mb-4">
          {/* キャラスペース（動画）- サイズ2倍 */}
          <div className="w-40 h-40 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border-4 border-green-400 shadow-lg">
            <video
              ref={videoRef}
              src={selectedVideo}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
              onEnded={() => {
                setIsVideoPlaying(false)
                if (videoRef.current) {
                  videoRef.current.currentTime = 0
                }
              }}
            />
          </div>
          {/* 吹き出し（大きく） */}
          <div className="relative bg-white rounded-2xl px-5 py-3 shadow-lg border-2 border-green-300">
            <div className="absolute left-0 top-1/2 transform -translate-x-3 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-green-300 border-b-8 border-b-transparent" />
            <p className="text-xl font-bold text-green-700">{getBubbleText()}</p>
          </div>
        </div>

        {/* 二行の線（回答表示エリア） */}
        <div className="w-full max-w-md mb-2">
          <div className="border-b-2 border-gray-300 py-2 min-h-[40px] flex items-center justify-center">
            <span className={`text-lg ${(isCustomMode ? customInput : selectedAnswer) ? 'text-gray-800 font-bold' : 'text-gray-400'}`}>
              {isCustomMode ? customInput : selectedAnswer || '選択してください'}
            </span>
          </div>
          <div className="border-b-2 border-gray-300 h-1" />
        </div>

        {/* 選択肢エリア */}
        <div className="w-full max-w-md">
          {currentStep === 'what' ? (
            // 何をする画面は自由記述のみ
            <div className={`p-3 rounded-xl border-4 border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-lg shadow-yellow-400/30`}>
              <p className="text-sm text-yellow-700 font-bold mb-1">自由記述 (+300pt)</p>
              <Input
                type="text"
                placeholder="具体的な行動を入力..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-full text-base"
                autoFocus
              />
            </div>
          ) : (
            // いつ・どこで画面は選択肢＋自由記述
            <div className="space-y-2">
              {/* 選択肢ボタン */}
              <div className="flex flex-wrap gap-2 justify-center">
                {(currentStep === 'when' ? whenOptions : whereOptions).map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelectAnswer(option)}
                    className={`px-4 py-2 rounded-xl border-2 text-base font-medium transition-all ${
                      selectedAnswer === option
                        ? 'bg-green-500 text-white border-green-500 shadow-lg'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-green-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {/* 自由記述ボタン */}
              <button
                onClick={handleCustomMode}
                className={`w-full p-3 rounded-xl border-4 text-base font-medium transition-all ${
                  isCustomMode
                    ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-lg shadow-yellow-400/30'
                    : 'border-gray-200 bg-white hover:border-yellow-300'
                }`}
              >
                <span className="text-yellow-700 font-bold">自由記述 (+300pt)</span>
              </button>

              {/* 自由記述入力 */}
              {isCustomMode && (
                <Input
                  type="text"
                  placeholder="自由に入力..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="w-full text-base border-2 border-yellow-400"
                  autoFocus
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* 下部エリア */}
      <div className="flex-shrink-0 px-4 pb-8">
        {/* 送信ボタン */}
        <div className="w-full max-w-md mx-auto mb-8">
          <Button
            onClick={handleSubmit}
            disabled={!(isCustomMode ? customInput.trim() : selectedAnswer)}
            className={`w-full py-3 text-lg font-bold rounded-xl transition-all block ${
              (isCustomMode ? customInput.trim() : selectedAnswer)
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            回答する
          </Button>
        </div>

        {/* 広告 */}
        <div className="w-full max-w-md mx-auto mt-6 mb-8">
          <div
            className="flex justify-center"
            dangerouslySetInnerHTML={{ __html: affiliateHtml }}
          />
        </div>

        {/* 終了ボタン */}
        <div className="w-full max-w-md mx-auto mt-6">
          <Button
            onClick={onExit}
            className="w-full py-2 text-green-600 bg-transparent hover:bg-green-50 border-0 text-sm block"
          >
            終了する
          </Button>
        </div>
      </div>
    </div>
  )
}

// 恐怖度測定ページ（想像前）
const PrePainMeterPage = ({
  fearLevel,
  setFearLevel,
  totalPoints,
  onComplete,
  onExit,
  strongestDesireText,
  isMuted,
}: {
  fearLevel: number
  setFearLevel: (value: number) => void
  totalPoints: number
  onComplete: () => void
  onExit: () => void
  strongestDesireText: string | null
  isMuted: boolean
}) => {
  const { language } = useLanguage()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 説明ページ表示状態
  const [showIntro, setShowIntro] = useState(true)

  // 効果音再生
  const playSound = useCallback((soundFile: string) => {
    if (isMuted) return
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    audioRef.current = new Audio(soundFile)
    audioRef.current.volume = 0.5
    audioRef.current.play().catch(() => {})
  }, [isMuted])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleSliderChange = (value: number[]) => {
    setFearLevel(value[0])
  }

  // 温度計の液体の高さを計算（0-10のスケールを0-100%に変換）
  const liquidHeight = `${fearLevel * 10}%`

  // 説明ページ（想像前の注意点）
  if (showIntro) {
    return (
      <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in overflow-y-auto"
        style={{ background: "#f5f7f2" }}>
        <div className="w-full max-w-2xl space-y-6 pb-20">
          {/* タイトル */}
          <div className="text-center py-4">
            <p className="text-xs tracking-widest text-green-600 uppercase mb-2 opacity-80">Imagination Exposure</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
              🧘 想像エクスポージャーの説明
            </h1>
          </div>

          {/* やることの説明カード */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-green-400 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-green-400" />
            <h2 className="text-green-600 font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
              <span>📝</span> これからやること
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 bg-green-50 p-4 rounded-xl">
                <span className="text-3xl">🎯</span>
                <div>
                  <p className="font-bold text-base text-gray-800 mb-2">恐れている状況を想像する</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    先ほど作成した行動リストの状況を、<span className="text-green-600 font-semibold">目を閉じて30秒間想像</span>します。
                    まるで今起きているかのように、鮮明に思い浮かべてください。
                  </p>
                </div>
              </div>
              <div className="flex gap-4 bg-green-50 p-4 rounded-xl">
                <span className="text-3xl">💪</span>
                <div>
                  <p className="font-bold text-base text-gray-800 mb-2">不快感から逃げない</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    想像中に不快感を感じても、<span className="text-green-600 font-semibold">考えないようにしたり、逃げたりしない</span>でください。
                    不快感を全身で感じることが大切です。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 注意点カード */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-orange-400 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 to-orange-400" />
            <h2 className="text-orange-600 font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
              <span>⚠️</span> 大切な注意点
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex gap-3 items-start bg-orange-50 p-3 rounded-lg">
                <span className="text-xl">✓</span>
                <p><span className="font-bold text-orange-700">不快感は効いているサイン</span> - 向き合い続けることで、脳が学習し落ち着いていきます</p>
              </div>
              <div className="flex gap-3 items-start bg-orange-50 p-3 rounded-lg">
                <span className="text-xl">✓</span>
                <p><span className="font-bold text-orange-700">ピークを越えると落ち着く</span> - 不快感は必ず自然に減っていきます</p>
              </div>
              <div className="flex gap-3 items-start bg-red-50 p-3 rounded-lg">
                <span className="text-xl">✗</span>
                <p><span className="font-bold text-red-700">本当に危険なものには行わない</span> - 安全な範囲で行ってください</p>
              </div>
            </div>
          </div>

          {/* 開始ボタン */}
          <div className="text-center py-6">
            <button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                setShowIntro(false)
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-gray-900 font-black px-12 py-4 rounded-full text-base tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              恐怖度を測定する →
            </button>
          </div>

          {/* 終了ボタン */}
          <div className="text-center">
            <button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                onExit()
              }}
              className="text-gray-500 hover:text-gray-700 underline text-sm"
            >
              終了する
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-green-100 to-green-200" />

      <div className="relative z-10 max-w-md w-full bg-white rounded-xl p-8 shadow-2xl">
        {/* 強い欲求の表示 */}
        {strongestDesireText && (
          <div className="mb-4 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl p-3 border-2 border-yellow-400 shadow-md">
            <p className="text-center text-sm text-yellow-800">
              <span className="font-bold">⭐ あなたの強い欲求：</span>
              <span className="text-yellow-900 font-semibold">{strongestDesireText}</span>
            </p>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-800">
            {language === "ja" ? "恐怖度の測定" : "Fear Level Measurement"}
          </h1>
          <div className="text-green-600 text-xl font-extrabold">🏆{totalPoints}pt</div>
        </div>

        <p className="text-green-600 mb-6 text-center text-lg font-bold">
          {language === "ja"
            ? "あなたの恐怖具合に点数をつけてください"
            : "Please rate your fear level"}
        </p>

        <div className="flex flex-col items-center gap-8 mb-8">
          {/* 温度計 */}
          <div className="relative w-24 h-64 flex flex-col items-center">
            <div className="text-lg font-semibold mb-2 text-green-700">
              {language === "ja" ? "恐怖メーター" : "Fear Meter"}
            </div>
            <div className="relative w-16 h-48">
              <div className="absolute inset-0 bg-green-100 rounded-full rounded-t-none overflow-hidden border-2 border-green-400">
                <div
                  className="absolute bottom-0 w-full bg-red-500 transition-all duration-500 ease-in-out"
                  style={{ height: liquidHeight }}
                />
              </div>
              <div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-8 h-8 rounded-full bg-green-200 border-2 border-green-400 cursor-pointer hover:bg-green-300 transition-colors flex items-center justify-center"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const clickX = e.clientX - rect.left
                  const centerX = rect.width / 2
                  if (clickX < centerX) {
                    setFearLevel(Math.max(0, fearLevel - 0.5))
                  } else {
                    setFearLevel(Math.min(10, fearLevel + 0.5))
                  }
                }}
              >
                <div className="w-full h-full flex">
                  <div className="w-1/2 h-full hover:bg-green-400/20 rounded-l-full"></div>
                  <div className="w-1/2 h-full hover:bg-green-400/20 rounded-r-full"></div>
                </div>
              </div>

              {/* 目盛り */}
              <div className="absolute -left-6 top-0 h-full flex flex-col justify-between py-1">
                {[10, 8, 6, 4, 2, 0].map((mark) => (
                  <div key={mark} className="flex items-center">
                    <span className="w-2 h-0.5 bg-green-500"></span>
                    <span className="text-xs ml-1 text-green-700">{mark}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* スコアバー */}
          <div className="w-full flex flex-col items-center">
            <div className="text-lg font-semibold mb-2 text-green-700">
              {language === "ja" ? "現在の恐怖レベル" : "Current Fear Level"}
            </div>
            <div className="w-full h-12 flex items-center justify-center text-3xl font-bold mb-4 text-green-800">
              {fearLevel.toFixed(1)}
            </div>
            <div className="w-full px-2">
              <div className="py-4">
                <Slider
                  defaultValue={[5]}
                  max={10}
                  step={0.1}
                  value={[fearLevel]}
                  onValueChange={handleSliderChange}
                  className="w-full [&>.relative]:h-8 [&_[role=slider]]:h-8 [&_[role=slider]]:w-8 [&_[data-orientation=horizontal]]:h-8"
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-green-600">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
            <div className="flex justify-between w-full mt-4 text-sm">
              <div className="text-center">
                <span className="block font-medium text-green-700">
                  {language === "ja" ? "怖くない" : "Not afraid"}
                </span>
              </div>
              <div className="text-center">
                <span className="block font-medium text-green-700">
                  {language === "ja" ? "非常に怖い" : "Very afraid"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 次へボタン */}
        <Button
          onClick={() => {
            playSound('/sound/nextpage.mp3')
            onComplete()
          }}
          className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white py-4 text-lg font-bold"
        >
          {language === "ja" ? "次へ（想像を開始）" : "Next (Start Imagination)"}
        </Button>

        {/* 終了ボタン */}
        <Button
          onClick={() => {
            playSound('/sound/nextpage.mp3')
            onExit()
          }}
          className="w-full mt-4 text-green-600 bg-transparent hover:text-green-700 hover:bg-green-50 border-0"
        >
          {language === "ja" ? "終了する" : "Exit"}
        </Button>
      </div>
    </div>
  )
}

// 恐怖度測定ページ（想像後）
const PostPainMeterPage = ({
  preFearLevel,
  postFearLevel,
  setPostFearLevel,
  totalPoints,
  onComplete,
  onExit,
  strongestDesireText,
  isMuted,
}: {
  preFearLevel: number
  postFearLevel: number
  setPostFearLevel: (value: number) => void
  totalPoints: number
  onComplete: () => void
  onExit: () => void
  strongestDesireText: string | null
  isMuted: boolean
}) => {
  const { language } = useLanguage()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 効果音再生
  const playSound = useCallback((soundFile: string) => {
    if (isMuted) return
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    audioRef.current = new Audio(soundFile)
    audioRef.current.volume = 0.5
    audioRef.current.play().catch(() => {})
  }, [isMuted])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleSliderChange = (value: number[]) => {
    setPostFearLevel(value[0])
  }

  // 温度計の液体の高さを計算
  const liquidHeight = `${postFearLevel * 10}%`

  // 変化を計算
  const fearChange = preFearLevel - postFearLevel
  const changeText = fearChange > 0
    ? (language === "ja" ? `${fearChange.toFixed(1)}減少しました！` : `Decreased by ${fearChange.toFixed(1)}!`)
    : fearChange < 0
      ? (language === "ja" ? `${Math.abs(fearChange).toFixed(1)}増加しました` : `Increased by ${Math.abs(fearChange).toFixed(1)}`)
      : (language === "ja" ? "変化なし" : "No change")

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-green-100 to-green-200" />

      <div className="relative z-10 max-w-md w-full bg-white rounded-xl p-8 shadow-2xl">
        {/* 強い欲求の表示 */}
        {strongestDesireText && (
          <div className="mb-4 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl p-3 border-2 border-yellow-400 shadow-md">
            <p className="text-center text-sm text-yellow-800">
              <span className="font-bold">⭐ あなたの強い欲求：</span>
              <span className="text-yellow-900 font-semibold">{strongestDesireText}</span>
            </p>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-800">
            {language === "ja" ? "エクスポージャー後の恐怖度" : "Fear Level After Exposure"}
          </h1>
          <div className="text-green-600 text-xl font-extrabold">🏆{totalPoints}pt</div>
        </div>

        <p className="text-green-600 mb-4 text-center text-lg font-bold">
          {language === "ja"
            ? "エクスポージャーによって、不安感などの不快感がどれくらい変わりましたか？"
            : "How much has your discomfort changed after the exposure?"}
        </p>

        {/* 最初の恐怖度を表示 */}
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <p className="text-center text-blue-800 font-bold">
            {language === "ja" ? `最初の恐怖度: ${preFearLevel.toFixed(1)}` : `Initial Fear Level: ${preFearLevel.toFixed(1)}`}
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 mb-8">
          {/* 温度計 */}
          <div className="relative w-24 h-64 flex flex-col items-center">
            <div className="text-lg font-semibold mb-2 text-green-700">
              {language === "ja" ? "恐怖メーター" : "Fear Meter"}
            </div>
            <div className="relative w-16 h-48">
              <div className="absolute inset-0 bg-green-100 rounded-full rounded-t-none overflow-hidden border-2 border-green-400">
                <div
                  className="absolute bottom-0 w-full bg-red-500 transition-all duration-500 ease-in-out"
                  style={{ height: liquidHeight }}
                />
              </div>
              <div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-8 h-8 rounded-full bg-green-200 border-2 border-green-400 cursor-pointer hover:bg-green-300 transition-colors flex items-center justify-center"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const clickX = e.clientX - rect.left
                  const centerX = rect.width / 2
                  if (clickX < centerX) {
                    setPostFearLevel(Math.max(0, postFearLevel - 0.5))
                  } else {
                    setPostFearLevel(Math.min(10, postFearLevel + 0.5))
                  }
                }}
              >
                <div className="w-full h-full flex">
                  <div className="w-1/2 h-full hover:bg-green-400/20 rounded-l-full"></div>
                  <div className="w-1/2 h-full hover:bg-green-400/20 rounded-r-full"></div>
                </div>
              </div>

              {/* 目盛り */}
              <div className="absolute -left-6 top-0 h-full flex flex-col justify-between py-1">
                {[10, 8, 6, 4, 2, 0].map((mark) => (
                  <div key={mark} className="flex items-center">
                    <span className="w-2 h-0.5 bg-green-500"></span>
                    <span className="text-xs ml-1 text-green-700">{mark}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* スコアバー */}
          <div className="w-full flex flex-col items-center">
            <div className="text-lg font-semibold mb-2 text-green-700">
              {language === "ja" ? "現在の恐怖レベル" : "Current Fear Level"}
            </div>
            <div className="w-full h-12 flex items-center justify-center text-3xl font-bold mb-4 text-green-800">
              {postFearLevel.toFixed(1)}
            </div>
            <div className="w-full px-2">
              <div className="py-4">
                <Slider
                  defaultValue={[5]}
                  max={10}
                  step={0.1}
                  value={[postFearLevel]}
                  onValueChange={handleSliderChange}
                  className="w-full [&>.relative]:h-8 [&_[role=slider]]:h-8 [&_[role=slider]]:w-8 [&_[data-orientation=horizontal]]:h-8"
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-green-600">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
            <div className="flex justify-between w-full mt-4 text-sm">
              <div className="text-center">
                <span className="block font-medium text-green-700">
                  {language === "ja" ? "怖くない" : "Not afraid"}
                </span>
              </div>
              <div className="text-center">
                <span className="block font-medium text-green-700">
                  {language === "ja" ? "非常に怖い" : "Very afraid"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 変化の表示 */}
        <div className={`rounded-lg p-4 mb-4 ${fearChange > 0 ? "bg-green-100" : fearChange < 0 ? "bg-red-100" : "bg-gray-100"}`}>
          <p className={`text-center font-bold ${fearChange > 0 ? "text-green-700" : fearChange < 0 ? "text-red-700" : "text-gray-700"}`}>
            {changeText}
          </p>
        </div>

        {/* 次へボタン */}
        <Button
          onClick={() => {
            playSound('/sound/nextpage.mp3')
            onComplete()
          }}
          className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white py-4 text-lg font-bold"
        >
          {language === "ja" ? "次へ" : "Next"}
        </Button>

        {/* 終了ボタン */}
        <Button
          onClick={() => {
            playSound('/sound/nextpage.mp3')
            onExit()
          }}
          className="w-full mt-4 text-green-600 bg-transparent hover:text-green-700 hover:bg-green-50 border-0"
        >
          {language === "ja" ? "終了する" : "Exit"}
        </Button>
      </div>
    </div>
  )
}

// 不安イメージページ（reaffalen.tsxの内容を統合）
const AnxietyVisualizationPage = ({
  actionPlans,
  totalPoints,
  onImageComplete,
  onAddPoints,
  onExit,
  strongestDesireText,
  isMuted,
}: {
  actionPlans: ActionPlan[]
  totalPoints: number
  onImageComplete: () => void
  onAddPoints: () => void
  onExit: () => void
  strongestDesireText: string | null
  isMuted: boolean
}) => {
  const { language } = useLanguage()
  const t = (key: TranslationKey) => exposeTranslations[language][key]

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const leavesRef = useRef<Leaf[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentLevel, setCurrentLevel] = useState(0) // 現在のレベル（0から始まる）
  const [timeLeft, setTimeLeft] = useState(30) // 各レベル30秒
  const [isActive, setIsActive] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const [hasAddedPoints, setHasAddedPoints] = useState(false) // ポイント追加済みフラグ

  // 効果音再生
  const playSound = useCallback((soundFile: string) => {
    if (isMuted) return
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    audioRef.current = new Audio(soundFile)
    audioRef.current.volume = 0.5
    audioRef.current.play().catch(() => {})
  }, [isMuted])

  // ページ読み込み時にスクロール位置を上に
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // タイマー処理
  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // タイマーが0になる瞬間
          if (!hasAddedPoints) {
            setHasAddedPoints(true) // フラグを立てる
            onAddPoints() // 300pt追加（一度だけ）
            playSound('/sound/300ptnextpage.mp3') // 300ptサウンド
            setShowConfetti(true)

            setTimeout(() => {
              setShowConfetti(false)
              if (currentLevel < actionPlans.length - 1) {
                // 次のレベルへ
                setCurrentLevel((prev) => prev + 1)
                setTimeLeft(30)
                setHasAddedPoints(false) // フラグをリセット
              } else {
                // 全レベル完了
                onImageComplete()
              }
            }, 1000)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, currentLevel, actionPlans.length, hasAddedPoints, onAddPoints, onImageComplete])

  const formatTime = (seconds: number) => {
    return `${seconds}秒`
  }

  // 現在のレベルの行動プラン
  const currentPlan = actionPlans[currentLevel]

  // 対数関数的に進む時間メーター（30秒で100%になる）
  const getProgressPercentage = () => {
    const elapsed = 30 - timeLeft // 経過時間
    // 対数関数: log(1 + x) を使用して、最初は速く、後半はゆっくり進む
    // 30秒でlog(1 + 30) = log(31) ≈ 3.434になるので、これを100%にする
    const maxLog = Math.log(1 + 30)
    const currentLog = Math.log(1 + elapsed)
    return (currentLog / maxLog) * 100
  }

  // レベルに応じた色を取得
  const getLevelColor = (level: number) => {
    const colors = [
      "text-green-600",      // レベル1: 緑
      "text-blue-600",       // レベル2: 青
      "text-purple-600",     // レベル3: 紫
      "text-pink-600",       // レベル4: ピンク
      "text-orange-600",     // レベル5: オレンジ
      "text-red-600",        // レベル6: 赤
      "text-yellow-600",     // レベル7: 黄色
      "text-indigo-600",     // レベル8: インディゴ
      "text-teal-600",       // レベル9: ティール
      "text-cyan-600",       // レベル10: シアン
    ]
    return colors[level % colors.length] || "text-green-600"
  }

  // レベルに応じた背景色を取得（メーター用）
  const getLevelBgColor = (level: number) => {
    const colors = [
      "bg-green-500",      // レベル1: 緑
      "bg-blue-500",       // レベル2: 青
      "bg-purple-500",     // レベル3: 紫
      "bg-pink-500",       // レベル4: ピンク
      "bg-orange-500",     // レベル5: オレンジ
      "bg-red-500",        // レベル6: 赤
      "bg-yellow-500",     // レベル7: 黄色
      "bg-indigo-500",     // レベル8: インディゴ
      "bg-teal-500",       // レベル9: ティール
      "bg-cyan-500",       // レベル10: シアン
    ]
    return colors[level % colors.length] || "bg-green-500"
  }

  // 葉っぱの色を難易度に応じて明るくする
  const getLeafColors = (level: number): string[] => {
    const baseColors = [
      "#22c55e", // green
      "#16a34a", // darker green
      "#84cc16", // lime
      "#65a30d", // olive
      "#14532d", // forest green
      "#86efac", // light green
    ]

    // レベルが上がるほど明るくする（HSL調整）
    const brightnessMultiplier = 1 + (level * 0.15)
    return baseColors.map(color => {
      // 簡易的に明るさを調整
      return color
    })
  }

  const [showLevelComplete, setShowLevelComplete] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // レベルに応じた色を取得
    const colors = getLeafColors(0)

    const leafCount = 60
    // 初回のみ葉っぱを生成
    if (leavesRef.current.length === 0) {
      for (let i = 0; i < leafCount; i++) {
        leavesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: Math.random() * 1 + 0.5,
          width: Math.random() * 15 + 10,
          height: Math.random() * 20 + 15,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.05,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.4 + 0.6,
          swayOffset: Math.random() * Math.PI * 2,
          swaySpeed: Math.random() * 0.02 + 0.01,
        })
      }
    }

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", handleMouseMove)

    const drawLeaf = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
      rotation: number,
      color: string,
      alpha: number,
    ) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      ctx.globalAlpha = alpha

      // Leaf shape
      ctx.beginPath()
      ctx.moveTo(0, -height / 2)
      ctx.quadraticCurveTo(width / 2, -height / 4, width / 2, height / 4)
      ctx.quadraticCurveTo(width / 2, height / 2, 0, height / 2)
      ctx.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 4)
      ctx.quadraticCurveTo(-width / 2, -height / 4, 0, -height / 2)
      ctx.closePath()

      ctx.fillStyle = color
      ctx.fill()

      // Leaf vein
      ctx.beginPath()
      ctx.moveTo(0, -height / 2)
      ctx.lineTo(0, height / 2)
      ctx.strokeStyle = "rgba(0, 0, 0, 0.2)"
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.restore()
    }

    // Animation loop
    let animationFrameId: number
    let time = 0
    const animate = () => {
      time += 0.016
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#d1fae5")
      gradient.addColorStop(1, "#a7f3d0")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      leavesRef.current.forEach((leaf) => {
        // Swaying motion
        leaf.swayOffset += leaf.swaySpeed
        const sway = Math.sin(leaf.swayOffset) * 1.5

        // Update position with sway
        leaf.x += leaf.vx + sway
        leaf.y += leaf.vy
        leaf.rotation += leaf.rotationSpeed

        const dx = mouseRef.current.x - leaf.x
        const dy = mouseRef.current.y - leaf.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          const force = (100 - distance) / 100
          leaf.vx -= (dx / distance) * force * 2
          leaf.vy -= (dy / distance) * force * 2
          leaf.rotationSpeed += (Math.random() - 0.5) * 0.1
        }

        if (leaf.y > canvas.height + 50) {
          leaf.y = -50
          leaf.x = Math.random() * canvas.width
          leaf.vx = (Math.random() - 0.5) * 0.5
          leaf.vy = Math.random() * 1 + 0.5
          leaf.rotationSpeed = (Math.random() - 0.5) * 0.05
        }

        if (leaf.x < -50) leaf.x = canvas.width + 50
        if (leaf.x > canvas.width + 50) leaf.x = -50

        // Damping
        leaf.vx *= 0.98
        leaf.vy = Math.max(0.5, leaf.vy * 0.99)

        // Draw leaf
        drawLeaf(ctx, leaf.x, leaf.y, leaf.width, leaf.height, leaf.rotation, leaf.color, leaf.alpha)
      })

      ctx.globalAlpha = 1
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in"
      style={{ background: "#f5f7f2" }}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ minHeight: '100vh' }} />
      <ConfettiCanvas
        isActive={showConfetti}
        duration={1000}
        particleCount={50}
        points={300}
      />

      <div className="w-full max-w-2xl space-y-6 relative z-10 pb-20">
        {/* タイトル */}
        <div className="text-center py-4">
          <p className="text-xs tracking-widest text-green-600 uppercase mb-3 opacity-80">Imagination Exposure</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            🧘 想像エクスポージャー
          </h1>
          <div className="text-green-600 text-xl font-extrabold mt-2">🏆 {totalPoints}{t("points")}</div>
        </div>

        {/* 最も目立つテキスト - 想像して不快感を全身で感じてください */}
        <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-2xl p-6 shadow-xl border-4 border-white">
          <p className="text-center text-white text-2xl md:text-3xl font-black leading-relaxed" style={{ fontFamily: "'Kosugi Maru', sans-serif", textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            🔥 想像して不快感を<br />全身で感じてください 🔥
          </p>
        </div>

        {/* 強い欲求の表示 */}
        {strongestDesireText && (
          <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-2xl p-4 border-2 border-yellow-400 shadow-md">
            <p className="text-center text-sm text-yellow-800">
              <span className="font-bold">⭐ あなたの強い欲求：</span>
              <span className="text-yellow-900 font-semibold">{strongestDesireText}</span>
            </p>
          </div>
        )}

        {/* 想像の指示カード */}
        <div className="bg-white rounded-2xl p-7 shadow-md border border-green-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-400" />
          <h2 className="text-green-600 text-base mb-4 flex items-center gap-2" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            <span>🧘</span> 想像する指示
          </h2>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <span className="text-xl">👁️</span>
              <p className="text-sm text-gray-700">
                <span className="font-bold text-green-700">目を閉じて、30秒間想像してください。</span><br />
                下に表示されている状況を、まるで今起きているかのように鮮明に思い浮かべましょう。
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-xl">💪</span>
              <p className="text-sm text-gray-700">
                <span className="font-bold text-green-700">逃げないで、不快感を感じてください。</span><br />
                考えないようにしたりせず、苦しみを感じて、その後の安全を確認してください。
              </p>
            </div>
          </div>
        </div>

        {/* ヒント: うまくできない人向け */}
        <div className="bg-purple-50 rounded-2xl p-5 shadow-md border border-purple-200">
          <h3 className="text-purple-700 font-bold text-sm mb-3 flex items-center gap-2" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            <span>💡</span> うまくできない人へのヒント
          </h3>
          <p className="text-sm text-purple-800 leading-relaxed">
            うまくできない人は、その時に言われてる言葉を何回も繰り返してもいいです。<br />
            <span className="font-bold text-purple-900">例えば、バカバカバカバカバカバカバカバカバカバカのように。</span><br />
            不快感が数10回で消えて怖くなくなるでしょう。
          </p>
        </div>

        {/* 注意点カード */}
        <div className="bg-orange-50 rounded-2xl p-5 shadow-md border border-orange-200">
          <h3 className="text-orange-700 font-bold text-sm mb-2 flex items-center gap-2">
            <span>⚠️</span> 大切な注意点
          </h3>
          <ul className="text-xs text-orange-800 space-y-1">
            <li>• 不快感は効いているサイン。向き合い続けることで脳が学習し落ち着きます</li>
            <li>• 不快感はピークを越えると、自然に落ち着いていきます</li>
            <li>• 危険なものに対してはエクスポージャーを行わないでください</li>
          </ul>
        </div>

        {/* 進捗メーター */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-green-100">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-base font-bold text-gray-700">{t("viz_progress")}</span>
            <span className="text-lg font-extrabold text-gray-900">
              {currentLevel + 1} / {actionPlans.length}
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getLevelBgColor(currentLevel)} transition-all duration-500`}
              style={{ width: `${((currentLevel + 1) / actionPlans.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 行動プランカード */}
        <div className="bg-white rounded-2xl p-7 shadow-md border border-green-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-400" />
          <h2 className={`text-center mb-4 text-2xl font-bold ${getLevelColor(currentLevel)}`}>
            {t("viz_your_level")}{currentLevel + 1}
          </h2>
          <div className="text-lg font-medium text-green-800 bg-green-50 p-4 rounded-xl">
            <p className="mb-2">
              <span className="font-bold">{t("viz_when")}</span> {currentPlan?.when || t("action_plan_not_entered")}
            </p>
            <p className="mb-2">
              <span className="font-bold">{t("viz_where")}</span> {currentPlan?.where || t("action_plan_not_entered")}
            </p>
            <p>
              <span className="font-bold">{t("viz_what")}</span> {currentPlan?.what || t("action_plan_not_entered")}
            </p>
          </div>
        </div>

        {/* 時間メーター */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-green-100">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-base font-bold text-gray-700">{t("viz_imagination_time")}</span>
            <h2 className="text-3xl font-bold text-green-900">{formatTime(timeLeft)}</h2>
          </div>
          <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getLevelBgColor(currentLevel)} transition-all duration-300`}
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <p className="text-center mt-3 text-sm text-gray-600">
            {t("viz_imagine_for_30s")}
          </p>
        </div>

        {/* ボタンエリア */}
        <div className="text-center py-4 space-y-4">
          <button
            onClick={() => {
              playSound('/sound/nextpage.mp3')
              setShowConfetti(true)
              setTimeout(() => {
                setShowConfetti(false)
                if (currentLevel < actionPlans.length - 1) {
                  setCurrentLevel((prev) => prev + 1)
                  setTimeLeft(30)
                  setHasAddedPoints(false)
                } else {
                  onImageComplete()
                }
              }, 1000)
            }}
            className="bg-gradient-to-r from-green-500 to-green-600 text-gray-900 font-black px-12 py-4 rounded-full text-base tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            {currentLevel < actionPlans.length - 1 ? t("viz_next_level") : t("viz_imagination_complete")}
          </button>

          <div>
            <button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                onExit()
              }}
              className="text-gray-500 hover:text-gray-700 underline text-sm"
            >
              {t("viz_exit")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const SurveyPage = ({
  enjoymentRating,
  improvementRating,
  setEnjoymentRating,
  setImprovementRating,
  onSubmit,
  strongestDesireText,
}: {
  enjoymentRating: number
  improvementRating: number
  setEnjoymentRating: (rating: number) => void
  setImprovementRating: (rating: number) => void
  onSubmit: () => void
  strongestDesireText: string | null
}) => {
  const { language } = useLanguage()
  const t = (key: TranslationKey) => exposeTranslations[language][key]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in overflow-y-auto" style={{ background: "#f5f7f2" }}>
      <div className="w-full max-w-2xl space-y-6 pb-20">
        <div className="text-center py-4">
          <p className="text-xs tracking-widest text-green-600 uppercase mb-3 opacity-80">Survey</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            💚 {t("survey_title")} 💚
          </h1>
        </div>
        {strongestDesireText && (
          <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-2xl p-4 border-2 border-yellow-400 shadow-md">
            <p className="text-center text-sm text-yellow-800">
              <span className="font-bold">⭐ あなたの強い欲求：</span>
              <span className="text-yellow-900 font-semibold">{strongestDesireText}</span>
            </p>
          </div>
        )}
        <div className="bg-white rounded-2xl p-7 shadow-md border border-green-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-400" />
          <h2 className="text-green-600 text-base mb-5 flex items-center gap-2" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            <span>😊</span> {t("survey_enjoyment")}
          </h2>
          <input type="range" min="1" max="10" value={enjoymentRating} onChange={(e) => setEnjoymentRating(Number.parseInt(e.target.value))} className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500" aria-label={t("survey_enjoyment")} />
          <div className="flex justify-between text-xs text-gray-500 mt-2"><span>1</span><span className="text-2xl font-bold text-green-600">{enjoymentRating}</span><span>10</span></div>
        </div>
        <div className="bg-white rounded-2xl p-7 shadow-md border border-green-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-400" />
          <h2 className="text-green-600 text-base mb-5 flex items-center gap-2" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            <span>📈</span> {t("survey_improvement")}
          </h2>
          <input type="range" min="1" max="10" value={improvementRating} onChange={(e) => setImprovementRating(Number.parseInt(e.target.value))} className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500" aria-label={t("survey_improvement")} />
          <div className="flex justify-between text-xs text-gray-500 mt-2"><span>1</span><span className="text-2xl font-bold text-green-600">{improvementRating}</span><span>10</span></div>
        </div>
        <div className="text-center py-6">
          <button onClick={onSubmit} className="bg-gradient-to-r from-green-500 to-green-600 text-gray-900 font-black px-12 py-4 rounded-full text-base tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
            💚 {t("survey_submit")} →
          </button>
        </div>
      </div>
    </div>
  )
}

const ResultPage = ({
  totalPoints,
  actionPlans,
  gender,
  ageGroup,
  userId,
  sessionId,
  preFearLevel,
  postFearLevel,
  onRestart,
  onExit,
  strongestDesireText,
  isMuted,
}: {
  totalPoints: number
  actionPlans: ActionPlan[]
  gender: string
  ageGroup: string
  userId: string
  sessionId: string
  preFearLevel: number
  postFearLevel: number
  onRestart: () => void
  onExit: () => void
  strongestDesireText: string | null
  isMuted: boolean
}) => {
  const { language } = useLanguage()
  const t = (key: TranslationKey) => exposeTranslations[language][key]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [affiliateTextPattern, setAffiliateTextPattern] = useState(affiliateTextPatterns[0])
  const [affiliatePatternIndex, setAffiliatePatternIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  // スロットアニメーション用のstate
  const [displayedPoints, setDisplayedPoints] = useState(0)
  const [isSpinning, setIsSpinning] = useState(true)
  const [showFinalResult, setShowFinalResult] = useState(false)

  // スロットアニメーション
  useEffect(() => {
    if (isSpinning) {
      const interval = setInterval(() => {
        setDisplayedPoints(Math.floor(Math.random() * 10000))
      }, 50) // デュルルル - 50ms間隔で数字変更

      const timeout = setTimeout(() => {
        clearInterval(interval)
        setIsSpinning(false)
        setDisplayedPoints(totalPoints)
        setShowFinalResult(true)
        // ドン効果音
        if (!isMuted) {
          const audio = new Audio('/sound/point.mp3')
          audio.volume = 0.6
          audio.play().catch(() => {})
        }
      }, 2000)

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    }
  }, [isSpinning, totalPoints, isMuted])

  // 回復度の計算
  const recoveryRate = preFearLevel > 0
    ? Math.round(((preFearLevel - postFearLevel) / preFearLevel) * 100)
    : 0

  // コンポーネントがマウントされた時にランダムなテキストパターンを選択
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * affiliateTextPatterns.length)
    setAffiliateTextPattern(affiliateTextPatterns[randomIndex])
    setAffiliatePatternIndex(randomIndex)
  }, [])

  // アフィリエイトリンクがクリックされた時の処理
  const handleAffiliateClick = useCallback(
    (clickData?: { url?: string; clickType?: string }) => {
      if (isSubmitting || hasSubmitted) {
        if (clickData?.url) {
          setTimeout(() => {
            window.open(clickData.url, "_blank")
          }, 100)
        }
        return
      }

      setIsSubmitting(true)
      const shouldRedirect = true
      const redirectUrl = clickData?.url

      if (!process.env.NEXT_PUBLIC_SUPABASE_URL_SELFWORTH || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_SELFWORTH) {
        console.log("Supabase環境変数が設定されていないため、データ保存をスキップします")
        setHasSubmitted(true)
        setIsSubmitting(false)

        if (shouldRedirect && redirectUrl) {
          setTimeout(() => {
            window.open(redirectUrl, "_blank")
          }, 200)
        }
      } else {
        supabase!.from("affiliate_clicks").insert({
          user_id: userId,
          session_id: sessionId,
          game_name: "expose",
          gender: gender || null,
          age_group: ageGroup || null,
          affiliate_pattern_index: affiliatePatternIndex,
          affiliate_clicked: true,
          affiliate_click_type: clickData?.clickType || "unknown",
          enjoyment_rating: null,
          improvement_rating: null,
        }).then(({ error }) => {
          if (error) {
            console.error("アフィリエイトクリックの保存に失敗しました:", error)
          } else {
            console.log("アフィリエイトクリックが正常に保存されました")
          }

          setHasSubmitted(true)
          setIsSubmitting(false)

          if (shouldRedirect && redirectUrl) {
            setTimeout(() => {
              window.open(redirectUrl, "_blank")
            }, 200)
          }
        })
      }
    },
    [isSubmitting, hasSubmitted, userId, sessionId, affiliatePatternIndex, gender, ageGroup],
  )

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return
      }

      if (event.data && event.data.type === "affiliate-click") {
        handleAffiliateClick({
          url: event.data.url,
          clickType: event.data.clickType || "iframe",
        })
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [handleAffiliateClick])

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in overflow-y-auto">
      {/* 背景画像 - PC版 */}
      <div className="absolute inset-0 z-0 hidden md:block">
        <Image
          src="/image/ladywhoclever.png"
          alt="結果画面背景"
          fill
          className="object-cover object-top"
          priority
        />
      </div>
      {/* 背景画像 - スマホ版 */}
      <div className="absolute inset-0 z-0 block md:hidden">
        <Image
          src="/image/ladywhocleverphone.png"
          alt="結果画面背景"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* 強い欲求の表示 */}
        {strongestDesireText && (
          <div className="mb-4 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl p-3 border-2 border-yellow-400 shadow-md">
            <p className="text-center text-sm text-yellow-800">
              <span className="font-bold">⭐ あなたの強い欲求：</span>
              <span className="text-yellow-900 font-semibold">{strongestDesireText}</span>
            </p>
          </div>
        )}

        {/* 統合された診断結果とアフィリエイトセクション */}
        <div className="text-center bg-white bg-opacity-95 rounded-xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-green-800 mb-6" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>{t("result_title")}</h1>

          {/* スロットアニメーション付きポイント表示 */}
          <div className={`text-5xl font-bold mb-3 transition-all duration-300 ${isSpinning ? 'text-gray-400 animate-pulse' : 'text-green-700'}`}>
            🏆{t("result_total_points")} <span className={isSpinning ? 'blur-sm' : ''}>{displayedPoints}</span>{t("points")}
          </div>
          {showFinalResult && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-bold text-orange-600 mb-3"
            >
              🎉 ドン！ 🎉
            </motion.div>
          )}

          {/* 回復度表示 */}
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 mb-4 border-2 border-green-300">
            <p className="text-lg font-bold text-green-800" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
              💚 あなたの回復度：
              <span className={`text-3xl ${recoveryRate > 0 ? 'text-green-600' : recoveryRate < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                {recoveryRate > 0 ? '+' : ''}{recoveryRate}%
              </span>
            </p>
            <p className="text-sm text-green-700 mt-1">
              {recoveryRate > 0 ? '素晴らしい！恐怖が軽減されています！' : recoveryRate < 0 ? '大丈夫、続けることで回復していきます' : '変化なし - 継続が大切です'}
            </p>
          </div>

          {language === "ja" && (
            <div className="text-2xl font-bold text-purple-600 mb-6">★yumeのゲーム　　スクショしてSNSに投稿しよう！★</div>
          )}

          {/* 不安リスト */}
          <div className="space-y-6 mt-8">
            {actionPlans.length > 0 ? (
              <div className="bg-blue-50 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                  🎯 {t("result_anxiety_list")}
                </h2>
                <div className="space-y-3">
                  {actionPlans.map((plan, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <span className="bg-blue-500 text-white font-bold min-w-[32px] h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-gray-700 mb-1">
                            <span className="font-bold text-blue-700">{t("viz_when")}</span> {plan.when || t("action_plan_not_entered")}
                          </p>
                          <p className="text-gray-700 mb-1">
                            <span className="font-bold text-blue-700">{t("viz_where")}</span> {plan.where || t("action_plan_not_entered")}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-bold text-blue-700">{t("viz_what")}</span> {plan.what || t("action_plan_not_entered")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-600">{t("result_no_anxiety")}</p>
            )}
          </div>

          {/* 恐怖度の変化を表示 */}
          <div className="bg-purple-50 rounded-lg p-6 mt-6">
            <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              📊 {language === "ja" ? "恐怖度の変化" : "Fear Level Change"}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <p className="text-gray-600 mb-2">{language === "ja" ? "最初の恐怖度" : "Initial Fear Level"}</p>
                <p className="text-3xl font-bold text-blue-600">{preFearLevel.toFixed(1)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <p className="text-gray-600 mb-2">{language === "ja" ? "最後の恐怖度" : "Final Fear Level"}</p>
                <p className="text-3xl font-bold text-green-600">{postFearLevel.toFixed(1)}</p>
              </div>
            </div>
            <div className={`mt-4 p-4 rounded-lg ${preFearLevel - postFearLevel > 0 ? "bg-green-100" : preFearLevel - postFearLevel < 0 ? "bg-red-100" : "bg-gray-100"}`}>
              <p className={`text-center text-xl font-bold ${preFearLevel - postFearLevel > 0 ? "text-green-700" : preFearLevel - postFearLevel < 0 ? "text-red-700" : "text-gray-700"}`}>
                {preFearLevel - postFearLevel > 0
                  ? (language === "ja" ? `${(preFearLevel - postFearLevel).toFixed(1)}ポイント減少しました！🎉` : `Decreased by ${(preFearLevel - postFearLevel).toFixed(1)} points! 🎉`)
                  : preFearLevel - postFearLevel < 0
                    ? (language === "ja" ? `${Math.abs(preFearLevel - postFearLevel).toFixed(1)}ポイント増加しました` : `Increased by ${Math.abs(preFearLevel - postFearLevel).toFixed(1)} points`)
                    : (language === "ja" ? "変化なし" : "No change")}
              </p>
            </div>
          </div>

          {/* アフィリエイト部分を同じカード内に統合（日本語版のみ表示） */}
          {language === "ja" && (
            <div className="mt-8 pt-8 border-t-2 border-gray-200">
              <h2 className="text-2xl font-bold text-orange-600 mt-8">{affiliateTextPattern.headline}</h2>

              <div className="text-center">
                <AffiliateComponent className="mx-auto" affiliateTextPattern={affiliateTextPattern} />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={onRestart} className="bg-green-500 hover:bg-green-600 text-white px-8 py-3">
            {t("result_restart")}
          </Button>
          <Button onClick={onExit} className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3">
            {t("result_home")}
          </Button>
        </div>
      </div>
    </div>
  )
}

const ExposeGame = () => {
  const router = useRouter()
  const [gameState, setGameState] = useState<"intro" | "exposureQuiz" | "profileSetup" | "action" | "quizReview" | "prePainMeter" | "visualization" | "postPainMeter" | "survey" | "result">("intro")
  const [totalPoints, setTotalPoints] = useState(0)
  const [enjoymentRating, setEnjoymentRating] = useState(5)
  const [improvementRating, setImprovementRating] = useState(5)
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([])
  const [gender, setGender] = useState<string>("")
  const [ageGroup, setAgeGroup] = useState<string>("")
  const [userId] = useState(() => crypto.randomUUID())
  const [sessionId] = useState(() => crypto.randomUUID())
  const [valuableThings, setValuableThings] = useState<string>("")
  const [preFearLevel, setPreFearLevel] = useState(5)
  const [postFearLevel, setPostFearLevel] = useState(5)
  const [isMuted, setIsMuted] = useState(false)
  const bgmRef = useRef<HTMLAudioElement | null>(null)
  // 新しい状態変数
  const [selfCareAnswer, setSelfCareAnswer] = useState<string>("")
  const [whyAnswers, setWhyAnswers] = useState<string[]>(["", "", "", "", ""])
  const [strongestDesire, setStrongestDesire] = useState<number | null>(null)
  const [discomfortOrigin, setDiscomfortOrigin] = useState<string>("")
  const [fearDescription, setFearDescription] = useState<string>("")
  // 間違えたクイズのインデックスを保存
  const [wrongQuizAnswers, setWrongQuizAnswers] = useState<number[]>([])

  // 効果音再生ヘルパー関数
  const playSoundEffect = useCallback((soundPath: string) => {
    if (!isMuted) {
      const audio = new Audio(soundPath)
      audio.volume = 0.5
      audio.play().catch(console.error)
    }
  }, [isMuted])

  // BGM再生管理
  useEffect(() => {
    // introとresult以外の画面でBGMを再生
    const shouldPlayBgm = gameState !== "intro" && gameState !== "result"

    if (shouldPlayBgm && !isMuted) {
      if (!bgmRef.current) {
        bgmRef.current = new Audio("/sound/gamebgmchild.mp3")
        bgmRef.current.loop = true
        bgmRef.current.volume = 0.15
      }
      bgmRef.current.play().catch(console.error)
    } else {
      if (bgmRef.current) {
        bgmRef.current.pause()
      }
    }

    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause()
      }
    }
  }, [gameState, isMuted])

  const handleTimeUp = () => {
    playSoundEffect("/sound/timeup.mp3")
    setTotalPoints((prev) => prev - 50)
  }

  // フィールド完了時に100pt追加
  const handleFieldComplete = () => {
    playSoundEffect("/sound/100pt.mp3")
    setTotalPoints((prev) => prev + 100)
  }

  // 不安リストの追加ハンドラー（3回に1回は900pt、それ以外は600pt）
  const handleActionPlanAdd = (when: string, where: string, what: string) => {
    setActionPlans((prev) => [...prev, { when, where, what }])
    const isGolden = (actionPlans.length + 1) % 3 === 0
    setTotalPoints((prev) => prev + (isGolden ? 900 : 600))
  }

  // プロフィールセットアップ完了時
  const handleProfileSetupComplete = () => {
    setGameState("action")
  }

  // 不安リストから恐怖度測定ページへ（間違えた問題があれば先に復習）
  const handleActionComplete = () => {
    if (wrongQuizAnswers.length > 0) {
      setGameState("quizReview")
    } else {
      setGameState("prePainMeter")
    }
  }

  // クイズ復習完了後に恐怖度測定ページへ
  const handleQuizReviewComplete = () => {
    setGameState("prePainMeter")
  }

  // 恐怖度測定（前）から想像ページへ
  const handlePrePainMeterComplete = () => {
    setGameState("visualization")
  }

  // 想像完了時に300pt追加
  const handleAddPoints = () => {
    setTotalPoints((prev) => prev + 300)
  }

  // 不安イメージから恐怖度測定（後）ページへ
  const handleVisualizationComplete = () => {
    setGameState("postPainMeter")
  }

  // 恐怖度測定（後）からアンケートページへ
  const handlePostPainMeterComplete = () => {
    setGameState("survey")
  }

  const handleSurveySubmit = () => {
    // 全データをSupabaseに保存（1テーブルに統合）
    if (supabase) {
      const fearChange = preFearLevel - postFearLevel
      const recoveryRate = preFearLevel > 0
        ? Math.round(((preFearLevel - postFearLevel) / preFearLevel) * 100)
        : 0

      supabase.from("expose_responses").insert({
        // ユーザー情報
        user_id: userId,
        session_id: sessionId,
        gender: gender || null,
        age_group: ageGroup || null,
        // プロフィールデータ
        self_care_answer: selfCareAnswer,
        valuable_things: valuableThings,
        why_answers: whyAnswers,
        strongest_desire_index: strongestDesire,
        strongest_desire_text: strongestDesire !== null ? whyAnswers[strongestDesire - 1] : null,
        discomfort_origin: discomfortOrigin,
        fear_description: fearDescription,
        // 恐怖レベル測定
        pre_fear_level: preFearLevel,
        post_fear_level: postFearLevel,
        fear_change: fearChange,
        recovery_rate: recoveryRate,
        // ゲーム結果
        total_points: totalPoints,
        action_plans: actionPlans.map(plan => `いつ: ${plan.when}, どこで: ${plan.where}, どんなことが起こる: ${plan.what}`),
        enjoyment_rating: enjoymentRating,
        improvement_rating: improvementRating,
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
    setTotalPoints(0)
    setEnjoymentRating(5)
    setImprovementRating(5)
    setActionPlans([])
    setGender("")
    setAgeGroup("")
    setValuableThings("")
    setPreFearLevel(5)
    setPostFearLevel(5)
    setSelfCareAnswer("")
    setWhyAnswers(["", "", "", "", ""])
    setStrongestDesire(null)
    setDiscomfortOrigin("")
    setWrongQuizAnswers([])
  }

  const handleExit = () => {
    router.push("/")
  }

  const handleDirectToAffiliate = () => {
    setGameState("result")
  }

  // 強い欲求のテキストを取得
  const strongestDesireText = strongestDesire !== null ? whyAnswers[strongestDesire - 1] : null

  return (
    <AnimatePresence mode="wait">
      {gameState === "intro" && <IntroPage key="intro" onStart={() => setGameState("exposureQuiz")} isMuted={isMuted} setIsMuted={setIsMuted} />}
      {gameState === "exposureQuiz" && (
        <ExposureQuizPage
          key="exposureQuiz"
          onComplete={() => setGameState("profileSetup")}
          onExit={handleDirectToAffiliate}
          totalPoints={totalPoints}
          setTotalPoints={setTotalPoints}
          isMuted={isMuted}
          onWrongAnswersUpdate={setWrongQuizAnswers}
        />
      )}
      {gameState === "profileSetup" && (
        <ProfileSetupPage
          key="profileSetup"
          gender={gender}
          setGender={setGender}
          ageGroup={ageGroup}
          setAgeGroup={setAgeGroup}
          valuableThings={valuableThings}
          setValuableThings={setValuableThings}
          selfCareAnswer={selfCareAnswer}
          setSelfCareAnswer={setSelfCareAnswer}
          whyAnswers={whyAnswers}
          setWhyAnswers={setWhyAnswers}
          strongestDesire={strongestDesire}
          setStrongestDesire={setStrongestDesire}
          discomfortOrigin={discomfortOrigin}
          setDiscomfortOrigin={setDiscomfortOrigin}
          fearDescription={fearDescription}
          setFearDescription={setFearDescription}
          totalPoints={totalPoints}
          setTotalPoints={setTotalPoints}
          onComplete={handleProfileSetupComplete}
          onExit={handleDirectToAffiliate}
          isMuted={isMuted}
        />
      )}
      {gameState === "action" && (
        <ActionPlanPage
          key="action"
          actionPlans={actionPlans}
          totalPoints={totalPoints}
          setTotalPoints={setTotalPoints}
          onActionPlanAdd={handleActionPlanAdd}
          onComplete={handleActionComplete}
          onTimeUp={handleTimeUp}
          onExit={handleDirectToAffiliate}
          onFieldComplete={handleFieldComplete}
          isMuted={isMuted}
          strongestDesireText={strongestDesireText}
        />
      )}
      {gameState === "quizReview" && (
        <QuizReviewPage
          key="quizReview"
          wrongAnswers={wrongQuizAnswers}
          totalPoints={totalPoints}
          setTotalPoints={setTotalPoints}
          onComplete={handleQuizReviewComplete}
          onExit={handleDirectToAffiliate}
          isMuted={isMuted}
        />
      )}
      {gameState === "prePainMeter" && (
        <PrePainMeterPage
          key="prePainMeter"
          fearLevel={preFearLevel}
          setFearLevel={setPreFearLevel}
          totalPoints={totalPoints}
          onComplete={handlePrePainMeterComplete}
          onExit={handleDirectToAffiliate}
          strongestDesireText={strongestDesireText}
          isMuted={isMuted}
        />
      )}
      {gameState === "visualization" && (
        <AnxietyVisualizationPage
          key="visualization"
          actionPlans={actionPlans}
          totalPoints={totalPoints}
          onImageComplete={handleVisualizationComplete}
          onAddPoints={handleAddPoints}
          onExit={handleDirectToAffiliate}
          strongestDesireText={strongestDesireText}
          isMuted={isMuted}
        />
      )}
      {gameState === "postPainMeter" && (
        <PostPainMeterPage
          key="postPainMeter"
          preFearLevel={preFearLevel}
          postFearLevel={postFearLevel}
          setPostFearLevel={setPostFearLevel}
          totalPoints={totalPoints}
          onComplete={handlePostPainMeterComplete}
          onExit={handleDirectToAffiliate}
          strongestDesireText={strongestDesireText}
          isMuted={isMuted}
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
          strongestDesireText={strongestDesireText}
        />
      )}
      {gameState === "result" && (
        <ResultPage
          key="result"
          totalPoints={totalPoints}
          actionPlans={actionPlans}
          gender={gender}
          ageGroup={ageGroup}
          userId={userId}
          sessionId={sessionId}
          preFearLevel={preFearLevel}
          postFearLevel={postFearLevel}
          onRestart={handleRestart}
          onExit={handleExit}
          strongestDesireText={strongestDesireText}
          isMuted={isMuted}
        />
      )}
    </AnimatePresence>
  )
}

export default ExposeGame
