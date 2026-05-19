"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import ConfettiCanvas from "@/components/animations/ConfettiCanvas"
import DarkAnimationCanvas from "@/components/animations/DarkAnimationCanvas"
import TransitionCanvas from "@/components/animations/TransitionCanvas"
import { TermsOfService } from "@/components/terms-of-service/terms-of-service"

// 型定義
type GameState = "loading" | "intro" | "prestart" | "quiz" | "summary" | "action" | "result"

type ActionPlan = {
  when: string
  where: string
  what: string
}

type ActionStep = 'when' | 'where' | 'what' | 'confirmation'

type Quiz = {
  question: string
  画像: {
    PC: string[]
    スマホ: string[]
  }
}

// セリフデータの型定義
type DialogueLine = {
  icon: string
  title: string
  content: string
  audioSrc?: string
}

// クイズ用猫動画リスト
const QUIZ_CAT_VIDEOS = [
  '/movie_output/second_half_animecat.mp4',
  '/movie_output/second_half_bangocat.mp4',
  '/movie_output/second_half_fatcat.mp4',
]

// 価値観発見の説明セリフデータ
const valueDiscoveryExplanationLines: DialogueLine[] = [
  {
    icon: "💎",
    title: "価値観を見つけると、人生の方向性が明確になる",
    content: "価値観とは、あなたが本当に大切にしているもの。それに従って行動すると、心が満たされ、幸福度が高まります。"
  },
  {
    icon: "🎯",
    title: "質問に直感で答えることで、心の奥にある価値観が見える",
    content: "考えすぎると頭で考えた「正解」を答えてしまいます。直感で答えることで、本当の自分の価値観が浮かび上がります。"
  },
  {
    icon: "🌟",
    title: "見つけた価値観に沿った行動プランを作成",
    content: "価値観を見つけたら、それに沿った具体的な行動を計画します。いつ・どこで・何をするかを決めることで、実行しやすくなります。"
  }
]

// ポケモン風セリフボックスコンポーネント
const DialogueBox = ({
  lines,
  onComplete,
  catVideoSrc,
  isMuted,
  onExit,
  title,
  subtitle,
}: {
  lines: DialogueLine[]
  onComplete: () => void
  catVideoSrc: string
  isMuted: boolean
  onExit?: () => void
  title: string
  subtitle?: string
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const currentLine = lines[currentLineIndex]
  const fullText = currentLine ? `${currentLine.title}\n\n${currentLine.content}` : ""

  // タイプライター効果
  useEffect(() => {
    if (!currentLine) return

    setDisplayedText("")
    setIsTyping(true)
    let charIndex = 0

    typingIntervalRef.current = setInterval(() => {
      if (charIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, charIndex + 1))
        charIndex++
      } else {
        setIsTyping(false)
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current)
        }
      }
    }, 30)

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current)
      }
    }
  }, [currentLineIndex, fullText, currentLine])

  // 音声再生
  useEffect(() => {
    if (!currentLine?.audioSrc || isMuted) return

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    audioRef.current = new Audio(currentLine.audioSrc)
    audioRef.current.volume = 0.5
    audioRef.current.play().catch(() => {})

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [currentLineIndex, currentLine?.audioSrc, isMuted])

  const handleClick = () => {
    if (isTyping) {
      setDisplayedText(fullText)
      setIsTyping(false)
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current)
      }
    } else {
      if (currentLineIndex < lines.length - 1) {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        }
        setCurrentLineIndex(prev => prev + 1)
      } else {
        if (audioRef.current) {
          audioRef.current.pause()
        }
        onComplete()
      }
    }
  }

  if (!currentLine) return null

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in overflow-y-auto"
      style={{ background: "#f5f7f2" }}
    >
      <div className="w-full max-w-2xl space-y-6 pb-20">
        {/* タイトル */}
        <div className="text-center py-4">
          <p className="text-xs tracking-widest text-green-600 uppercase mb-2 opacity-80">
            {subtitle || "Value Discovery"}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            {title}
          </h1>

          {/* 進行インジケーター */}
          <div className="flex justify-center gap-2 mt-3">
            {lines.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentLineIndex ? "bg-green-500 w-6" : index < currentLineIndex ? "bg-green-400" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* 猫動画サムネイル */}
          <div className="flex justify-center mt-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-green-400 shadow-lg">
              <video
                src={catVideoSrc}
                className="w-full h-full object-cover"
                muted
                playsInline
                preload="metadata"
              />
            </div>
          </div>
        </div>

        {/* セリフボックス */}
        <div
          onClick={handleClick}
          className="cursor-pointer bg-white rounded-2xl p-6 shadow-lg border-4 border-green-400 relative overflow-hidden transition-transform hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: "linear-gradient(to bottom, #ffffff, #f0fdf4)",
            boxShadow: "inset 0 0 0 2px #fff, 0 4px 20px rgba(0,0,0,0.1)"
          }}
        >
          {/* 上部グラデーションバー */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-green-400" />

          {/* アイコンとテキスト */}
          <div className="flex gap-4 items-start pt-2">
            <div className="text-4xl flex-shrink-0">
              {currentLine.icon}
            </div>
            <div className="flex-1 min-h-[120px]">
              <p className="text-base text-gray-800 leading-relaxed whitespace-pre-line" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
                {displayedText}
              </p>
            </div>
          </div>

          {/* クリックインジケーター */}
          <div className="absolute bottom-4 right-4">
            <span
              className={`text-green-500 text-2xl ${!isTyping ? "animate-pulse" : "opacity-30"}`}
            >
              ▼
            </span>
          </div>
        </div>

        {/* 進行状況テキスト */}
        <p className="text-center text-sm text-gray-500">
          {currentLineIndex + 1} / {lines.length}
        </p>

        {/* 終了ボタン */}
        {onExit && (
          <div className="text-center">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onExit()
              }}
              className="text-gray-500 hover:text-gray-700 underline text-sm"
            >
              終了する
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// デバイス判定フック
const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = (): void => {
      setIsMobile(window.innerWidth < 768)
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)

    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  return isMobile
}

// 効果音再生フック
const useInteractionSounds = (isMuted: boolean): {
  playTyping: () => void
  playClick: () => void
  playHover: () => void
} => {
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

// 動画ファイルリスト
const CAT_VIDEOS = [
  '/movie_output/second_half_animecat.mp4',
  '/movie_output/second_half_bangocat.mp4',
  '/movie_output/second_half_fatcat.mp4',
]

// 20個の質問リスト（selfworthrelativeから）
const quizzes: Quiz[] = [
  {
    question: "あなたが望む結果がすべて手に入ったとしたらどんな風にほかのひととかかわっているでしょうか。",
    画像: { PC: ["/image/worthho1 (2).png"], スマホ: ["/image/worth1"] }
  },
  {
    question: "死を迎えるときパートナーにどんな人だったと語ってほしいですか？",
    画像: { PC: ["/image/worthho2.png"], スマホ: ["/image/worth52"] }
  },
  {
    question: "あなたと関わったことによってどんな気持ちを相手に与えたいですか？",
    画像: { PC: ["/image/worthho3.png"], スマホ: ["/image/worth31"] }
  },
  {
    question: "今まで、どんな自分でいたときに自分らしいと思いましたか？",
    画像: { PC: ["/image/worthho4.png"], スマホ: ["/image/worth41"] }
  },
  {
    question: "居酒屋にいるときに、あなたのことをどんな風に思いながら話してほしいですか？",
    画像: { PC: ["/image/worthho5.png"], スマホ: ["/image/worth51"] }
  },
  {
    question: "確かに成功できるかもしれないけど、やって嫌だなと思うことは何ですか？",
    画像: { PC: ["/image/worthho6.png"], スマホ: ["/image/worth6"] }
  },
  {
    question: "成功に近づく知識の中で自分らしいや好きだなと思えることは何ですか？",
    画像: { PC: ["/image/worthho7.png"], スマホ: ["/image/worth7"] }
  },
  {
    question: "相手とどんな関わり方を相手としたら自分を好きになりますか？",
    画像: { PC: ["/image/worthho8.png"], スマホ: ["/image/worth8"] }
  },
  {
    question: "あなたが幼少期から好きなものはなんですか？",
    画像: { PC: ["/image/worthho9.png"], スマホ: ["/image/worth9"] }
  },
  {
    question: "今までの人生で自分のことが嫌いになる瞬間はどんなときでしたか？",
    画像: { PC: ["/image/worthho10.png"], スマホ: ["/image/worth10"] }
  },
  {
    question: "あなたの良いところのどこを相手に見せたいと思いますか？",
    画像: { PC: ["/image/worthho11.png"], スマホ: ["/image/worth11"] }
  },
  {
    question: "お金がもらえなくてもやり続けられることは何ですか？",
    画像: { PC: ["/image/worthho12.png"], スマホ: ["/image/worth12"] }
  },
  {
    question: "もし経済的に安定していたら、欲しいものがすべて手に入っていたら自分の時間を何に使いますか？",
    画像: { PC: ["/image/worthho13.png"], スマホ: ["/image/worth13"] }
  },
  {
    question: "他人に合わせて手に入れたけど、自分らしくないと思ったものは何ですか？",
    画像: { PC: ["/image/worthho14.png"], スマホ: ["/image/worth14"] }
  },
  {
    question: "あなたにとって自然なスキルや才能は何ですか？",
    画像: { PC: ["/image/worthho15.png"], スマホ: ["/image/worth15"] }
  },
  {
    question: "あなたはなにに美しさを感じますか？",
    画像: { PC: ["/image/worthho16.png"], スマホ: ["/image/worth16"] }
  },
  {
    question: "あなたにとって「愛」とはどういうことですか？",
    画像: { PC: ["/image/worthho17.png"], スマホ: ["/image/worth17"] }
  },
  {
    question: "あなたにとって「平穏を見つける」とはどういうことですか？",
    画像: { PC: ["/image/worthho18.png"], スマホ: ["/image/worth18"] }
  },
  {
    question: "あなたにとって「注目される」どういうことですか？",
    画像: { PC: ["/image/worthho19.png"], スマホ: ["/image/worth19"] }
  },
  {
    question: "あなたにとって「信頼」とはどういうことですか？",
    画像: { PC: ["/image/worthho20.png"], スマホ: ["/image/worth20"] }
  },
]

// 回答例リスト
const answerExamples: string[] = [
  "例：笑顔で接している、優しく話している、相手の話をよく聞いている",
  "例：優しい人、強い人、誠実な人、楽しい人",
  "例：安心感、温かさ、楽しさ、元気",
  "例：誰かを助けているとき、好きなことに没頭しているとき、自分の意見を伝えたとき",
  "例：面白い人、信頼できる人、一緒にいて楽な人",
  "例：嘘をつくこと、人を傷つけること、自分を偽ること",
  "例：人の話を聞くこと、新しいことを学ぶこと、問題を解決すること",
  "例：相手を尊重する、正直に話す、相手の気持ちを考える",
  "例：絵を描くこと、音楽、スポーツ、読書",
  "例：嘘をついたとき、人を傷つけたとき、自分に正直でなかったとき",
  "例：優しさ、誠実さ、強さ、明るさ",
  "例：人を助けること、創作活動、学ぶこと、運動",
  "例：家族と過ごす、趣味に没頭する、旅行する、学び続ける",
  "例：周りに合わせた仕事、見栄のための買い物、無理な人間関係",
  "例：人の話を聞くこと、共感する力、問題解決力、創造力",
  "例：自然、人の優しさ、芸術作品、誠実な行動",
  "例：相手を大切にすること、無条件に受け入れること、支え合うこと",
  "例：自分を受け入れること、心が落ち着くこと、ありのままでいられること",
  "例：自分の価値を認められること、人の役に立つこと、自分らしさを表現すること",
  "例：約束を守ること、正直であること、相手を裏切らないこと",
]

// ゴールド問題判定
const isGoldenQuestion = (questionNumber: number): boolean => {
  return (questionNumber + 1) % 3 === 0
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

// AffiliateComponent（変更禁止）
const AffiliateComponent = ({ className = "", affiliateTextPattern, onAffiliateClick }: { className?: string; affiliateTextPattern?: { headline: string; description: string }; onAffiliateClick?: () => void }) => {
  const affiliateHtml = `<a href="https://px.a8.net/svt/ejp?a8mat=45167E+679KMQ+5OI8+5ZEMP" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www27.a8.net/svt/bgt?aid=250317482375&wid=001&eno=01&mid=s00000026504001005000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=45167E+679KMQ+5OI8+5ZEMP" alt="">`

  const handleContainerClick = (e: React.MouseEvent): void => {
    const target = e.target as HTMLElement
    if (target.tagName === 'A' || target.closest('a')) {
      if (onAffiliateClick) {
        onAffiliateClick()
      }
    }
  }

  return (
    <div className={`w-full mx-auto mt-2 mb-2 ${className}`} onClick={handleContainerClick}>
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

// ローディングページ
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

  const audioFiles = [
    '/sound/gamebgmchild.mp3',
    '/sound/nextpage.mp3',
    '/sound/typing.mp3',
    '/sound/100pt.mp3',
    '/sound/point.mp3',
    '/sound/timeup.mp3',
  ]

  useEffect(() => {
    let loadedCount = 0
    const totalFiles = audioFiles.length

    const preloadAudio = (): void => {
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
        audio.load()
      })
    }

    preloadAudio()

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

  useEffect(() => {
    if (audioLoaded) {
      setProgress(100)
      const timer = setTimeout(() => {
        onLoadComplete()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [audioLoaded, onLoadComplete])

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

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center animate-bounce">
              <span className="text-4xl">💎</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
          価値観発見ゲーム
        </h1>
        <p className="text-white/80 mb-8 text-lg">心の回復ゲーム</p>

        <div className="w-64 h-3 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
          <div
            className="h-full bg-white rounded-full transition-all duration-300 ease-out shadow-md"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <p className="mt-4 text-white font-bold text-xl drop-shadow">
          {Math.min(Math.round(progress), 100)}%
        </p>

        <p className="mt-2 text-white/90 text-sm animate-pulse">
          {loadingText}
        </p>

        <div className="mt-6">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      </div>
    </div>
  )
}

// イントロページ
const IntroPage = ({ onStart, isMuted, setIsMuted }: { onStart: () => void; isMuted: boolean; setIsMuted: (value: boolean) => void }) => {
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [explainCatVideo] = useState(() => QUIZ_CAT_VIDEOS[Math.floor(Math.random() * QUIZ_CAT_VIDEOS.length)])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in" style={{ background: "#f5f7f2" }}>
      <TermsOfService isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <div className="w-full max-w-2xl space-y-6">
        {/* タイトルカード */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border-4 border-green-400 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-green-400" />

          <div className="text-center mb-6">
            <p className="text-xs tracking-widest text-green-600 uppercase mb-2 opacity-80">Value Discovery</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
              💎 価値観発見ゲーム
            </h1>

            {/* 猫動画サムネイル */}
            <div className="flex justify-center mt-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-green-400 shadow-lg">
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

          <div className="space-y-4 text-gray-700">
            <p className="text-lg leading-relaxed">
              あなたが心の奥深くで求めているものを見つけることを目指します。
              その通りの行動をすることであなたは幸福度が高い人生を送れます。
            </p>
            <p className="text-base">
              1問30秒です。直感で答えてみましょう！ではいってらっしゃい！
            </p>
            <p className="text-sm text-green-600 font-semibold">
              ※完全無料です。
            </p>
          </div>
        </div>

        {/* 注意カード */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200">
          <p className="text-red-600 font-bold text-center mb-2">
            ⚠️ 残り時間が過ぎると-50ptされます！
          </p>
          <p className="text-orange-700 text-sm text-center">
            あなたを守るため、個人情報は入力しないでください。<br />
            例：佐々木君が → ｓ君が
          </p>
        </div>

        {/* 消音モードボタン */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all shadow-md ${
              isMuted
                ? "bg-gray-500 hover:bg-gray-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white font-medium`}
          >
            <span className="text-xl">{isMuted ? "🔇" : "🔊"}</span>
            <span>{isMuted ? "消音モード中" : "消音モードを選択"}</span>
          </button>
        </div>

        {/* 注意書き */}
        <p className="text-red-500 text-sm text-center">
          重度のトラウマなどお持ちの方は私のゲームではなく、精神科医にかかる事を推奨いたします
        </p>

        {/* スタートボタン */}
        <div className="text-center space-y-3">
          <p className="text-gray-500 text-sm">
            スタートボタンをおすと、<button type="button" onClick={() => setIsTermsOpen(true)} className="text-green-600 underline hover:text-green-800 font-medium">利用規約</button>に同意したことになります。
          </p>
          <button
            onClick={onStart}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white font-black px-12 py-4 rounded-full text-xl tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            スタート →
          </button>
        </div>
      </div>
    </div>
  )
}

// 性別・年代選択ページ
const PrestartPage = ({
  gender,
  setGender,
  ageGroup,
  setAgeGroup,
  onContinue,
}: {
  gender: string
  setGender: (value: string) => void
  ageGroup: string
  setAgeGroup: (value: string) => void
  onContinue: () => void
}) => {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in" style={{ background: "#f5f7f2" }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 shadow-lg border-4 border-green-400 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-green-400" />

          <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">はじめに</h1>
          <p className="text-gray-600 mb-6 text-center">あなたについて教えてください</p>

          <div className="space-y-6">
            {/* 性別 */}
            <div>
              <label className="block text-lg font-bold text-gray-700 mb-2">性別</label>
              <div className="flex flex-wrap gap-2">
                {["男性", "女性", "その他", "回答しない"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setGender(option)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      gender === option
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-green-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* 年代 */}
            <div>
              <label className="block text-lg font-bold text-gray-700 mb-2">年代</label>
              <div className="flex flex-wrap gap-2">
                {["10代", "20代", "30代", "40代", "50代", "60代以上"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setAgeGroup(option)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      ageGroup === option
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-green-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* 次へボタン */}
            <div className="pt-4">
              <Button
                onClick={onContinue}
                disabled={!gender || !ageGroup}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                次へ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// クイズページ（Expose風UI）
const QuizPage = ({
  currentQuiz,
  userAnswers,
  totalPoints,
  allUserAnswers,
  onUpdateAnswer,
  onSubmit,
  onDesireFound,
  onTimeUp,
  playSoundEffect,
  isMuted,
  onExit,
}: {
  currentQuiz: number
  userAnswers: string[]
  totalPoints: number
  allUserAnswers: string[][]
  onUpdateAnswer: (index: number, value: string) => void
  onSubmit: () => void
  onDesireFound: () => void
  onTimeUp: () => void
  playSoundEffect: (soundPath: string) => void
  isMuted: boolean
  onExit: () => void
}) => {
  const isMobile = useIsMobile()
  const { playTyping } = useInteractionSounds(isMuted)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const [timeLeft, setTimeLeft] = useState(30)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showDarkAnimation, setShowDarkAnimation] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showContent, setShowContent] = useState(true)
  // 猫動画関連
  const [showCatVideo, setShowCatVideo] = useState(false)
  const [currentCatVideo] = useState(() => QUIZ_CAT_VIDEOS[Math.floor(Math.random() * QUIZ_CAT_VIDEOS.length)])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // タイマー処理
  useEffect(() => {
    if (!showContent) return

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          setShowDarkAnimation(true)
          setTimeout(() => {
            onTimeUp()
          }, 0)
          setTimeout(() => {
            setShowDarkAnimation(false)
          }, 1000)
          setTimeout(() => {
            setTimeLeft(30)
          }, 100)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [showContent, onTimeUp])

  // 境界チェック
  if (currentQuiz >= quizzes.length || !quizzes[currentQuiz]) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center" style={{ background: "#f5f7f2" }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">クイズ完了！</h2>
          <Button onClick={onDesireFound} className="bg-green-500 hover:bg-green-600 text-white">
            結果を見る
          </Button>
        </div>
      </div>
    )
  }

  const currentQuestion = quizzes[currentQuiz].question
  const hasValidAnswers = userAnswers.some((answer) => answer.trim() !== "")

  const getTimeColor = (timeLeft: number): string => {
    if (timeLeft <= 5) return "text-red-500 font-bold animate-pulse"
    if (timeLeft <= 10) return "text-orange-500 font-bold"
    return "text-green-600"
  }

  const handleSubmitLocal = (): void => {
    if (!hasValidAnswers) {
      onSubmit()
      return
    }

    setShowContent(false)
    setIsTransitioning(true)
    setShowConfetti(true)

    // 猫動画を表示
    setShowCatVideo(true)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }

    setTimeout(() => {
      setShowConfetti(false)
      setShowCatVideo(false)
      onSubmit()
      setIsTransitioning(false)
      setTimeout(() => {
        setShowContent(true)
        setTimeLeft(30)
      }, 150)
    }, 1500)
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col" style={{ background: "#f5f7f2" }}>
      {/* Confetti Animation */}
      <ConfettiCanvas isActive={showConfetti} duration={2000} particleCount={50} points={isGoldenQuestion(currentQuiz) ? 300 : 100} />

      {/* Dark Animation - タイムアップ時 */}
      <DarkAnimationCanvas isActive={showDarkAnimation} duration={1000} />

      {/* 猫動画ポップアップ */}
      <AnimatePresence>
        {showCatVideo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowCatVideo(false)}
          >
            <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-sm w-full mx-4">
              <video
                ref={videoRef}
                src={currentCatVideo}
                className="w-full rounded-lg"
                muted={isMuted}
                playsInline
                autoPlay
                onEnded={() => setShowCatVideo(false)}
              />
              <p className="text-center text-green-600 font-bold mt-2">
                +{isGoldenQuestion(currentQuiz) ? 300 : 100}pt 獲得！
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showContent && (
        <div className="flex-1 flex flex-col items-center p-4 md:p-6 pb-32">
          {/* ヘッダー情報 */}
          <div className="w-full max-w-2xl mb-4">
            <div className="bg-white rounded-xl p-4 shadow-md border border-green-200">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="text-green-600 font-medium">
                  🍃 問題 {currentQuiz + 1} / {quizzes.length}
                </div>
                <div className={`font-medium ${getTimeColor(timeLeft)}`}>
                  ⏱️ 残り {timeLeft}秒
                </div>
                <div className="text-green-600 text-xl font-bold">
                  🏆 {totalPoints}pt
                </div>
              </div>

              {/* 進行インジケーター */}
              <div className="flex justify-center gap-1 mt-3">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentQuiz ? "bg-green-500 w-4" : i < currentQuiz ? "bg-green-400" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 質問カード（Expose風） */}
          <div className="w-full max-w-2xl">
            <div className={`bg-white rounded-2xl p-6 shadow-lg border-4 relative overflow-hidden ${
              isGoldenQuestion(currentQuiz) ? "border-yellow-400" : "border-green-400"
            }`}>
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${
                isGoldenQuestion(currentQuiz)
                  ? "from-yellow-500 to-yellow-400"
                  : "from-green-500 to-green-400"
              }`} />

              {isGoldenQuestion(currentQuiz) && (
                <div className="bg-yellow-100 rounded-lg p-2 mb-4 text-center">
                  <span className="text-yellow-700 font-bold">🌟 ゴールド問題！ 300pt獲得のチャンス！</span>
                </div>
              )}

              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 leading-relaxed" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
                Q{currentQuiz + 1}. {currentQuestion}
              </h2>

              {/* 回答例 */}
              <p className="text-gray-500 text-sm mb-4">
                {answerExamples[currentQuiz]}
              </p>

              {/* 猫イラスト */}
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 rounded-full overflow-hidden border-4 shadow-lg flex-shrink-0 ${showCatVideo ? 'animate-bounce' : ''} ${
                  isGoldenQuestion(currentQuiz) ? "border-yellow-400" : "border-green-400"
                }`}>
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
              </div>

              {/* 回答欄 */}
              <div className="space-y-4">
                {userAnswers.map((answer, index) => (
                  <div key={index} className="relative">
                    <Input
                      type="text"
                      placeholder="直感で答えてみましょう..."
                      value={answer}
                      onChange={(e) => {
                        onUpdateAnswer(index, e.target.value)
                        playTyping()
                      }}
                      className={`w-full p-4 text-lg border-2 rounded-xl focus:ring-2 ${
                        isGoldenQuestion(currentQuiz)
                          ? "border-yellow-300 focus:border-yellow-500 focus:ring-yellow-200"
                          : "border-green-200 focus:border-green-500 focus:ring-green-200"
                      }`}
                    />
                  </div>
                ))}

                {/* 回答ボタン */}
                <button
                  onClick={handleSubmitLocal}
                  disabled={!hasValidAnswers}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    hasValidAnswers
                      ? isGoldenQuestion(currentQuiz)
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg hover:shadow-xl animate-pulse hover:animate-none"
                        : "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  回答する {isGoldenQuestion(currentQuiz) ? "(+300pt)" : "(+100pt)"}
                </button>
              </div>
            </div>
          </div>

          {/* 終了ボタン（スクロール位置） */}
          <div className="mt-8 text-center">
            <button
              onClick={onExit}
              className="bg-gray-200 hover:bg-gray-300 text-gray-600 px-6 py-3 rounded-lg text-sm transition-all"
            >
              終了する
            </button>
          </div>

          {/* アフィリエイト */}
          <div className="mt-6">
            <AffiliateComponent
              affiliateTextPattern={affiliateTextPatterns[currentQuiz % affiliateTextPatterns.length]}
            />
          </div>
        </div>
      )}

      {/* 「欲求が見つかった」固定ボタン */}
      <motion.button
        onClick={onDesireFound}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2
          bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600
          text-white font-bold px-8 py-4 rounded-full
          shadow-lg shadow-purple-500/50
          animate-pulse hover:animate-none
          z-50 text-lg"
      >
        💎 欲求が見つかった（次のステージへ）
      </motion.button>
    </div>
  )
}

// 価値観選択ページ（SummaryPage）
const SummaryPage = ({
  allUserAnswers,
  selectedAnswers,
  onAnswerSelect,
  onContinue,
  onExit,
}: {
  allUserAnswers: string[][]
  selectedAnswers: string[]
  onAnswerSelect: (answer: string) => void
  onContinue: () => void
  onExit: () => void
}) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const allAnswers = Array.from(new Set(allUserAnswers.flat().filter((answer) => answer.trim() !== "")))
  const [showConfetti, setShowConfetti] = useState(false)
  const [summaryCatVideo] = useState(() => QUIZ_CAT_VIDEOS[Math.floor(Math.random() * QUIZ_CAT_VIDEOS.length)])

  const handleContinue = (): void => {
    if (selectedAnswers.length === 0) return
    setShowConfetti(true)
    setTimeout(() => {
      setShowConfetti(false)
      onContinue()
    }, 1000)
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in" style={{ background: "#f5f7f2" }}>
      <ConfettiCanvas isActive={showConfetti} duration={1000} particleCount={30} points={300} />

      <div className="w-full max-w-2xl space-y-6">
        {/* タイトルカード */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-green-400 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-green-400" />

          <h1 className="text-2xl font-bold text-green-800 mb-2 text-center" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            💎 価値観を選択してください
          </h1>
          <p className="text-gray-600 text-center mb-2">
            あなたの回答の中から最大3つまで選んでください
          </p>
          <p className="text-green-600 font-bold text-center">
            選択済み: {selectedAnswers.length}/3
          </p>

          {/* 猫イラスト */}
          <div className="flex justify-center mt-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-green-400 shadow-lg">
              <video
                src={summaryCatVideo}
                className="w-full h-full object-cover"
                muted
                playsInline
                preload="metadata"
              />
            </div>
          </div>
        </div>

        {/* 回答リスト */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {allAnswers.map((answer, index) => {
              const isSelected = selectedAnswers.includes(answer)
              const canSelect = selectedAnswers.length < 3 || isSelected

              return (
                <button
                  key={index}
                  onClick={() => canSelect && onAnswerSelect(answer)}
                  disabled={!canSelect}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                    isSelected
                      ? "bg-green-500 text-white shadow-lg transform scale-[1.02]"
                      : canSelect
                        ? "bg-gray-50 text-gray-800 hover:bg-gray-100 hover:shadow-md border-2 border-gray-200"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed border-2 border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? "border-white bg-white" : "border-gray-400"
                      }`}
                    >
                      {isSelected && <div className="w-3 h-3 bg-green-500 rounded-full" />}
                    </div>
                    <span className="font-medium">{answer}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ボタン */}
        <div className="space-y-4">
          <Button
            onClick={handleContinue}
            disabled={selectedAnswers.length === 0}
            className={`w-full py-4 text-lg font-bold rounded-full ${
              selectedAnswers.length > 0
                ? "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white shadow-lg"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            次へ進む ({selectedAnswers.length}個選択済み)
          </Button>

          <Button
            onClick={onExit}
            className="w-full text-green-600 bg-transparent hover:text-green-700 hover:bg-green-50 border-0"
          >
            終了
          </Button>
        </div>

        {/* アフィリエイト */}
        <AffiliateComponent
          affiliateTextPattern={affiliateTextPatterns[Math.floor(Math.random() * affiliateTextPatterns.length)]}
        />
      </div>
    </div>
  )
}

// 行動プランページ（Expose風）
const ActionPlanPage = ({
  selectedAnswers,
  actionPlans,
  totalPoints,
  setTotalPoints,
  onActionPlanAdd,
  onComplete,
  onExit,
  isMuted,
}: {
  selectedAnswers: string[]
  actionPlans: ActionPlan[]
  totalPoints: number
  setTotalPoints: (value: number | ((prev: number) => number)) => void
  onActionPlanAdd: (when: string, where: string, what: string) => void
  onComplete: () => void
  onExit: () => void
  isMuted: boolean
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const { playTyping, playClick } = useInteractionSounds(isMuted)

  const [selectedVideo] = useState(() => CAT_VIDEOS[Math.floor(Math.random() * CAT_VIDEOS.length)])
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [currentStep, setCurrentStep] = useState<ActionStep>('when')
  const [currentLevel, setCurrentLevel] = useState(actionPlans.length + 1)
  const [customInput, setCustomInput] = useState('')
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<ActionPlan>({ when: '', where: '', what: '' })
  const [showConfetti, setShowConfetti] = useState(false)
  const [currentPoints, setCurrentPoints] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const playSound = useCallback((soundFile: string): void => {
    if (isMuted) return
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    audioRef.current = new Audio(soundFile)
    audioRef.current.volume = 0.5
    audioRef.current.play().catch(() => {})
  }, [isMuted])

  // 選択肢定義（Exposeから）
  const whenOptions = ['朝', '昼', '夜']
  const whereOptions = ['学校', '職場', '飲み会', '遊び']

  const getProgress = (): number => {
    if (currentStep === 'when') return 33
    if (currentStep === 'where') return 66
    if (currentStep === 'what') return 100
    return 100
  }

  const getBubbleText = (): string => {
    if (currentStep === 'when') return 'いつする行動？'
    if (currentStep === 'where') return 'どこでする行動？'
    if (currentStep === 'what') return '何をする？'
    return ''
  }

  const getPlaceholder = (): string => {
    if (currentStep === 'when') return '例：朝起きたとき、仕事終わりに、週末に...'
    if (currentStep === 'where') return '例：自宅で、カフェで、公園で...'
    if (currentStep === 'what') return '例：感謝の気持ちを書く、瞑想する...'
    return ''
  }

  const handleSelectAnswer = (answer: string): void => {
    setSelectedAnswer(answer)
    setIsCustomMode(false)
    setCustomInput('')
  }

  const handleCustomMode = (): void => {
    setIsCustomMode(true)
    setSelectedAnswer('')
  }

  const handleSubmit = (): void => {
    const answer = isCustomMode ? customInput : selectedAnswer
    if (!answer.trim()) return

    // ポイント計算
    let points = 0
    if (currentStep === 'when') {
      points = isCustomMode ? 300 : 100
    } else if (currentStep === 'where') {
      points = isCustomMode ? 300 : 200
    } else if (currentStep === 'what') {
      points = 300
    }

    setTotalPoints((prev) => prev + points)
    setCurrentPoints(points)
    playSound('/sound/100pt.mp3')
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 1500)

    const playVideo = (): void => {
      setIsVideoPlaying(true)
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.play().catch(() => {})
      }
    }

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
        setIsCustomMode(true)
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

  const handleAddLevel = (): void => {
    onActionPlanAdd(currentPlan.when, currentPlan.where, currentPlan.what)
    setCurrentLevel((prev) => prev + 1)
    setCurrentStep('when')
    setCurrentPlan({ when: '', where: '', what: '' })
    setSelectedAnswer('')
    setCustomInput('')
    setIsCustomMode(false)
  }

  const handleProceedToComplete = (): void => {
    if (currentPlan.when || currentPlan.where || currentPlan.what) {
      onActionPlanAdd(currentPlan.when, currentPlan.where, currentPlan.what)
    }
    onComplete()
  }

  const completedLevels = actionPlans.length

  // イントロ画面
  if (showIntro) {
    return (
      <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in overflow-y-auto" style={{ background: "#f5f7f2" }}>
        <div className="w-full max-w-2xl space-y-6 pb-20">
          <div className="text-center py-4">
            <p className="text-xs tracking-widest text-green-600 uppercase mb-2 opacity-80">Action List</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
              🎯 行動リストの作成
            </h1>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-green-400 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-green-400" />
            <h2 className="text-green-600 font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
              <span>📝</span> これからやること
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 bg-green-50 p-4 rounded-xl">
                <span className="text-3xl">🎯</span>
                <div>
                  <p className="font-bold text-base text-gray-800 mb-2">価値観に沿った行動をリストアップ</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    あなたが選んだ価値観に基づいて、<span className="text-green-600 font-semibold">具体的な行動プラン</span>を作成します。
                  </p>
                </div>
              </div>
              <div className="flex gap-4 bg-green-50 p-4 rounded-xl">
                <span className="text-3xl">⏰</span>
                <div>
                  <p className="font-bold text-base text-gray-800 mb-2">いつ・どこで・何をするか</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    各レベルの行動について、<span className="text-green-600 font-semibold">「いつ」「どこで」「何をするか」</span>を具体的に書きます。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-blue-400 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-blue-400" />
            <h2 className="text-blue-600 font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
              <span>💎</span> あなたが選んだ価値観
            </h2>
            <div className="space-y-2">
              {selectedAnswers.map((answer, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <span className="bg-blue-500 text-white font-bold min-w-[28px] h-7 rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  <span className="text-blue-900 font-medium">{answer}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center py-6">
            <button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                setShowIntro(false)
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white font-black px-12 py-4 rounded-full text-base tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              行動リストを作成する →
            </button>
          </div>

          <div className="text-center">
            <button onClick={onExit} className="text-gray-500 hover:text-gray-700 underline text-sm">
              終了する
            </button>
          </div>

          {/* アフィリエイト */}
          <div className="mt-4">
            <AffiliateComponent
              affiliateTextPattern={affiliateTextPatterns[Math.floor(Math.random() * affiliateTextPatterns.length)]}
            />
          </div>
        </div>
      </div>
    )
  }

  // 確認画面
  if (currentStep === 'confirmation') {
    return (
      <div className="relative w-full min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-green-100 overflow-y-auto">
        <ConfettiCanvas isActive={showConfetti} duration={1500} particleCount={50} points={currentPoints} />

        <div className="flex-1 flex flex-col items-center justify-start p-4">
          <div className="w-full max-w-md mb-2">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 transition-all duration-500" style={{ width: '100%' }} />
            </div>
          </div>

          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <div
                key={level}
                className={`w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center ${
                  level <= completedLevels + 1 ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-gray-300'
                }`}
              >
                <span className="text-xs font-semibold text-white">Lv{level}</span>
              </div>
            ))}
          </div>

          <div className="text-green-600 text-2xl font-extrabold mb-4">🏆 {totalPoints}pt</div>

          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md mb-4">
            <h2 className="text-xl font-bold text-green-800 mb-4 text-center">
              レベル{currentLevel}の行動プランが完成しました！
            </h2>
            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700"><span className="font-bold text-blue-700">いつ：</span>{currentPlan.when}</p>
              <p className="text-gray-700"><span className="font-bold text-blue-700">どこで：</span>{currentPlan.where}</p>
              <p className="text-gray-700"><span className="font-bold text-blue-700">何を：</span>{currentPlan.what}</p>
            </div>

            <div className="rounded-lg overflow-hidden mb-4">
              <video
                ref={videoRef}
                src={selectedVideo}
                className="w-full"
                muted={isMuted}
                playsInline
                onEnded={() => setIsVideoPlaying(false)}
              />
            </div>

            <div className="space-y-3">
              {currentLevel < 6 && (
                <button
                  onClick={handleAddLevel}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  次のレベルを作成する（Lv{currentLevel + 1}）
                </button>
              )}
              <button
                onClick={handleProceedToComplete}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                行動プラン作成を終了する
              </button>
            </div>

            {/* アフィリエイト */}
            <div className="mt-4">
              <AffiliateComponent
                affiliateTextPattern={affiliateTextPatterns[Math.floor(Math.random() * affiliateTextPatterns.length)]}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // メインの入力画面
  return (
    <div className="relative w-full min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-green-100 overflow-y-auto">
      <ConfettiCanvas isActive={showConfetti} duration={1500} particleCount={50} points={currentPoints} />

      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setIsVideoPlaying(false)}
          >
            <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-sm w-full mx-4">
              <video
                ref={videoRef}
                src={selectedVideo}
                className="w-full rounded-lg"
                muted={isMuted}
                playsInline
                autoPlay
                onEnded={() => setIsVideoPlaying(false)}
              />
              <p className="text-center text-green-600 font-bold mt-2">+{currentPoints}pt 獲得！</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col items-center justify-start p-4">
        <div className="w-full max-w-md mb-2">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${getProgress()}%` }} />
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <div
              key={level}
              className={`w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center ${
                level < currentLevel
                  ? 'bg-green-500 shadow-lg shadow-green-500/50'
                  : level === currentLevel
                    ? 'bg-green-400 shadow-md animate-pulse'
                    : 'bg-gray-300'
              }`}
            >
              <span className={`text-xs font-semibold ${level <= currentLevel ? 'text-white' : 'text-gray-400'}`}>
                Lv{level}
              </span>
            </div>
          ))}
        </div>

        <div className="text-green-600 text-2xl font-extrabold mb-4">🏆 {totalPoints}pt</div>

        <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-md mb-4">
          <div className="bg-green-100 rounded-xl p-4 mb-4 relative">
            <div className="absolute -top-2 left-6 w-4 h-4 bg-green-100 transform rotate-45" />
            <p className="text-green-800 font-bold text-lg">{getBubbleText()}</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-600 font-medium">あなたの価値観：</p>
            <p className="text-blue-800 font-bold">{selectedAnswers[0]}</p>
          </div>

          {/* プリセット選択肢（whenとwhereの場合） */}
          {(currentStep === 'when' || currentStep === 'where') && !isCustomMode && (
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-3 gap-2">
                {(currentStep === 'when' ? whenOptions : whereOptions).map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelectAnswer(option)}
                    className={`py-3 px-4 rounded-xl font-medium transition-all ${
                      selectedAnswer === option
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCustomMode}
                className="w-full py-3 px-4 rounded-xl font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-all border-2 border-yellow-300"
              >
                ✏️ 自由に入力する（+300pt）
              </button>
            </div>
          )}

          {/* カスタム入力 */}
          {(isCustomMode || currentStep === 'what') && (
            <div className="space-y-4">
              <Input
                type="text"
                value={customInput}
                onChange={(e) => {
                  setCustomInput(e.target.value)
                  playTyping()
                }}
                placeholder={getPlaceholder()}
                className="w-full p-4 text-lg border-2 border-green-300 rounded-xl focus:border-green-500 focus:ring-green-500"
              />
            </div>
          )}

          <button
            onClick={() => {
              playClick()
              handleSubmit()
            }}
            disabled={!(isCustomMode || currentStep === 'what' ? customInput.trim() : selectedAnswer)}
            className={`w-full py-4 rounded-full font-bold text-lg transition-all mt-4 ${
              (isCustomMode || currentStep === 'what' ? customInput.trim() : selectedAnswer)
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            回答する（+{isCustomMode || currentStep === 'what' ? 300 : currentStep === 'when' ? 100 : 200}pt）
          </button>

          <div className="mt-4 text-center text-sm text-gray-500">
            {currentStep === 'when' && 'ステップ 1/3'}
            {currentStep === 'where' && 'ステップ 2/3'}
            {currentStep === 'what' && 'ステップ 3/3'}
          </div>
        </div>

        <button onClick={onExit} className="text-gray-500 hover:text-gray-700 underline text-sm">
          終了する
        </button>

        {/* アフィリエイト */}
        <div className="mt-6 w-full max-w-md">
          <AffiliateComponent
            affiliateTextPattern={affiliateTextPatterns[Math.floor(Math.random() * affiliateTextPatterns.length)]}
          />
        </div>
      </div>
    </div>
  )
}

// 結果ページ
const ResultPage = ({
  totalPoints,
  selectedAnswers,
  actionPlans,
  onRestart,
  onExit,
  enjoymentRating,
  setEnjoymentRating,
  improvementRating,
  setImprovementRating,
  userId,
  sessionId,
  gender,
  ageGroup,
}: {
  totalPoints: number
  selectedAnswers: string[]
  actionPlans: ActionPlan[]
  onRestart: () => void
  onExit: () => void
  enjoymentRating: number
  setEnjoymentRating: (value: number) => void
  improvementRating: number
  setImprovementRating: (value: number) => void
  userId: string
  sessionId: string
  gender: string
  ageGroup: string
}) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [affiliateTextPattern] = useState(() => affiliateTextPatterns[Math.floor(Math.random() * affiliateTextPatterns.length)])
  const [affiliatePatternIndex] = useState(() => Math.floor(Math.random() * affiliateTextPatterns.length))
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ゲームデータ保存
  useEffect(() => {
    const saveGameData = async (): Promise<void> => {
      try {
        await fetch("/api/responses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table: "quiz_responses_v2",
            user_id: userId,
            session_id: sessionId,
            total_points: totalPoints,
            selected_values: selectedAnswers,
            action_plans: actionPlans.map(plan => plan.what).filter(what => what.trim() !== ""),
            gender: gender,
            age_group: ageGroup,
            enjoyment_rating: null,
            improvement_rating: null,
          }),
        })
        setHasSubmitted(true)
      } catch {
        console.error("ゲームデータの自動保存に失敗")
      }
    }

    saveGameData()
  }, [])

  const handleSurveySubmit = async (): Promise<void> => {
    if (hasSubmitted || isSubmitting) return
    setIsSubmitting(true)

    await fetch("/api/affiliate-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        game_name: "valuediscovery",
        user_id: userId,
        session_id: sessionId,
        gender: gender || null,
        age_group: ageGroup || null,
        enjoyment_rating: enjoymentRating,
        improvement_rating: improvementRating,
        affiliate_clicked: false,
        affiliate_pattern_index: affiliatePatternIndex,
      }),
    })
    setHasSubmitted(true)

    setIsSubmitting(false)
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in" style={{ background: "#f5f7f2" }}>
      <div className="w-full max-w-2xl space-y-6">
        <div className="bg-white rounded-2xl p-8 shadow-lg border-4 border-green-400 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-green-400" />

          <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">あなたの価値観診断結果</h1>

          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-green-700 mb-2">🏆 {totalPoints}pt</div>
            <div className="text-lg text-gray-500">全国平均: 1200pt</div>
          </div>

          <div className="text-center text-purple-600 font-bold mb-6">
            ★yumeのゲーム　　スクショしてSNSに投稿しよう！★
          </div>

          {/* 選択した価値観 */}
          {selectedAnswers.length > 0 && (
            <div className="bg-green-50 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                💎 あなたが選んだ価値観
              </h2>
              <div className="space-y-2">
                {selectedAnswers.map((answer, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                    <span className="bg-green-500 text-white font-bold min-w-[28px] h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-green-900 font-medium">{answer}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 行動プラン */}
          {actionPlans.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                🎯 あなたの行動プラン
              </h2>
              <div className="space-y-3">
                {actionPlans.map((plan, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <span className="bg-blue-500 text-white font-bold min-w-[28px] h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-700 mb-1"><span className="font-bold text-blue-700">いつ:</span> {plan.when || "未入力"}</p>
                        <p className="text-gray-700 mb-1"><span className="font-bold text-blue-700">どこで:</span> {plan.where || "未入力"}</p>
                        <p className="text-gray-700"><span className="font-bold text-blue-700">何を:</span> {plan.what || "未入力"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* アンケート */}
          {!hasSubmitted ? (
            <div className="border-t-2 border-gray-200 pt-6">
              <h2 className="text-xl font-bold text-purple-600 mb-4 text-center">📝 アンケートにご協力ください</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="enjoyment-rating">
                    このゲームは楽しかったですか？ ({enjoymentRating}/10)
                  </label>
                  <input
                    id="enjoyment-rating"
                    type="range"
                    min="1"
                    max="10"
                    value={enjoymentRating}
                    onChange={(e) => setEnjoymentRating(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    aria-label="楽しさ評価"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="improvement-rating">
                    自分を見つめ直すきっかけになりましたか？ ({improvementRating}/10)
                  </label>
                  <input
                    id="improvement-rating"
                    type="range"
                    min="1"
                    max="10"
                    value={improvementRating}
                    onChange={(e) => setImprovementRating(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    aria-label="改善度評価"
                  />
                </div>
                <Button
                  onClick={handleSurveySubmit}
                  disabled={isSubmitting}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3"
                >
                  {isSubmitting ? "送信中..." : "アンケートを送信"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-t-2 border-gray-200 pt-6 text-center">
              <p className="text-xl text-green-600 font-bold">✓ アンケートにご協力ありがとうございました！</p>
            </div>
          )}

          {/* アフィリエイト */}
          <div className="border-t-2 border-gray-200 pt-6 mt-6">
            <h2 className="text-xl font-bold text-orange-600 mb-4 text-center">{affiliateTextPattern.headline}</h2>
            <AffiliateComponent
              className="mx-auto"
              affiliateTextPattern={affiliateTextPattern}
              onAffiliateClick={() => {
                fetch("/api/affiliate-click", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    game_name: "valuediscovery",
                    user_id: userId,
                    session_id: sessionId,
                    gender: gender || null,
                    age_group: ageGroup || null,
                    enjoyment_rating: enjoymentRating,
                    improvement_rating: improvementRating,
                    affiliate_clicked: true,
                    affiliate_pattern_index: affiliatePatternIndex,
                  }),
                }).catch(() => {})
              }}
            />
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={onRestart} className="bg-green-500 hover:bg-green-600 text-white px-8 py-3">
            もう一度診断する
          </Button>
          <Button onClick={onExit} className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3">
            終了
          </Button>
        </div>
      </div>
    </div>
  )
}

// メインコンポーネント
const ValueDiscoveryGame = () => {
  const router = useRouter()
  const [gameState, setGameState] = useState<GameState>("loading")
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>([""])
  const [allUserAnswers, setAllUserAnswers] = useState<string[][]>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [enjoymentRating, setEnjoymentRating] = useState(5)
  const [improvementRating, setImprovementRating] = useState(5)
  const [gender, setGender] = useState<string>("")
  const [ageGroup, setAgeGroup] = useState<string>("")
  const [userId, setUserId] = useState<string>("")
  const [sessionId, setSessionId] = useState<string>("")
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([])
  const [isMuted, setIsMuted] = useState(false)
  const bgmRef = useRef<HTMLAudioElement | null>(null)

  const playSoundEffect = useCallback((soundPath: string): void => {
    if (!isMuted) {
      const audio = new Audio(soundPath)
      audio.volume = 0.5
      audio.play().catch(() => {})
    }
  }, [isMuted])

  // BGM管理
  useEffect(() => {
    const shouldPlayBgm = gameState !== "loading" && gameState !== "intro" && gameState !== "result"

    if (shouldPlayBgm && !isMuted) {
      if (!bgmRef.current) {
        bgmRef.current = new Audio("/sound/gamebgmchild.mp3")
        bgmRef.current.loop = true
        bgmRef.current.volume = 0.3
      }
      bgmRef.current.play().catch(() => {})
    } else {
      if (bgmRef.current) {
        bgmRef.current.pause()
      }
    }

    // タブの可視性変更時にBGMを制御
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (bgmRef.current) {
          bgmRef.current.pause()
        }
      } else {
        if (shouldPlayBgm && !isMuted && bgmRef.current) {
          bgmRef.current.play().catch(() => {})
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      if (bgmRef.current) {
        bgmRef.current.pause()
      }
    }
  }, [gameState, isMuted])

  // ユーザーID・セッションID初期化
  useEffect(() => {
    let storedUserId = localStorage.getItem("quiz_user_id")
    if (!storedUserId) {
      storedUserId = crypto.randomUUID()
      localStorage.setItem("quiz_user_id", storedUserId)
    }
    setUserId(storedUserId)
    setSessionId(crypto.randomUUID())
  }, [])

  const handleUpdateAnswer = (index: number, value: string): void => {
    const newAnswers = [...userAnswers]
    while (newAnswers.length <= index) {
      newAnswers.push("")
    }
    newAnswers[index] = value
    setUserAnswers(newAnswers)
  }

  const handleSubmit = (): void => {
    const currentAnswers = userAnswers.filter((answer) => answer.trim() !== "")
    if (currentAnswers.length === 0) return

    setAllUserAnswers((prev) => [...prev, currentAnswers])

    if (currentQuiz < quizzes.length - 1) {
      setCurrentQuiz((prev) => prev + 1)
      setUserAnswers([""])
      const pointsToAdd = isGoldenQuestion(currentQuiz) ? 300 : 100
      if (pointsToAdd === 300) {
        playSoundEffect("/sound/300ptnextpage.mp3")
      } else {
        playSoundEffect("/sound/100pt.mp3")
      }
      setTotalPoints((prev) => prev + pointsToAdd)
    } else {
      playSoundEffect("/sound/gamefinish.mp3")
      setGameState("summary")
    }
  }

  const handleDesireFound = (): void => {
    playSoundEffect("/sound/gamefinish.mp3")
    const currentAnswers = userAnswers.filter((answer) => answer.trim() !== "")
    if (currentAnswers.length > 0) {
      setAllUserAnswers((prev) => [...prev, currentAnswers])
    }
    setGameState("summary")
  }

  const handleTimeUp = (): void => {
    playSoundEffect("/sound/timeup.mp3")
    setTotalPoints((prev) => prev - 50)
  }

  const handleAnswerSelect = (answer: string): void => {
    setSelectedAnswers((prev) => {
      if (prev.includes(answer)) {
        return prev.filter((a) => a !== answer)
      } else if (prev.length < 3) {
        return [...prev, answer]
      }
      return prev
    })
  }

  const handleSummaryContinue = (): void => {
    setGameState("action")
  }

  const handleActionPlanAdd = (when: string, where: string, what: string): void => {
    setActionPlans((prev) => [...prev, { when, where, what }])
  }

  const handleActionComplete = (): void => {
    setGameState("result")
  }

  const handleRestart = (): void => {
    setGameState("intro")
    setCurrentQuiz(0)
    setUserAnswers([""])
    setAllUserAnswers([])
    setTotalPoints(0)
    setSelectedAnswers([])
    setActionPlans([])
    setSessionId(crypto.randomUUID())
  }

  const handleExit = (): void => {
    router.push("/")
  }

  // ゲーム状態に応じたレンダリング
  switch (gameState) {
    case "loading":
      return <LoadingPage onLoadComplete={() => setGameState("intro")} />
    case "intro":
      return <IntroPage onStart={() => setGameState("prestart")} isMuted={isMuted} setIsMuted={setIsMuted} />
    case "prestart":
      return (
        <PrestartPage
          gender={gender}
          setGender={setGender}
          ageGroup={ageGroup}
          setAgeGroup={setAgeGroup}
          onContinue={() => setGameState("quiz")}
        />
      )
    case "quiz":
      return (
        <QuizPage
          currentQuiz={currentQuiz}
          userAnswers={userAnswers}
          totalPoints={totalPoints}
          allUserAnswers={allUserAnswers}
          onUpdateAnswer={handleUpdateAnswer}
          onSubmit={handleSubmit}
          onDesireFound={handleDesireFound}
          onTimeUp={handleTimeUp}
          playSoundEffect={playSoundEffect}
          isMuted={isMuted}
          onExit={handleExit}
        />
      )
    case "summary":
      return (
        <SummaryPage
          allUserAnswers={allUserAnswers}
          selectedAnswers={selectedAnswers}
          onAnswerSelect={handleAnswerSelect}
          onContinue={handleSummaryContinue}
          onExit={handleExit}
        />
      )
    case "action":
      return (
        <ActionPlanPage
          selectedAnswers={selectedAnswers}
          actionPlans={actionPlans}
          totalPoints={totalPoints}
          setTotalPoints={setTotalPoints}
          onActionPlanAdd={handleActionPlanAdd}
          onComplete={handleActionComplete}
          onExit={handleExit}
          isMuted={isMuted}
        />
      )
    case "result":
      return (
        <ResultPage
          totalPoints={totalPoints}
          selectedAnswers={selectedAnswers}
          actionPlans={actionPlans}
          onRestart={handleRestart}
          onExit={handleExit}
          enjoymentRating={enjoymentRating}
          setEnjoymentRating={setEnjoymentRating}
          improvementRating={improvementRating}
          setImprovementRating={setImprovementRating}
          userId={userId}
          sessionId={sessionId}
          gender={gender}
          ageGroup={ageGroup}
        />
      )
    default:
      return <LoadingPage onLoadComplete={() => setGameState("intro")} />
  }
}

export default ValueDiscoveryGame
