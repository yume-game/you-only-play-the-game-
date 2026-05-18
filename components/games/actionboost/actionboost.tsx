"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import ConfettiCanvas from "@/components/animations/ConfettiCanvas"
import { useLanguage } from "@/contexts/LanguageContext"
import { actionboostTranslations, type ActionBoostTranslationKey } from "@/locales/actionboost-translations"
import { TermsOfService } from "@/components/terms-of-service/terms-of-service"

// 自己批判項目の型定義
type SelfCriticism = {
  appearance: string      // 外見
  job: string             // 職業
  pastFailure: string     // 過去の失敗
  pastUnfair: string      // 過去の理不尽
  pastHurt: string        // 過去の自分を傷つけた人
}

// 優しい言葉の型定義
type KindWords = {
  appearance: string
  job: string
  pastFailure: string
  pastUnfair: string
  pastHurt: string
}

// タスク入力の型定義
type TaskInputs = {
  enjoyable: string       // 今日のタスクの楽しみな事
  pastFailure: string     // 過去の失敗
  avoid: string           // しないこと
  pastSuccess: string     // うまくいったこと
  unexpected: string      // 予想外の成功
  successReasons: string[] // 成功する理由3つ
}

// 架空の友人からのメッセージの型定義
type ImaginaryFriendMessage = {
  message: string  // 架空の友人から送られた言葉
}

// 感謝の型定義
type Gratitude = {
  first: string
  second: string
  third: string
}

// 目標の型定義
type Goals = {
  longTerm: string           // 長期の目標
  midTerm: string            // 中期の目標
  shortTerm: string          // 短期の目標
  desiredSituation: string   // 獲得したい状況
  gaps: string[]             // 今あるギャップ3つ
  fasterMethods: string      // より早くたどり着く方法
}

// 効果音再生用のカスタムフック（最初のタイプにだけ音を鳴らす）
const useInteractionSounds = (isMuted: boolean) => {
  const typingAudioRef = useRef<HTMLAudioElement | null>(null)
  const playedFieldsRef = useRef<Set<string>>(new Set())

  // フィールドごとに最初のタイプにだけ音を鳴らす
  const playTypingOnce = useCallback((fieldId: string) => {
    if (isMuted) return
    if (playedFieldsRef.current.has(fieldId)) return // 既に鳴らした

    playedFieldsRef.current.add(fieldId)
    if (!typingAudioRef.current) {
      typingAudioRef.current = new Audio('/sound/typing.mp3')
      typingAudioRef.current.volume = 0.3
    }
    typingAudioRef.current.currentTime = 0
    typingAudioRef.current.play().catch(() => {})
  }, [isMuted])

  // 旧API互換用（引数なしの場合は常に鳴らす）
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

  // 再生済みフィールドをリセット
  const resetPlayedFields = useCallback(() => {
    playedFieldsRef.current.clear()
  }, [])

  return { playTyping, playTypingOnce, playClick, resetPlayedFields }
}

// アフィリエイトテキストパターン
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

// アフィリエイトコンポーネント（expose.tsxと同じ）
const AffiliateComponent = ({ className = "", affiliateTextPattern }: { className?: string; affiliateTextPattern?: { headline: string; description: string } }) => {
  const affiliateHtml = `<a href="https://px.a8.net/svt/ejp?a8mat=45167E+679KMQ+5OI8+5ZEMP" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www27.a8.net/svt/bgt?aid=250317482375&wid=001&eno=01&mid=s00000026504001005000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=45167E+679KMQ+5OI8+5ZEMP" alt="">`

  return (
    <div className={`w-full mx-auto mt-2 mb-2 relative min-h-[400px] ${className}`}>
      {/* 背景画像 - PC版 */}
      <div className="absolute inset-0 hidden md:block">
        <Image
          src="/image/girlbackgroud.png"
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
  ]

  useEffect(() => {
    let loadedCount = 0
    const totalFiles = audioFiles.length

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
    <div className="fixed inset-0 bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-500 flex flex-col items-center justify-center z-50">
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
              <span className="text-4xl">🔥</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
          行動力爆上げゲーム
        </h1>
        <p className="text-white/80 mb-8 text-lg">やればできる！</p>

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
  const { language } = useLanguage()
  const t = (key: ActionBoostTranslationKey) => actionboostTranslations[language][key]
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isTermsOpen, setIsTermsOpen] = useState(false)

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
      <TermsOfService isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      {/* 背景画像 - PC版 */}
      <div className="absolute inset-0 z-0 hidden md:block">
        <Image
          src="/image/art10.png"
          alt="背景"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      {/* 背景画像 - スマホ版 */}
      <div className="absolute inset-0 z-0 block md:hidden">
        <Image
          src="/image/art10.png"
          alt="背景"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 text-center space-y-4 md:space-y-6 bg-orange-700 bg-opacity-70 p-4 md:p-8 rounded-lg max-w-2xl mx-4 my-4 md:my-0">
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

        <div className="space-y-4">
          <p className="text-white/70 text-sm text-center">
            スタートボタンをおすと、<button type="button" onClick={() => setIsTermsOpen(true)} className="text-orange-300 underline hover:text-orange-200 font-medium">利用規約</button>に同意したことになります。
          </p>

          <Button
            onClick={() => {
              playSound('/sound/nextpage.mp3')
              onStart()
            }}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 transition-opacity px-8 py-4 text-xl text-white"
          >
            {t("intro_start")}
          </Button>
        </div>
      </div>
    </div>
  )
}

// 感謝入力ページ
const GratitudeInputPage = ({
  gratitude,
  setGratitude,
  onComplete,
  onExit,
  isMuted,
}: {
  gratitude: Gratitude
  setGratitude: (value: Gratitude) => void
  onComplete: () => void
  onExit: () => void
  isMuted: boolean
}) => {
  const { language } = useLanguage()
  const t = (key: ActionBoostTranslationKey) => actionboostTranslations[language][key]
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { playTypingOnce } = useInteractionSounds(isMuted)

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
    <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in overflow-y-auto"
      style={{ background: "#fff8f0" }}>
      <div className="w-full max-w-2xl space-y-6 pb-20">
        {/* タイトル */}
        <div className="text-center py-4">
          <p className="text-xs tracking-widest text-orange-600 uppercase mb-2 opacity-80">Gratitude</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            🙏 {t("gratitude_title")}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{t("gratitude_subtitle")}</p>
        </div>

        {/* メリット説明カード */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 shadow-sm border border-green-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-bold text-green-800 mb-1">感謝の効果</p>
              <p className="text-sm text-green-700 leading-relaxed">
                感謝することで世の中のポジティブな面に目を向けられるようになり、世界のすべてが悪いわけではないと感じられるようになります。
              </p>
            </div>
          </div>
        </div>

        {/* 感謝入力カード */}
        <div className="bg-white rounded-2xl p-7 shadow-md border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400" />

          <div className="space-y-5">
            {[
              { key: "first" as keyof Gratitude, num: 1 },
              { key: "second" as keyof Gratitude, num: 2 },
              { key: "third" as keyof Gratitude, num: 3 },
            ].map((item) => (
              <div key={item.key}>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                    {item.num}
                  </span>
                  {t("gratitude_placeholder")}
                </label>
                <textarea
                  value={gratitude[item.key]}
                  onChange={(e) => {
                    playTypingOnce(`gratitude_${item.key}`)
                    setGratitude({ ...gratitude, [item.key]: e.target.value })
                  }}
                  placeholder={t("gratitude_placeholder")}
                  className="w-full border-2 border-orange-200 rounded-xl focus:border-orange-500 p-4 min-h-[80px] resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ボタン */}
        <div className="text-center py-6 space-y-4">
          <button
            onClick={() => {
              playSound('/sound/nextpage.mp3')
              onComplete()
            }}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black px-12 py-4 rounded-full text-base tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            {t("next_button")} →
          </button>

          <div>
            <button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                onExit()
              }}
              className="text-gray-500 hover:text-gray-700 underline text-sm"
            >
              {t("exit_button")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 自己批判入力ページ
const SelfCriticismInputPage = ({
  selfCriticism,
  setSelfCriticism,
  onComplete,
  onExit,
  isMuted,
}: {
  selfCriticism: SelfCriticism
  setSelfCriticism: (value: SelfCriticism) => void
  onComplete: () => void
  onExit: () => void
  isMuted: boolean
}) => {
  const { language } = useLanguage()
  const t = (key: ActionBoostTranslationKey) => actionboostTranslations[language][key]
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { playTypingOnce } = useInteractionSounds(isMuted)

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

  const fields = [
    { key: "appearance" as keyof SelfCriticism, label: t("selfcriticism_appearance"), icon: "👤" },
    { key: "job" as keyof SelfCriticism, label: t("selfcriticism_job"), icon: "💼" },
    { key: "pastFailure" as keyof SelfCriticism, label: t("selfcriticism_past_failure"), icon: "📉" },
    { key: "pastUnfair" as keyof SelfCriticism, label: t("selfcriticism_past_unfair"), icon: "😤" },
    { key: "pastHurt" as keyof SelfCriticism, label: t("selfcriticism_past_hurt"), icon: "💔" },
  ]

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in overflow-y-auto"
      style={{ background: "#fff8f0" }}>
      <div className="w-full max-w-2xl space-y-6 pb-20">
        {/* タイトル */}
        <div className="text-center py-4">
          <p className="text-xs tracking-widest text-orange-600 uppercase mb-2 opacity-80">Self Criticism</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            💭 {t("selfcriticism_title")}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{t("selfcriticism_subtitle")}</p>
        </div>

        {/* メリット説明カード */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 shadow-sm border border-purple-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-bold text-purple-800 mb-1">セルフコンパッションの効果</p>
              <p className="text-sm text-purple-700 leading-relaxed">
                自己批判を眺めることで、認識の歪みを小さくできます。歪みが小さくなると、心の重荷が軽くなり、行動を起こすエネルギーが生まれます。
              </p>
            </div>
          </div>
        </div>

        {/* 入力カード */}
        <div className="bg-white rounded-2xl p-7 shadow-md border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400" />

          <div className="space-y-5">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <span>{field.icon}</span> {field.label}
                </label>
                <Input
                  type="text"
                  value={selfCriticism[field.key]}
                  onChange={(e) => {
                    playTypingOnce(`selfcriticism_${field.key}`)
                    setSelfCriticism({ ...selfCriticism, [field.key]: e.target.value })
                  }}
                  placeholder={t("selfcriticism_placeholder")}
                  className="w-full border-2 border-orange-200 rounded-xl focus:border-orange-500 p-4"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ボタン */}
        <div className="text-center py-6 space-y-4">
          <button
            onClick={() => {
              playSound('/sound/nextpage.mp3')
              onComplete()
            }}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black px-12 py-4 rounded-full text-base tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            {t("next_button")} →
          </button>

          <div>
            <button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                onExit()
              }}
              className="text-gray-500 hover:text-gray-700 underline text-sm"
            >
              {t("exit_button")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 優しい言葉ページ（セルフコンパッション形式）
const KindWordsPage = ({
  selfCriticism,
  kindWords,
  setKindWords,
  onComplete,
  onExit,
  isMuted,
}: {
  selfCriticism: SelfCriticism
  kindWords: KindWords
  setKindWords: (value: KindWords) => void
  onComplete: () => void
  onExit: () => void
  isMuted: boolean
}) => {
  const { language } = useLanguage()
  const t = (key: ActionBoostTranslationKey) => actionboostTranslations[language][key]
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { playTypingOnce } = useInteractionSounds(isMuted)

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

  const fields = [
    { key: "appearance" as keyof KindWords, label: t("selfcriticism_appearance"), value: selfCriticism.appearance, icon: "👤", hint: "外見は変えられる部分もあるけど、あなたの価値は外見だけじゃない" },
    { key: "job" as keyof KindWords, label: t("selfcriticism_job"), value: selfCriticism.job, icon: "💼", hint: "仕事は人生の一部であって、全てではない" },
    { key: "pastFailure" as keyof KindWords, label: t("selfcriticism_past_failure"), value: selfCriticism.pastFailure, icon: "📉", hint: "失敗は成長の糧。その経験があるから今のあなたがいる" },
    { key: "pastUnfair" as keyof KindWords, label: t("selfcriticism_past_unfair"), value: selfCriticism.pastUnfair, icon: "😤", hint: "理不尽な経験をした自分を責める必要はない" },
    { key: "pastHurt" as keyof KindWords, label: t("selfcriticism_past_hurt"), value: selfCriticism.pastHurt, icon: "💔", hint: "傷ついた経験は辛かったね。自分を守ろうとした" },
  ]

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in overflow-y-auto"
      style={{ background: "#fff8f0" }}>
      <div className="w-full max-w-2xl space-y-4 pb-20">
        {/* タイトル */}
        <div className="text-center py-3">
          <p className="text-xs tracking-widest text-orange-600 uppercase mb-2 opacity-80">Self Compassion</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            💕 自分に優しい言葉をかけよう
          </h1>
        </div>

        {/* セルフコンパッションの説明 */}
        <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl p-4 shadow-sm border border-pink-200">
          <div className="space-y-2 text-sm text-gray-700">
            <p className="flex items-center gap-2"><span>1️⃣</span>自己批判を眺めてみましょう</p>
            <p className="flex items-center gap-2"><span>2️⃣</span>優しい言葉をかけると歪みが小さくなります</p>
            <p className="flex items-center gap-2"><span>3️⃣</span>歪みが小さくなると行動力が上がります</p>
          </div>
        </div>

        {/* 各項目カード（コンパクト版） */}
        {fields.map((field, index) => (
          <motion.div
            key={field.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden"
          >
            {/* 批判部分 */}
            <div className="bg-gray-50 p-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-lg">{field.icon}</span>
                <span className="text-xs font-bold text-gray-500">{field.label}</span>
              </div>
              {field.value ? (
                <p className="text-sm text-gray-700 mt-1 pl-7">「{field.value}」</p>
              ) : (
                <p className="text-xs text-gray-400 mt-1 pl-7 italic">（未入力）</p>
              )}
            </div>

            {/* 優しい言葉部分 */}
            <div className="p-3">
              <p className="text-xs text-pink-600 mb-2">💬 {field.hint}</p>
              <Input
                type="text"
                value={kindWords[field.key]}
                onChange={(e) => {
                  playTypingOnce(`kindwords_${field.key}`)
                  setKindWords({ ...kindWords, [field.key]: e.target.value })
                }}
                placeholder="優しい言葉を書いてみて..."
                className="w-full border border-orange-200 rounded-lg focus:border-orange-500 p-2 text-sm"
              />
            </div>
          </motion.div>
        ))}

        {/* ボタン */}
        <div className="text-center py-4 space-y-3">
          <button
            onClick={() => {
              playSound('/sound/nextpage.mp3')
              onComplete()
            }}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black px-10 py-3 rounded-full text-sm tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            {t("next_button")} →
          </button>

          <div>
            <button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                onExit()
              }}
              className="text-gray-500 hover:text-gray-700 underline text-xs"
            >
              {t("exit_button")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 架空の友人ページ（シンプル版）
const ImaginaryFriendPage = ({
  imaginaryFriendMessage,
  setImaginaryFriendMessage,
  onComplete,
  onExit,
  isMuted,
}: {
  imaginaryFriendMessage: ImaginaryFriendMessage
  setImaginaryFriendMessage: (value: ImaginaryFriendMessage) => void
  onComplete: () => void
  onExit: () => void
  isMuted: boolean
}) => {
  const { language } = useLanguage()
  const t = (key: ActionBoostTranslationKey) => actionboostTranslations[language][key]
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { playTypingOnce } = useInteractionSounds(isMuted)

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
    <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in overflow-y-auto"
      style={{ background: "#fff8f0" }}>
      <div className="w-full max-w-2xl space-y-5 pb-20">
        {/* タイトル */}
        <div className="text-center py-3">
          <p className="text-xs tracking-widest text-orange-600 uppercase mb-2 opacity-80">Encouragement</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            💌 応援メッセージを書こう
          </h1>
        </div>

        {/* メリット説明 */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 shadow-sm border border-blue-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-bold text-blue-800 mb-1">自己激励の効果</p>
              <p className="text-sm text-blue-700 leading-relaxed">
                自分を応援する言葉を書くことで、脳はその言葉を受け取ったように感じ、モチベーションが高まります。
              </p>
            </div>
          </div>
        </div>

        {/* メッセージ入力カード */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-5 shadow-md border border-orange-100"
        >
          <div className="mb-3">
            <p className="text-sm font-bold text-gray-700 mb-1">
              🧑‍🤝‍🧑 あなたの一番の味方だったら、何て言う？
            </p>
            <p className="text-xs text-gray-500">
              自分を励ます言葉を想像して書いてみましょう
            </p>
          </div>

          <textarea
            value={imaginaryFriendMessage.message}
            onChange={(e) => {
              playTypingOnce('imaginary_friend_message')
              setImaginaryFriendMessage({ message: e.target.value })
            }}
            placeholder="大丈夫、あなたならできる！今日も一緒に頑張ろう！"
            className="w-full border-2 border-orange-200 rounded-xl focus:border-orange-500 p-3 min-h-[100px] resize-none text-sm"
          />
        </motion.div>

        {/* ボタン */}
        <div className="text-center py-4 space-y-3">
          <button
            onClick={() => {
              playSound('/sound/nextpage.mp3')
              onComplete()
            }}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black px-10 py-3 rounded-full text-sm tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            {t("next_button")} →
          </button>

          <div>
            <button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                onExit()
              }}
              className="text-gray-500 hover:text-gray-700 underline text-xs"
            >
              {t("exit_button")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// どうしてワークページ（expose.tsxから移植）
const WhyWorkPage = ({
  whyAnswers,
  setWhyAnswers,
  strongestDesire,
  setStrongestDesire,
  totalPoints,
  setTotalPoints,
  onComplete,
  onExit,
  isMuted,
}: {
  whyAnswers: string[]
  setWhyAnswers: (value: string[]) => void
  strongestDesire: number | null
  setStrongestDesire: (value: number | null) => void
  totalPoints: number
  setTotalPoints: (value: number | ((prev: number) => number)) => void
  onComplete: () => void
  onExit: () => void
  isMuted: boolean
}) => {
  const { language } = useLanguage()
  const t = (key: ActionBoostTranslationKey) => actionboostTranslations[language][key]
  const [showConfetti, setShowConfetti] = useState(false)
  const [hasReceivedPoints, setHasReceivedPoints] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { playTypingOnce } = useInteractionSounds(isMuted)

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

  // 全回答欄が埋まっているかチェック
  const allFieldsFilled = whyAnswers.every(answer => answer.trim() !== '')

  // 全回答欄が埋まったタイミングで100ポイント付与（一度だけ）
  useEffect(() => {
    if (allFieldsFilled && !hasReceivedPoints) {
      setHasReceivedPoints(true)
      setTotalPoints((prev) => prev + 100)
      playSound('/sound/100pt.mp3')
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
    }
  }, [allFieldsFilled, hasReceivedPoints, setTotalPoints, playSound])

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in overflow-y-auto"
      style={{ background: "#fff8f0" }}>
      <ConfettiCanvas isActive={showConfetti} duration={2000} particleCount={80} points={100} />

      <div className="w-full max-w-2xl space-y-6 pb-20">
        {/* タイトルとポイント */}
        <div className="text-center py-4">
          <p className="text-xs tracking-widest text-orange-600 uppercase mb-2 opacity-80">Why Work</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            🔍 {t("why_work_title")}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{t("why_work_subtitle")}</p>
          <div className="text-orange-600 text-xl font-extrabold mt-2">🏆 {totalPoints}pt</div>
        </div>

        {/* メリット説明 */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 shadow-sm border border-yellow-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-bold text-yellow-800 mb-1">欲求を見つけるワークの効果</p>
              <p className="text-sm text-yellow-700 leading-relaxed">
                「なぜ？」を繰り返すことで、本当の欲求を発見できます。本当の欲求を知ると、行動の意味が明確になり、モチベーションが持続します。
              </p>
            </div>
          </div>
        </div>

        {/* カード: なぜを問うワーク */}
        <div className="bg-white rounded-2xl p-7 shadow-md border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400" />
          <h2 className="text-orange-600 text-base mb-3 flex items-center gap-2" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            <span>🔍</span> {t("why_work_title")}
            {allFieldsFilled && <span className="ml-auto text-green-500 text-sm font-bold">✓ 完了！ +100pt</span>}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {t("why_work_instruction")}
          </p>

          <div className="space-y-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <div key={index}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-600 font-bold text-sm">{index + 1}.</span>
                  {whyAnswers[index]?.trim() && <span className="text-green-500 text-xs">✓</span>}
                </div>
                <Input
                  type="text"
                  value={whyAnswers[index] || ''}
                  onChange={(e) => {
                    playTypingOnce(`why_${index}`)
                    const newAnswers = [...whyAnswers]
                    newAnswers[index] = e.target.value
                    setWhyAnswers(newAnswers)
                  }}
                  placeholder={index === 0 ? t("why_work_first_placeholder") : t("why_work_next_placeholder")}
                  className="w-full border-2 border-orange-200 rounded-xl focus:border-orange-500"
                />
                {index < 4 && (
                  <div className="flex flex-col items-center my-2">
                    <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span className="text-orange-600 text-xs font-bold">どうして？</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* カード: 強い欲求の選択 */}
        <div className="bg-white rounded-2xl p-7 shadow-md border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400" />
          <h2 className="text-orange-600 text-base mb-5 flex items-center gap-2" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            <span>⭐</span> 一番強い欲求を選択
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            上の1〜5番の中から、一番あなたの強い欲求として当てはまるものを選んでください。<br />
            <span className="text-orange-600 font-bold">この選択はゲーム中ずっと表示されます。</span>
          </p>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => setStrongestDesire(num)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                  strongestDesire === num
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-gray-50 text-gray-700 border-orange-100 hover:border-orange-500"
                }`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  strongestDesire === num ? "bg-white text-orange-600" : "bg-orange-100 text-orange-600"
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

        {/* ボタン */}
        <div className="text-center py-6 space-y-4">
          <button
            onClick={() => {
              playSound('/sound/nextpage.mp3')
              onComplete()
            }}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black px-12 py-4 rounded-full text-base tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            {t("next_button")} →
          </button>

          <div>
            <button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                onExit()
              }}
              className="text-gray-500 hover:text-gray-700 underline text-sm"
            >
              {t("exit_button")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// タスク達成ページ（タスクをやることでどう叶うのか）
const TaskFulfillmentPage = ({
  taskFulfillment,
  setTaskFulfillment,
  strongestDesire,
  whyAnswers,
  onComplete,
  onExit,
  isMuted,
}: {
  taskFulfillment: string
  setTaskFulfillment: (value: string) => void
  strongestDesire: number | null
  whyAnswers: string[]
  onComplete: () => void
  onExit: () => void
  isMuted: boolean
}) => {
  const { language } = useLanguage()
  const t = (key: ActionBoostTranslationKey) => actionboostTranslations[language][key]
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { playTypingOnce } = useInteractionSounds(isMuted)

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

  // 選択された強い欲求を取得
  const selectedDesire = strongestDesire ? whyAnswers[strongestDesire - 1] : null

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in overflow-y-auto"
      style={{ background: "#fff8f0" }}>
      <div className="w-full max-w-2xl space-y-6 pb-20">
        {/* タイトル */}
        <div className="text-center py-4">
          <p className="text-xs tracking-widest text-orange-600 uppercase mb-2 opacity-80">Task Fulfillment</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            ✨ {t("task_fulfillment_title")}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{t("task_fulfillment_subtitle")}</p>
        </div>

        {/* メリット説明 */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-4 shadow-sm border border-amber-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-bold text-amber-800 mb-1">目的と行動を結びつける効果</p>
              <p className="text-sm text-amber-700 leading-relaxed">
                タスクを「やらなければならないこと」から「欲求を叶える手段」に変換することで、自然と行動できるようになります。
              </p>
            </div>
          </div>
        </div>

        {/* 選択された欲求の表示 */}
        {selectedDesire && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 shadow-lg"
          >
            <div className="text-center">
              <p className="text-white/80 text-sm mb-2">あなたの一番強い欲求</p>
              <p className="text-white text-xl font-bold">「{selectedDesire}」</p>
            </div>
          </motion.div>
        )}

        {/* メインカード */}
        <div className="bg-white rounded-2xl p-7 shadow-md border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400" />

          <h2 className="text-orange-600 text-base mb-4 flex items-center gap-2" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            <span>🎯</span> {t("task_fulfillment_question")}
          </h2>

          <p className="text-sm text-gray-500 mb-4">
            💡 {t("task_fulfillment_hint")}
          </p>

          <textarea
            value={taskFulfillment}
            onChange={(e) => {
              playTypingOnce('task_fulfillment')
              setTaskFulfillment(e.target.value)
            }}
            placeholder={t("task_fulfillment_placeholder")}
            className="w-full border-2 border-orange-200 rounded-xl focus:border-orange-500 p-4 min-h-[150px] resize-none"
          />
        </div>

        {/* ボタン */}
        <div className="text-center py-6 space-y-4">
          <button
            onClick={() => {
              playSound('/sound/nextpage.mp3')
              onComplete()
            }}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black px-12 py-4 rounded-full text-base tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            {t("next_button")} →
          </button>

          <div>
            <button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                onExit()
              }}
              className="text-gray-500 hover:text-gray-700 underline text-sm"
            >
              {t("exit_button")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// タスク入力ページ
const TaskInputPage = ({
  taskInputs,
  setTaskInputs,
  onComplete,
  onExit,
  isMuted,
}: {
  taskInputs: TaskInputs
  setTaskInputs: (value: TaskInputs) => void
  onComplete: () => void
  onExit: () => void
  isMuted: boolean
}) => {
  const { language } = useLanguage()
  const t = (key: ActionBoostTranslationKey) => actionboostTranslations[language][key]
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { playTypingOnce } = useInteractionSounds(isMuted)

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
    <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in overflow-y-auto"
      style={{ background: "#fff8f0" }}>
      <div className="w-full max-w-2xl space-y-6 pb-20">
        {/* タイトル */}
        <div className="text-center py-4">
          <p className="text-xs tracking-widest text-orange-600 uppercase mb-2 opacity-80">Task Preparation</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            📝 {t("task_title")}
          </h1>
        </div>

        {/* メリット説明 */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 shadow-sm border border-indigo-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-bold text-indigo-800 mb-1">タスク準備の効果</p>
              <p className="text-sm text-indigo-700 leading-relaxed">
                事前に考えることで、タスクの解像度が上がり、実行しやすくなります。成功のイメージを持つと、脳がその方向に動きやすくなります。
              </p>
            </div>
          </div>
        </div>

        {/* 今日のタスクの楽しみ */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400" />
          <label className="block text-sm font-bold text-gray-700 mb-2">
            🎉 {t("task_enjoyable")}
          </label>
          <textarea
            value={taskInputs.enjoyable}
            onChange={(e) => {
              playTypingOnce('task_enjoyable')
              setTaskInputs({ ...taskInputs, enjoyable: e.target.value })
            }}
            placeholder="タスクの中で楽しみな部分を書いてみて..."
            className="w-full border-2 border-orange-200 rounded-xl focus:border-orange-500 p-4 min-h-[80px] resize-none"
          />
        </div>

        {/* 過去の失敗 */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400" />
          <label className="block text-sm font-bold text-gray-700 mb-2">
            📉 {t("task_past_failure")}
          </label>
          <textarea
            value={taskInputs.pastFailure}
            onChange={(e) => {
              playTypingOnce('task_past_failure')
              setTaskInputs({ ...taskInputs, pastFailure: e.target.value })
            }}
            placeholder="過去の失敗から学んだことを書いてみて..."
            className="w-full border-2 border-orange-200 rounded-xl focus:border-orange-500 p-4 min-h-[80px] resize-none"
          />
        </div>

        {/* しないこと */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400" />
          <label className="block text-sm font-bold text-gray-700 mb-2">
            🚫 {t("task_avoid")}
          </label>
          <textarea
            value={taskInputs.avoid}
            onChange={(e) => {
              playTypingOnce('task_avoid')
              setTaskInputs({ ...taskInputs, avoid: e.target.value })
            }}
            placeholder="今日は避けることを書いてみて..."
            className="w-full border-2 border-orange-200 rounded-xl focus:border-orange-500 p-4 min-h-[80px] resize-none"
          />
        </div>

        {/* 過去にうまくいったこと */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400" />
          <label className="block text-sm font-bold text-gray-700 mb-2">
            ✨ {t("task_past_success")}
          </label>
          <textarea
            value={taskInputs.pastSuccess}
            onChange={(e) => {
              playTypingOnce('task_past_success')
              setTaskInputs({ ...taskInputs, pastSuccess: e.target.value })
            }}
            placeholder="うまくいった経験を思い出して..."
            className="w-full border-2 border-orange-200 rounded-xl focus:border-orange-500 p-4 min-h-[80px] resize-none"
          />
        </div>

        {/* 予想外の成功 */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400" />
          <label className="block text-sm font-bold text-gray-700 mb-2">
            🎯 {t("task_unexpected")}
          </label>
          <textarea
            value={taskInputs.unexpected}
            onChange={(e) => {
              playTypingOnce('task_unexpected')
              setTaskInputs({ ...taskInputs, unexpected: e.target.value })
            }}
            placeholder="予想外にうまくいったことを書いてみて..."
            className="w-full border-2 border-orange-200 rounded-xl focus:border-orange-500 p-4 min-h-[80px] resize-none"
          />
        </div>

        {/* 成功する理由3つ */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400" />
          <label className="block text-sm font-bold text-gray-700 mb-4">
            🏆 {t("task_success_reasons")}
          </label>
          <div className="space-y-3">
            {[0, 1, 2].map((index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <Input
                  type="text"
                  value={taskInputs.successReasons[index] || ''}
                  onChange={(e) => {
                    playTypingOnce(`task_reason_${index}`)
                    const newReasons = [...taskInputs.successReasons]
                    newReasons[index] = e.target.value
                    setTaskInputs({ ...taskInputs, successReasons: newReasons })
                  }}
                  placeholder={`${t("task_reason_placeholder")} ${index + 1}`}
                  className="flex-1 border-2 border-orange-200 rounded-xl focus:border-orange-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ボタン */}
        <div className="text-center py-6 space-y-4">
          <button
            onClick={() => {
              playSound('/sound/nextpage.mp3')
              onComplete()
            }}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black px-12 py-4 rounded-full text-base tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            {t("next_button")} →
          </button>

          <div>
            <button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                onExit()
              }}
              className="text-gray-500 hover:text-gray-700 underline text-sm"
            >
              {t("exit_button")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 目標設定ページ
const GoalsPage = ({
  goals,
  setGoals,
  onComplete,
  onExit,
  isMuted,
}: {
  goals: Goals
  setGoals: (value: Goals) => void
  onComplete: () => void
  onExit: () => void
  isMuted: boolean
}) => {
  const { language } = useLanguage()
  const t = (key: ActionBoostTranslationKey) => actionboostTranslations[language][key]
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { playTypingOnce } = useInteractionSounds(isMuted)

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
    <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in overflow-y-auto"
      style={{ background: "#fff8f0" }}>
      <div className="w-full max-w-2xl space-y-6 pb-20">
        {/* タイトル */}
        <div className="text-center py-4">
          <p className="text-xs tracking-widest text-orange-600 uppercase mb-2 opacity-80">Goals Setting</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            🎯 目標を思い浮かべよう
          </h1>
          <p className="text-gray-500 text-sm mt-1">未来への道筋を明確にしましょう</p>
        </div>

        {/* メリット説明 */}
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-4 shadow-sm border border-rose-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-bold text-rose-800 mb-1">目標設定の効果</p>
              <p className="text-sm text-rose-700 leading-relaxed">
                目標を具体的にイメージすることで、脳はその方向に進む準備を始めます。ギャップを明確にすると、何をすべきかが見えてきます。
              </p>
            </div>
          </div>
        </div>

        {/* 長期の目標 */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400" />
          <label className="block text-sm font-bold text-gray-700 mb-2">
            🌟 長期の目標を思い浮かべて
          </label>
          <p className="text-xs text-gray-500 mb-3">5年後、10年後にどうなっていたいですか？</p>
          <textarea
            value={goals.longTerm}
            onChange={(e) => {
              playTypingOnce('goals_longterm')
              setGoals({ ...goals, longTerm: e.target.value })
            }}
            placeholder="例：自分のビジネスを持って経済的自由を手に入れたい"
            className="w-full border-2 border-orange-200 rounded-xl focus:border-orange-500 p-4 min-h-[80px] resize-none"
          />
        </div>

        {/* 中期の目標 */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400" />
          <label className="block text-sm font-bold text-gray-700 mb-2">
            📅 中期の目標を思い浮かべて
          </label>
          <p className="text-xs text-gray-500 mb-3">1年後〜3年後にどうなっていたいですか？</p>
          <textarea
            value={goals.midTerm}
            onChange={(e) => {
              playTypingOnce('goals_midterm')
              setGoals({ ...goals, midTerm: e.target.value })
            }}
            placeholder="例：副業で月10万円の収入を得る"
            className="w-full border-2 border-orange-200 rounded-xl focus:border-orange-500 p-4 min-h-[80px] resize-none"
          />
        </div>

        {/* 短期の目標 */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400" />
          <label className="block text-sm font-bold text-gray-700 mb-2">
            ⚡ 短期の目標を思い浮かべて
          </label>
          <p className="text-xs text-gray-500 mb-3">今月、今週、今日は何を達成したいですか？</p>
          <textarea
            value={goals.shortTerm}
            onChange={(e) => {
              playTypingOnce('goals_shortterm')
              setGoals({ ...goals, shortTerm: e.target.value })
            }}
            placeholder="例：今週中にプログラミングの基礎を学ぶ"
            className="w-full border-2 border-orange-200 rounded-xl focus:border-orange-500 p-4 min-h-[80px] resize-none"
          />
        </div>

        {/* 獲得したい状況 */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400" />
          <label className="block text-sm font-bold text-gray-700 mb-2">
            🎯 獲得したい状況は何ですか？
          </label>
          <p className="text-xs text-gray-500 mb-3">目標を達成した時、どんな状況にいたいですか？</p>
          <textarea
            value={goals.desiredSituation}
            onChange={(e) => {
              playTypingOnce('goals_situation')
              setGoals({ ...goals, desiredSituation: e.target.value })
            }}
            placeholder="例：毎日自由な時間があり、好きなことに没頭できる生活"
            className="w-full border-2 border-orange-200 rounded-xl focus:border-orange-500 p-4 min-h-[80px] resize-none"
          />
        </div>

        {/* 今あるギャップ3つ */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400" />
          <label className="block text-sm font-bold text-gray-700 mb-2">
            🔍 あなたに今あるギャップを三つ見つけて
          </label>
          <p className="text-xs text-gray-500 mb-4">理想と現実の間にある障壁は何ですか？</p>
          <div className="space-y-3">
            {[0, 1, 2].map((index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <Input
                  type="text"
                  value={goals.gaps[index] || ''}
                  onChange={(e) => {
                    playTypingOnce(`goals_gap_${index}`)
                    const newGaps = [...goals.gaps]
                    newGaps[index] = e.target.value
                    setGoals({ ...goals, gaps: newGaps })
                  }}
                  placeholder={`ギャップ ${index + 1}`}
                  className="flex-1 border-2 border-orange-200 rounded-xl focus:border-orange-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* より早くたどり着く方法 */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400" />
          <label className="block text-sm font-bold text-gray-700 mb-2">
            🚀 あなたがその未来により早くたどり着く方法を教えて
          </label>
          <p className="text-xs text-gray-500 mb-3">ギャップを埋めるために、今すぐできることは？</p>
          <textarea
            value={goals.fasterMethods}
            onChange={(e) => {
              playTypingOnce('goals_faster')
              setGoals({ ...goals, fasterMethods: e.target.value })
            }}
            placeholder="例：毎日30分学習時間を確保する、メンターを見つける、行動を小さく分割する"
            className="w-full border-2 border-orange-200 rounded-xl focus:border-orange-500 p-4 min-h-[100px] resize-none"
          />
        </div>

        {/* ボタン */}
        <div className="text-center py-6 space-y-4">
          <button
            onClick={() => {
              playSound('/sound/nextpage.mp3')
              onComplete()
            }}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black px-12 py-4 rounded-full text-base tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            {t("next_button")} →
          </button>

          <div>
            <button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                onExit()
              }}
              className="text-gray-500 hover:text-gray-700 underline text-sm"
            >
              {t("exit_button")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// タスクの苦しみ想像ページ
const ImagineTaskPainPage = ({
  onComplete,
  onExit,
  isMuted,
}: {
  onComplete: () => void
  onExit: () => void
  isMuted: boolean
}) => {
  const { language } = useLanguage()
  const t = (key: ActionBoostTranslationKey) => actionboostTranslations[language][key]
  const [timeLeft, setTimeLeft] = useState(30)
  const [isTimerComplete, setIsTimerComplete] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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

  // 30秒タイマー
  useEffect(() => {
    if (timeLeft > 0 && !isTimerComplete) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isTimerComplete) {
      setIsTimerComplete(true)
      setShowConfetti(true)
      playSound('/sound/100pt.mp3')
      setTimeout(() => setShowConfetti(false), 2000)
    }
  }, [timeLeft, isTimerComplete, playSound])

  // 時間のフォーマット
  const formatTime = (seconds: number): string => {
    return `0:${seconds.toString().padStart(2, '0')}`
  }

  // プログレスの計算
  const getProgressPercentage = (): number => {
    return ((30 - timeLeft) / 30) * 100
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in overflow-y-auto"
      style={{ background: "#fff8f0" }}>
      <ConfettiCanvas isActive={showConfetti} duration={2000} particleCount={50} />

      <div className="w-full max-w-2xl space-y-6 pb-20">
        {/* タイトル */}
        <div className="text-center py-4">
          <p className="text-xs tracking-widest text-orange-600 uppercase mb-2 opacity-80">Imagination Exposure</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            🧘 {t("imagine_pain_title")}
          </h1>
        </div>

        {/* メイン指示 */}
        <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-2xl p-6 shadow-xl border-4 border-white">
          <p className="text-center text-white text-xl md:text-2xl font-black leading-relaxed" style={{ fontFamily: "'Kosugi Maru', sans-serif", textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            🔥 {t("imagine_pain_subtitle")} 🔥
          </p>
        </div>

        {/* 想像の指示カード */}
        <div className="bg-white rounded-2xl p-7 shadow-md border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400" />
          <h2 className="text-orange-600 text-base mb-4 flex items-center gap-2" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            <span>🧘</span> {t("imagine_pain_instruction")}
          </h2>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <span className="text-xl">👁️</span>
              <p className="text-sm text-gray-700">
                <span className="font-bold text-orange-700">{t("imagine_pain_instruction")}</span><br />
                タスクを始める時の不快感、タスク中の苦しみを鮮明に思い浮かべてください。
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-xl">💪</span>
              <p className="text-sm text-gray-700">
                <span className="font-bold text-orange-700">{t("imagine_pain_tip")}</span>
              </p>
            </div>
          </div>
        </div>

        {/* タイマー */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-orange-100">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-base font-bold text-gray-700">{t("imagine_pain_timer")}</span>
            <h2 className="text-3xl font-bold text-orange-900">{formatTime(timeLeft)}</h2>
          </div>
          <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          {isTimerComplete && (
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mt-3 text-lg font-bold text-green-600"
            >
              ✅ {t("imagine_pain_complete")}
            </motion.p>
          )}
        </div>

        {/* ボタン */}
        <div className="text-center py-6 space-y-4">
          <button
            onClick={() => {
              playSound('/sound/nextpage.mp3')
              onComplete()
            }}
            disabled={!isTimerComplete}
            className={`bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black px-12 py-4 rounded-full text-base tracking-wide shadow-lg transition-all ${
              isTimerComplete
                ? "hover:shadow-xl hover:-translate-y-0.5"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            {t("next_button")} →
          </button>

          <div>
            <button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                onExit()
              }}
              className="text-gray-500 hover:text-gray-700 underline text-sm"
            >
              {t("exit_button")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// いってらっしゃいページ
const FarewellPage = ({
  onComplete,
  isMuted,
}: {
  onComplete: () => void
  isMuted: boolean
}) => {
  const { language } = useLanguage()
  const t = (key: ActionBoostTranslationKey) => actionboostTranslations[language][key]
  const [showConfetti, setShowConfetti] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in"
      style={{ background: "linear-gradient(135deg, #ff9a56 0%, #ffcd56 50%, #ff6b6b 100%)" }}>
      <ConfettiCanvas isActive={showConfetti} duration={3000} particleCount={100} />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-lg"
      >
        <div className="text-7xl animate-bounce">🏆</div>

        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
          {t("farewell_title")}
        </h1>

        <p className="text-xl text-white/90">
          {t("farewell_message")}
        </p>

        {/* 成功イメージの促し */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30"
        >
          <p className="text-lg text-white font-bold mb-2">✨ 最後のワーク ✨</p>
          <p className="text-white/95 text-base leading-relaxed">
            あなたが<span className="font-bold text-yellow-200">成功した瞬間</span>を想像してください。
          </p>
          <p className="text-white/80 text-sm mt-2">
            タスクを終えた時の達成感、周りからの称賛、自分への誇り...
            その瞬間を今、心に描いてみましょう。
          </p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playSound('/sound/nextpage.mp3')
            onComplete()
          }}
          className="bg-white text-orange-600 font-black px-12 py-4 rounded-full text-xl shadow-2xl hover:shadow-xl transition-all"
        >
          {t("next_button")} →
        </motion.button>
      </motion.div>
    </div>
  )
}

// アフィリエイトページ
const AffiliatePage = ({
  onExit,
  onRetry,
}: {
  onExit: () => void
  onRetry: () => void
}) => {
  const { language } = useLanguage()
  const t = (key: ActionBoostTranslationKey) => actionboostTranslations[language][key]
  const router = useRouter()
  const [affiliateTextPattern] = useState(() =>
    affiliateTextPatterns[Math.floor(Math.random() * affiliateTextPatterns.length)]
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in overflow-y-auto"
      style={{ background: "#fff8f0" }}>
      <div className="w-full max-w-2xl space-y-6 pb-20">
        {/* タイトル */}
        <div className="text-center py-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            🎉 {t("result_title")}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {t("result_message")}
          </p>
        </div>

        {/* アフィリエイトコンポーネント */}
        <AffiliateComponent affiliateTextPattern={affiliateTextPattern} />

        {/* ボタン */}
        <div className="text-center py-6 space-y-4">
          {/* もう一度チャレンジボタン */}
          <button
            onClick={onRetry}
            className="border-2 border-orange-500 text-orange-600 font-bold px-8 py-3 rounded-full hover:bg-orange-500 hover:text-white transition-all mr-4"
          >
            🔄 {t("result_restart")}
          </button>

          {/* ホームに戻るボタン */}
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black px-12 py-4 rounded-full text-base tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            {t("result_home")}
          </button>
        </div>
      </div>
    </div>
  )
}

// メインゲームコンポーネント
export function ActionBoostGame() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<
    'loading' | 'intro' | 'gratitude' | 'selfCriticism' | 'kindWords' | 'imaginaryFriend' | 'whyWork' | 'taskFulfillment' | 'taskInput' | 'goals' | 'imaginePain' | 'farewell' | 'affiliate'
  >('loading')
  const [isMuted, setIsMuted] = useState(false)

  // 感謝データ
  const [gratitude, setGratitude] = useState<Gratitude>({
    first: '',
    second: '',
    third: '',
  })

  // 自己批判データ
  const [selfCriticism, setSelfCriticism] = useState<SelfCriticism>({
    appearance: '',
    job: '',
    pastFailure: '',
    pastUnfair: '',
    pastHurt: '',
  })

  // 優しい言葉データ
  const [kindWords, setKindWords] = useState<KindWords>({
    appearance: '',
    job: '',
    pastFailure: '',
    pastUnfair: '',
    pastHurt: '',
  })

  // タスク入力データ
  const [taskInputs, setTaskInputs] = useState<TaskInputs>({
    enjoyable: '',
    pastFailure: '',
    avoid: '',
    pastSuccess: '',
    unexpected: '',
    successReasons: ['', '', ''],
  })

  // 架空の友人からのメッセージデータ
  const [imaginaryFriendMessage, setImaginaryFriendMessage] = useState<ImaginaryFriendMessage>({
    message: '',
  })

  // どうしてワーク用データ
  const [whyAnswers, setWhyAnswers] = useState<string[]>(["", "", "", "", ""])
  const [strongestDesire, setStrongestDesire] = useState<number | null>(null)
  const [totalPoints, setTotalPoints] = useState(0)

  // タスク達成データ
  const [taskFulfillment, setTaskFulfillment] = useState('')

  // 目標データ
  const [goals, setGoals] = useState<Goals>({
    longTerm: '',
    midTerm: '',
    shortTerm: '',
    desiredSituation: '',
    gaps: ['', '', ''],
    fasterMethods: '',
  })

  const handleExit = () => {
    router.push('/')
  }

  // ゲームリセット（もう一度チャレンジ）
  const handleRetry = () => {
    setGratitude({ first: '', second: '', third: '' })
    setSelfCriticism({ appearance: '', job: '', pastFailure: '', pastUnfair: '', pastHurt: '' })
    setKindWords({ appearance: '', job: '', pastFailure: '', pastUnfair: '', pastHurt: '' })
    setTaskInputs({ enjoyable: '', pastFailure: '', avoid: '', pastSuccess: '', unexpected: '', successReasons: ['', '', ''] })
    setImaginaryFriendMessage({ message: '' })
    setWhyAnswers(["", "", "", "", ""])
    setStrongestDesire(null)
    setTotalPoints(0)
    setTaskFulfillment('')
    setGoals({ longTerm: '', midTerm: '', shortTerm: '', desiredSituation: '', gaps: ['', '', ''], fasterMethods: '' })
    setCurrentPage('intro')
  }

  return (
    <div className="relative w-full min-h-screen">
      {currentPage === 'loading' && (
        <LoadingPage onLoadComplete={() => setCurrentPage('intro')} />
      )}

      {currentPage === 'intro' && (
        <IntroPage
          onStart={() => setCurrentPage('gratitude')}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
        />
      )}

      {currentPage === 'gratitude' && (
        <GratitudeInputPage
          gratitude={gratitude}
          setGratitude={setGratitude}
          onComplete={() => setCurrentPage('selfCriticism')}
          onExit={handleExit}
          isMuted={isMuted}
        />
      )}

      {currentPage === 'selfCriticism' && (
        <SelfCriticismInputPage
          selfCriticism={selfCriticism}
          setSelfCriticism={setSelfCriticism}
          onComplete={() => setCurrentPage('kindWords')}
          onExit={handleExit}
          isMuted={isMuted}
        />
      )}

      {currentPage === 'kindWords' && (
        <KindWordsPage
          selfCriticism={selfCriticism}
          kindWords={kindWords}
          setKindWords={setKindWords}
          onComplete={() => setCurrentPage('imaginaryFriend')}
          onExit={handleExit}
          isMuted={isMuted}
        />
      )}

      {currentPage === 'imaginaryFriend' && (
        <ImaginaryFriendPage
          imaginaryFriendMessage={imaginaryFriendMessage}
          setImaginaryFriendMessage={setImaginaryFriendMessage}
          onComplete={() => setCurrentPage('whyWork')}
          onExit={handleExit}
          isMuted={isMuted}
        />
      )}

      {currentPage === 'whyWork' && (
        <WhyWorkPage
          whyAnswers={whyAnswers}
          setWhyAnswers={setWhyAnswers}
          strongestDesire={strongestDesire}
          setStrongestDesire={setStrongestDesire}
          totalPoints={totalPoints}
          setTotalPoints={setTotalPoints}
          onComplete={() => setCurrentPage('taskFulfillment')}
          onExit={handleExit}
          isMuted={isMuted}
        />
      )}

      {currentPage === 'taskFulfillment' && (
        <TaskFulfillmentPage
          taskFulfillment={taskFulfillment}
          setTaskFulfillment={setTaskFulfillment}
          strongestDesire={strongestDesire}
          whyAnswers={whyAnswers}
          onComplete={() => setCurrentPage('taskInput')}
          onExit={handleExit}
          isMuted={isMuted}
        />
      )}

      {currentPage === 'taskInput' && (
        <TaskInputPage
          taskInputs={taskInputs}
          setTaskInputs={setTaskInputs}
          onComplete={() => setCurrentPage('goals')}
          onExit={handleExit}
          isMuted={isMuted}
        />
      )}

      {currentPage === 'goals' && (
        <GoalsPage
          goals={goals}
          setGoals={setGoals}
          onComplete={() => setCurrentPage('imaginePain')}
          onExit={handleExit}
          isMuted={isMuted}
        />
      )}

      {currentPage === 'imaginePain' && (
        <ImagineTaskPainPage
          onComplete={() => setCurrentPage('farewell')}
          onExit={handleExit}
          isMuted={isMuted}
        />
      )}

      {currentPage === 'farewell' && (
        <FarewellPage
          onComplete={() => setCurrentPage('affiliate')}
          isMuted={isMuted}
        />
      )}

      {currentPage === 'affiliate' && (
        <AffiliatePage onExit={handleExit} onRetry={handleRetry} />
      )}
    </div>
  )
}
