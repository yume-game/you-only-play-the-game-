"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import ConfettiCanvas from "@/components/animations/ConfettiCanvas"
import DarkAnimationCanvas from "@/components/animations/DarkAnimationCanvas"
import ButtonAnimationCanvas from "@/components/animations/ButtonAnimationCanvas"
import TransitionCanvas from "@/components/animations/TransitionCanvas"
import { useLanguage } from "@/contexts/LanguageContext"
import { thanksTranslations, type ThanksTranslationKey } from "@/locales/thanks-translations"
import { TermsOfService } from "@/components/terms-of-service/terms-of-service"


// デバイス判定のカスタムフック
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)

    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  return isMobile
}

type Quiz = {
  question: string
  画像: {
    PC: string[] // PC用の背景画像
    スマホ: string[] // スマホ用の背景画像
  }
}

// 行動プランの型定義（anyを使わない）
type ActionPlan = {
  when: string        // いつ？
  action: string      // どんな行動？
  motivation: string  // なぜ？
}

const quizzes: Quiz[] = [
  {
    question: "人生のすべてにおいて、感謝していることを書いてください",
    画像: {
      PC: ["/image/art39.png"],
      スマホ: ["/image/art39.png"],
    },
  },
  {
    question: "人生のすべてにおいて、感謝していることを書いてください",
    画像: {
      PC: ["/image/art39.png"],
      スマホ: ["/image/art39.png"],
    },
  },
  {
    question: "人生のすべてにおいて、感謝していることを書いてください",
    画像: {
      PC: ["/image/art39.png"],
      スマホ: ["/image/art39.png"],
    },
  },
  {
    question: "人生のすべてにおいて、感謝していることを書いてください",
    画像: {
      PC: ["/image/art39.png"],
      スマホ: ["/image/art39.png"],
    },
  },
  {
    question: "人生のすべてにおいて、感謝していることを書いてください",
    画像: {
      PC: ["/image/art39.png"],
      スマホ: ["/image/art39.png"],
    },
  },
  {
    question: "人生のすべてにおいて、感謝していることを書いてください",
    画像: {
      PC: ["/image/art39.png"],
      スマホ: ["/image/art39.png"],
    },
  },
  {
    question: "人生のすべてにおいて、感謝していることを書いてください",
    画像: {
      PC: ["/image/art39.png"],
      スマホ: ["/image/art39.png"],
    },
  },
  {
    question: "人生のすべてにおいて、感謝していることを書いてください",
    画像: {
      PC: ["/image/art39.png"],
      スマホ: ["/image/art39.png"],
    },
  },
  {
    question: "人生のすべてにおいて、感謝していることを書いてください",
    画像: {
      PC: ["/image/art39.png"],
      スマホ: ["/image/art39.png"],
    },
  },
  {
    question: "人生のすべてにおいて、感謝していることを書いてください",
    画像: {
      PC: ["/image/art39.png"],
      スマホ: ["/image/art39.png"],
    },
  },
  {
    question: "人生のすべてにおいて、感謝していることを書いてください",
    画像: {
      PC: ["/image/art39.png"],
      スマホ: ["/image/art39.png"],
    },
  },
  {
    question: "人生のすべてにおいて、感謝していることを書いてください",
    画像: {
      PC: ["/image/art39.png"],
      スマホ: ["/image/art39.png"],
    },
  },
  {
    question: "人生のすべてにおいて、感謝していることを書いてください",
    画像: {
      PC: ["/image/art39.png"],
      スマホ: ["/image/art39.png"],
    },
  },
  {
    question: "人生のすべてにおいて、感謝していることを書いてください",
    画像: {
      PC: ["/image/art39.png"],
      スマホ: ["/image/art39.png"],
    },
  },
  {
    question: "人生のすべてにおいて、感謝していることを書いてください",
    画像: {
      PC: ["/image/art39.png"],
      スマホ: ["/image/art39.png"],
    },
  },
  {
    question: "人生のすべてにおいて、感謝していることを書いてください",
    画像: {
      PC: ["/image/art39.png"],
      スマホ: ["/image/art39.png"],
    },
  },
  {
    question: "人生のすべてにおいて、感謝していることを書いてください",
    画像: {
      PC: ["/image/art39.png"],
      スマホ: ["/image/art39.png"],
    },
  },
  {
    question: "人生のすべてにおいて、感謝していることを書いてください",
    画像: {
      PC: ["/image/art39.png"],
      スマホ: ["/image/art39.png"],
    },
  },
  {
    question: "人生のすべてにおいて、感謝していることを書いてください",
    画像: {
      PC: ["/image/art39.png"],
      スマホ: ["/image/art39.png"],
    },
  },
  {
    question: "人生のすべてにおいて、感謝していることを書いてください",
    画像: {
      PC: ["/image/art39.png"],
      スマホ: ["/image/art39.png"],
    },
  },
]


// 3の倍数かどうかを判定する関数
const isGoldenQuestion = (questionNumber: number) => {
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

// 初期読み込み用画像URLを取得する関数 - 最初の5個のみ
const getInitialImageUrls = (isMobile: boolean): string[] => {
  const imageUrls: string[] = []

  if (isMobile) {
    // スマホ用背景画像（1-5）のみ初期読み込み
    for (let i = 1; i <= 5; i++) {
      imageUrls.push(`/image/mobile/background-${i}.png`)
    }
  } else {
    // PC用背景画像（1-5）のみ初期読み込み
    for (let i = 1; i <= 5; i++) {
      imageUrls.push(`/image/pc/background-${i}.png`)
    }
  }

  return imageUrls
}

// 画像プリロード用のコンポーネント
const ImagePreloader = ({ images, onComplete }: { images: string[]; onComplete: () => void }) => {
  const [loadedCount, setLoadedCount] = useState(0)
  const [totalCount] = useState(images.length)

  useEffect(() => {
    let loadedImages = 0
    const imagePromises = images.map((src) => {
      return new Promise<void>((resolve) => {
        const img = new window.Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          loadedImages++
          setLoadedCount(loadedImages)
          resolve()
        }
        img.onerror = () => {
          loadedImages++
          setLoadedCount(loadedImages)
          resolve() // エラーでも続行
        }
        img.src = src
      })
    })

    Promise.all(imagePromises).then(() => {
      onComplete()
    })
  }, [images, onComplete])

  return (
    <div className="text-center space-y-4">
      <div className="text-white text-lg">ゲームを読み込み中...</div>
      <div className="w-64 bg-green-800 rounded-full h-4 mx-auto">
        <div
          className="bg-green-400 h-4 rounded-full transition-all duration-300"
          style={{ width: `${(loadedCount / totalCount) * 100}%` }}
        />
      </div>
      <div className="text-white text-sm">
        {loadedCount} / {totalCount}
      </div>
    </div>
  )
}

const AffiliateComponent = ({ className = "", affiliateTextPattern, onAffiliateClick }: { className?: string; affiliateTextPattern?: { headline: string; description: string }; onAffiliateClick?: () => void }) => {
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

const IntroPage = ({ onStart, isMuted, setIsMuted }: { onStart: () => void; isMuted: boolean; setIsMuted: (value: boolean) => void }) => {
  const { language } = useLanguage()
  const t = (key: ThanksTranslationKey) => thanksTranslations[language][key]
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [allImages, setAllImages] = useState<string[]>([])
  const [isTermsOpen, setIsTermsOpen] = useState(false)

  // ページマウント時に上までスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // デバイス判定とそれに応じた画像URLの設定
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setAllImages(getInitialImageUrls(mobile))
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)

    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  const handleImagesLoaded = useCallback(() => {
    setImagesLoaded(true)
  }, [])

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center animate-fade-in">
      <TermsOfService isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/background-bright-forest-road.png"
          alt="心の状態"
          fill
          className="object-cover object-top"
          priority
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent && !parent.querySelector('.image-fallback')) {
              const fallback = document.createElement('div')
              fallback.className = 'image-fallback absolute inset-0 flex items-center justify-center'
              fallback.innerHTML = '<div class="w-32 h-32 rounded-full bg-green-400"></div>'
              parent.appendChild(fallback)
            }
          }}
        />
      </div>

      <div className="relative z-10 text-center space-y-6 bg-green-700 bg-opacity-70 p-8 rounded-lg max-w-2xl">
        <h1 className="text-4xl font-bold text-white">{t("intro_title")}</h1>
        <p className="text-lg text-white">
          {t("intro_subtitle")}
          {t("intro_description")}
        </p>
        <p className="text-base text-yellow-200 font-semibold">
          {t("intro_privacy")}
        </p>

        {/* 消音モードボタン */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
              isMuted
                ? "bg-gray-500 hover:bg-gray-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white font-medium`}
          >
            <span className="text-xl">{isMuted ? "🔇" : "🔊"}</span>
            <span>{isMuted ? (language === "ja" ? "消音モード中" : "Muted") : (language === "ja" ? "消音モードを選択" : "Select Mute Mode")}</span>
          </button>
        </div>

        {!imagesLoaded && allImages.length > 0 ? (
          <ImagePreloader images={allImages} onComplete={handleImagesLoaded} />
        ) : allImages.length === 0 ? (
          <div className="text-white text-lg">{t("intro_checking_device")}</div>
        ) : (
          <>
            {/* 注意書き */}
            <p className="text-red-300 text-sm text-center mb-4">
              重度のトラウマなどお持ちの方は私のゲームではなく、精神科医にかかる事を推奨いたします
            </p>

            <div className="space-y-4">
              <p className="text-white/70 text-sm text-center">
                スタートボタンをおすと、<button type="button" onClick={() => setIsTermsOpen(true)} className="text-green-300 underline hover:text-green-200 font-medium">利用規約</button>に同意したことになります。
              </p>

              <Button
                onClick={onStart}
                className="bg-gradient-to-r from-green-500 to-green-700 hover:opacity-90 transition-opacity px-8 py-4 text-xl text-white"
              >
                {t("intro_start")}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* 初期画像のみプリロード */}
      <div className="absolute -top-full opacity-0 pointer-events-none">
        {allImages.slice(0, 3).map((src, index) => (
          <Image key={src} src={src || "/placeholder.svg"} alt="" width={1} height={1} priority={index < 3} />
        ))}
      </div>
    </div>
  )
}

// 性別・年代入力ページ
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
  const { language } = useLanguage()
  const t = (key: ThanksTranslationKey) => thanksTranslations[language][key]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const canContinue = gender !== "" && ageGroup !== ""

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/art39.png"
          alt="背景"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative z-10 max-w-md w-full bg-white bg-opacity-95 rounded-xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
          {language === "ja" ? "あなたについて教えてください" : "Tell us about yourself"}
        </h2>

        {/* 性別選択 */}
        <div className="mb-6">
          <label className="block text-lg font-bold text-gray-700 mb-3">
            {language === "ja" ? "性別" : "Gender"}
          </label>
          <div className="flex gap-3">
            {[
              { value: "male", labelJa: "男性", labelEn: "Male" },
              { value: "female", labelJa: "女性", labelEn: "Female" },
              { value: "other", labelJa: "その他", labelEn: "Other" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setGender(option.value)}
                className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
                  gender === option.value
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {language === "ja" ? option.labelJa : option.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* 年代選択 */}
        <div className="mb-8">
          <label className="block text-lg font-bold text-gray-700 mb-3">
            {language === "ja" ? "年代" : "Age Group"}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "10s", labelJa: "10代", labelEn: "10s" },
              { value: "20s", labelJa: "20代", labelEn: "20s" },
              { value: "30s", labelJa: "30代", labelEn: "30s" },
              { value: "40s", labelJa: "40代", labelEn: "40s" },
              { value: "50s", labelJa: "50代", labelEn: "50s" },
              { value: "60+", labelJa: "60代以上", labelEn: "60+" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setAgeGroup(option.value)}
                className={`py-3 px-4 rounded-lg font-bold transition-all ${
                  ageGroup === option.value
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {language === "ja" ? option.labelJa : option.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* 続けるボタン */}
        <Button
          onClick={onContinue}
          disabled={!canContinue}
          className={`w-full py-4 text-xl font-bold ${
            canContinue
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {language === "ja" ? "ゲームを始める" : "Start Game"}
        </Button>
      </div>
    </div>
  )
}

const QuizPage = ({
  currentQuiz,
  userAnswers,
  totalPoints,
  allUserAnswers,
  onUpdateAnswer,
  onSubmit,
  onEndQuiz,
  onDirectToAffiliate,
  onTimeUp,
  playSoundEffect,
}: {
  currentQuiz: number
  userAnswers: string[]
  totalPoints: number
  allUserAnswers: string[][]
  onUpdateAnswer: (index: number, value: string) => void
  onSubmit: () => void
  onEndQuiz: () => void
  onDirectToAffiliate: () => void
  onTimeUp: () => void
  playSoundEffect: (soundPath: string) => void
}) => {
  // デバイス判定フックを追加
  const isMobile = useIsMobile()

  // ページマウント時に上までスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // QuizPageコンポーネントの開始直後に追加
  useEffect(() => {
    // 新しいクイズが開始される際の初期化
    if (currentQuiz === 0 && userAnswers.length === 1 && userAnswers[0] === "") {
      // 初回開始時の状態確認
      console.log("クイズ初期化完了")
    }
  }, [currentQuiz, userAnswers])

  // 新しいステートを追加
  const [fieldAnimations, setFieldAnimations] = useState<{ [key: string]: boolean }>({})
  const [animationTimer, setAnimationTimer] = useState<NodeJS.Timeout | null>(null)
  const [isNextButtonAnimating, setIsNextButtonAnimating] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [showFlash, setShowFlash] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showContent, setShowContent] = useState(true)
  const [previousBackgroundSrc, setPreviousBackgroundSrc] = useState<string>("")
  const [timeUpCount, setTimeUpCount] = useState(0)
  const [showDarkAnimation, setShowDarkAnimation] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  // updateAnswerの処理を変更
  const updateAnswer = useCallback(
    (index: number, value: string) => {
      const previousValue = userAnswers[index] || ""

      onUpdateAnswer(index, value)

      // 入力が完了した時（空から文字が入力された時）にアニメーション
      if (previousValue === "" && value.trim() !== "") {
        playSoundEffect("/sound/typing.mp3")
        const animationKey = `answer-${index}`
        setFieldAnimations((prev) => ({ ...prev, [animationKey]: true }))

        // 既存のタイマーをクリア
        if (animationTimer) {
          clearTimeout(animationTimer)
        }

        // 新しいタイマーを設定 - 時間短縮
        const newTimer = setTimeout(() => {
          setFieldAnimations({}) // 全てのアニメーションをリセット
        }, 1000)
        setAnimationTimer(newTimer)
      }
    },
    [userAnswers, onUpdateAnswer, animationTimer],
  )

  // 境界チェックを追加
  if (currentQuiz >= quizzes.length || !quizzes[currentQuiz]) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">クイズ完了！</h2>
          <Button onClick={onEndQuiz} className="bg-green-500 hover:bg-green-600 text-white">
            結果を見る
          </Button>
        </div>
      </div>
    )
  }

  const currentAnswerIndex = userAnswers.length - 1
  const nextQuizIndex = currentQuiz + 1

  // 背景画像の取得を更新
  const getCurrentBackgroundSrc = (quizIndex: number) => {
    const quiz = quizzes[quizIndex]
    if (!quiz || !quiz.画像) return "/placeholder.svg"

    return isMobile ? quiz.画像.スマホ[0] : quiz.画像.PC[0]
  }

  const currentBackgroundSrc = getCurrentBackgroundSrc(currentQuiz)
  const nextBackgroundSrc = nextQuizIndex < quizzes.length ? getCurrentBackgroundSrc(nextQuizIndex) : null

  const getTimeColor = (timeLeft: number, timeUpCount: number) => {
    if (timeLeft <= 5) {
      // 通常の時間切れ警告（赤色）
      return "text-red-500 font-bold"
    }

    // タイムアップ回数に応じた色
    if (timeUpCount === 0) return "text-green-500"
    if (timeUpCount === 1) return "text-amber-800" // 焦げ茶色
    if (timeUpCount === 2) return "text-orange-700"
    if (timeUpCount === 3) return "text-red-700"
    if (timeUpCount === 4) return "text-red-600"
    if (timeUpCount >= 5) return "text-red-500" // 原色の赤

    return "text-green-500"
  }

  useEffect(() => {
    if (totalPoints <= -1000) {
      // ポイントが-1000以下になったら強制的に終了
      onEndQuiz()
    }
  }, [totalPoints, onEndQuiz])

  useEffect(() => {
    if (!showContent) return // コンテンツが非表示の時はタイマーを停止

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          // タイムアップ時の処理
          setTimeUpCount((prev) => prev + 1)
          setShowDarkAnimation(true)

          setTimeout(() => {
            onTimeUp()
          }, 0)

          // 暗いアニメーションを1秒後に非表示
          setTimeout(() => {
            setShowDarkAnimation(false)
          }, 1000)

          // 時間をリセット
          setTimeout(() => {
            setTimeLeft(30)
          }, 100)

          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentAnswerIndex, showContent, timeUpCount, onTimeUp])

  // コンポーネントのアンマウント時にタイマーをクリア
  useEffect(() => {
    return () => {
      if (animationTimer) {
        clearTimeout(animationTimer)
      }
    }
  }, [animationTimer])

  // 質問テキストを直接取得
  const currentQuestion = quizzes[currentQuiz]?.question || ""

  const handleSubmitLocal = () => {
    // 回答が空の場合はアニメーションを表示しない
    const hasValidAnswer = userAnswers.some((answer) => answer.trim() !== "")
    if (!hasValidAnswer) {
      onSubmit()
      return
    }

    // 現在の背景画像を安全に取得
    const currentQuizData = quizzes[currentQuiz]
    if (currentQuizData && currentQuizData.画像 && currentQuizData.画像.PC) {
      const currentBgSrc = isMobile ? currentQuizData?.画像?.スマホ?.[0] : currentQuizData?.画像?.PC?.[0]
      setPreviousBackgroundSrc(currentBgSrc || "")
    }
    // UI要素を非表示にしてトランジション開始
    setShowContent(false)
    setIsTransitioning(true)

    // フラッシュエフェクト
    setShowFlash(true)

    setTimeout(() => {
      setShowFlash(false)

      // 背景切り替えアニメーション後にクイズを更新
      onSubmit()
      setIsTransitioning(false)

      // 少し遅れてコンテンツを表示
      setTimeout(() => {
        setShowContent(true)
        setTimeLeft(30) // タイマーをリセット
      }, 150)
    }, 800)
  }

  // handleSubmitLocal関数の前に、回答が有効かどうかをチェックする関数を追加
  const hasValidAnswers = userAnswers.some((answer) => answer.trim() !== "")

  return (
    <div className="relative w-full h-screen flex flex-col">
      {/* Confetti Canvas Animation */}
      <ConfettiCanvas isActive={showFlash} duration={2000} particleCount={50} points={isGoldenQuestion(currentQuiz) ? 300 : 100} />

      {/* Dark Animation Canvas - タイムアップ時 */}
      <DarkAnimationCanvas isActive={showDarkAnimation} duration={1000} />
      {/* 9:16の背景画像 */}
      {/* 背景画像とトランジション */}
      <div className="absolute inset-0 z-0">
        {/* 前の背景画像（トランジション中のみ表示） */}
        {isTransitioning && previousBackgroundSrc && (
          <Image
            src={previousBackgroundSrc || "/placeholder.svg"}
            alt="クイズ背景画像"
            fill
            className="object-cover object-top"
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent && !parent.querySelector('.image-fallback')) {
                const fallback = document.createElement('div')
                fallback.className = 'image-fallback absolute inset-0 flex items-center justify-center'
                fallback.innerHTML = '<div class="w-32 h-32 rounded-full bg-green-400"></div>'
                parent.appendChild(fallback)
              }
            }}
          />
        )}

        {/* 現在の背景画像 */}
        <div className="relative w-full h-full">
          <Image
            src={currentBackgroundSrc || "/placeholder.svg"}
            alt="クイズ背景画像"
            fill
            className="object-cover object-top"
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent && !parent.querySelector('.image-fallback')) {
                const fallback = document.createElement('div')
                fallback.className = 'image-fallback absolute inset-0 flex items-center justify-center'
                fallback.innerHTML = '<div class="w-32 h-32 rounded-full bg-green-400"></div>'
                parent.appendChild(fallback)
              }
            }}
          />

          {/* Canvas背景切り替えエフェクト */}
          <TransitionCanvas isActive={isTransitioning} duration={600} />

          {/* 簡素化された背景切り替え */}
          {isTransitioning && (
            <div className="absolute inset-0 z-10 animate-fade-in">
              <Image
                src={currentBackgroundSrc || "/placeholder.svg"}
                alt="クイズ背景画像"
                fill
                className="object-cover object-top"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent && !parent.querySelector('.image-fallback')) {
                    const fallback = document.createElement('div')
                    fallback.className = 'image-fallback absolute inset-0 flex items-center justify-center'
                    fallback.innerHTML = '<div class="w-32 h-32 rounded-full bg-green-400"></div>'
                    parent.appendChild(fallback)
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* アフィリエイト画像 - 右上 */}
      {/* <div className="absolute top-4 right-4 z-20">
        <AffiliateComponent />
      </div> */}

      {/* 次の画像をプリロード（非表示） */}
      {nextBackgroundSrc && (
        <div className="absolute -top-full opacity-0 pointer-events-none">
          <Image src={nextBackgroundSrc || "/placeholder.svg"} alt="プリロード画像" width={1} height={1} priority />
        </div>
      )}

      {/* コンテンツ */}
      {showContent && (
        <div className="relative z-10 flex flex-col h-full p-6">
          {/* 既存のコンテンツをここに配置 */}
          {/* 上部情報 */}
          <div className="bg-white bg-opacity-90 rounded-lg p-4 md:relative md:top-0 fixed top-0 left-0 right-0 z-20">
            {/* デスクトップレイアウト */}
            <div className="hidden md:flex flex-row justify-between items-center gap-2">
              <div className="text-green-600 text-sm font-medium">
                🍃問題 {currentQuiz + 1} / {quizzes.length}
              </div>
              <div
                className={`text-sm font-medium ${getTimeColor(timeLeft, timeUpCount)} ${isGoldenQuestion(currentQuiz) ? "text-yellow-600 font-bold" : ""}`}
              >
                ⏱️残り時間: {timeLeft}秒
              </div>
              <div className="text-green-600 text-xl font-bold">🏆{totalPoints}pt/目標700pt</div>
            </div>
            {/* モバイルレイアウト */}
            <div className="md:hidden space-y-2">
              <div className="flex flex-row justify-between items-center gap-2">
                <div className="text-green-600 text-sm font-medium">
                  🍃{currentQuiz + 1} / {quizzes.length}
                </div>
                <div
                  className={`text-sm font-medium ${getTimeColor(timeLeft, timeUpCount)} ${isGoldenQuestion(currentQuiz) ? "text-yellow-600 font-bold" : ""}`}
                >
                  ⏱️{timeLeft}秒
                </div>
              </div>
              <div className="text-green-600 text-4xl font-bold text-center">🏆{totalPoints}pt/目標700pt</div>
            </div>
          </div>

          {/* クイズ質問 */}
          <div className="bg-white bg-opacity-90 rounded-lg p-8 mb-4 mt-32 md:mt-0">
            <div className="flex items-center justify-center gap-3">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center leading-tight">
                {currentQuestion}
              </h2>
              {/* デスクトップのみヘルプボタンを表示 */}
              <button
                onClick={() => setIsHelpOpen(true)}
                className="hidden md:block flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors shadow-lg"
              >
                ヘルプ
              </button>
            </div>
          </div>

          {/* 回答欄と回答ボタン */}
          <div className="flex-1 flex flex-col">
            <div className="space-y-2 mb-2">
              {userAnswers.map((answer, index) => (
                <div key={index} className="flex gap-3">
                  <div
                    className={`flex-1 relative transition-all duration-500 ${fieldAnimations[`answer-${index}`] ? "bg-green-50 rounded-lg p-1" : ""}`}
                  >
                    {/* 草エフェクトを上側に固定表示 */}
                    {fieldAnimations[`answer-${index}`] && (
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-green-500 text-xl z-10 animate-bounce">
                        🌿
                      </span>
                    )}
                    <Input
                      type="text"
                      placeholder="回答"
                      value={answer}
                      onChange={(e) => updateAnswer(index, e.target.value)}
                      className={`w-full bg-white bg-opacity-90 text-gray-800 placeholder-gray-500 transition-all duration-300 ${
                        isGoldenQuestion(currentQuiz) ? "border-yellow-400 focus:border-yellow-500" : ""
                      } ${fieldAnimations[`answer-${index}`] ? "border-green-400 shadow-lg" : ""}`}
                    />
                  </div>
                  {/* 「回答する」ボタンの部分を以下に置き換え */}
                  <Button
                    onClick={handleSubmitLocal}
                    disabled={!hasValidAnswers}
                    className={`w-20 h-20 rounded-full ${
                      !hasValidAnswers
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : (currentQuiz + 1) % 3 === 0
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 border-yellow-300 animate-pulse hover:animate-none shadow-yellow-400/50"
                          : isGoldenQuestion(currentQuiz)
                            ? "bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 border-yellow-400 animate-pulse hover:animate-none"
                            : "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 border-green-400 animate-pulse hover:animate-none"
                    } text-white font-bold shadow-2xl transform transition-all duration-300 ${
                      hasValidAnswers
                        ? (currentQuiz + 1) % 3 === 0
                          ? "hover:scale-110 hover:shadow-yellow-400/70"
                          : "hover:scale-110 hover:shadow-green-400/50"
                        : ""
                    } border-4 ${(currentQuiz + 1) % 3 === 0 ? "hover:border-yellow-200" : "hover:border-green-200"}`}
                  >
                    <span className="text-sm leading-tight">
                      回答
                      <br />
                      する{" "}
                      {isGoldenQuestion(currentQuiz) && (
                        <>
                          <br />
                          (+300pt)
                        </>
                      )}
                    </span>
                  </Button>
                </div>
              ))}
            </div>

            {/* 終えるボタンと次へボタンを最下部に配置 */}
            <div className="mt-auto pt-16">
              <div className="space-y-8">
                {/* モバイルのみヘルプボタンを表示 */}
                <div className="md:hidden">
                  <button
                    onClick={() => setIsHelpOpen(true)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg"
                  >
                    ヘルプ
                  </button>
                </div>

                <div className={isNextButtonAnimating ? "animate-pulse" : ""}>
                  <Button
                    onClick={() => {
                      // アニメーション開始
                      setIsNextButtonAnimating(true)

                      // パーティクルエフェクトを表示
                      setTimeout(() => {
                        setIsNextButtonAnimating(false)
                        // 現在の回答を保存してからサマリーページへ
                        onEndQuiz()
                      }, 500)
                    }}
                    disabled={isNextButtonAnimating}
                    className={`w-full relative overflow-hidden ${
                      isGoldenQuestion(currentQuiz)
                        ? "bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-700 hover:from-yellow-700 hover:via-yellow-600 hover:to-yellow-800 border-yellow-400/30 hover:border-yellow-300/50"
                        : "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 border-blue-400/30 hover:border-blue-300/50"
                    } text-white font-bold py-4 px-8 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl border-2`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                      <svg
                        className={`w-6 h-6 ${isNextButtonAnimating ? "animate-spin" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      {isNextButtonAnimating ? "移動中..." : "感謝しきった。（次のステージへ）"}
                      <svg
                        className={`w-5 h-5 ${isNextButtonAnimating ? "animate-bounce" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>

                    {/* 光る効果 - CSS Animation */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 ${isNextButtonAnimating ? "animate-pulse" : ""}`} />
                  </Button>
                </div>

                {/* アフィリエイト画像 */}
                <div className="flex justify-center">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<a href="https://px.a8.net/svt/ejp?a8mat=45167E+679KMQ+5OI8+5ZEMP" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www27.a8.net/svt/bgt?aid=250317482375&wid=001&eno=01&mid=s00000026504001005000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=45167E+679KMQ+5OI8+5ZEMP" alt="">`
                    }}
                  />
                </div>

                <div className="pt-4">
                  <Button
                    onClick={onDirectToAffiliate}
                    className="w-full text-green-600 bg-transparent hover:text-green-700 hover:bg-green-50 font-bold border-0"
                  >
                    終える
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* トランジション中の中央ローディング表示を削除 */}

      {/* ヘルプポップアップ */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
            {/* ヘッダー */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">ヘルプ</h2>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors text-3xl font-bold"
                aria-label="閉じる"
              >
                ×
              </button>
            </div>

            {/* コンテンツ */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4 text-gray-700">
                <p className="text-lg font-semibold text-green-600">
                  本気を出せばイスなどにも感謝できます
                </p>
              </div>
            </div>

            {/* フッター */}
            <div className="p-6 border-t">
              <button
                onClick={() => setIsHelpOpen(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const ResultPage = ({
  totalPoints,
  selectedAnswers,
  actionPlans,
  onRestart,
  onExit,
  gender,
  setGender,
  ageGroup,
  setAgeGroup,
  enjoymentRating,
  setEnjoymentRating,
  improvementRating,
  setImprovementRating,
  userId,
  sessionId,
  hasSubmittedGameData,
  onSetHasSubmittedGameData,
}: {
  totalPoints: number
  selectedAnswers: string[]
  actionPlans: ActionPlan[]
  onRestart: () => void
  onExit: () => void
  gender: string
  setGender: (value: string) => void
  ageGroup: string
  setAgeGroup: (value: string) => void
  enjoymentRating: number
  setEnjoymentRating: (value: number) => void
  improvementRating: number
  setImprovementRating: (value: number) => void
  userId: string
  sessionId: string
  hasSubmittedGameData: boolean
  onSetHasSubmittedGameData: (value: boolean) => void
}) => {
  const { language } = useLanguage()
  const t = (key: ThanksTranslationKey) => thanksTranslations[language][key]

  // ページマウント時に上までスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [affiliateTextPattern, setAffiliateTextPattern] = useState(affiliateTextPatterns[0])
  const [affiliatePatternIndex, setAffiliatePatternIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  // コンポーネントがマウントされた時にランダムなテキストパターンを選択
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * affiliateTextPatterns.length)
    setAffiliateTextPattern(affiliateTextPatterns[randomIndex])
    setAffiliatePatternIndex(randomIndex)
  }, [])

  // 結果ページ表示時にゲームデータを自動送信（終えるボタンで送信済みでない場合のみ）
  useEffect(() => {
    if (hasSubmittedGameData) return

    const saveGameData = async () => {
      try {
        await fetch("/api/responses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table: "thanks_responses",
            user_id: userId,
            session_id: sessionId,
            total_points: totalPoints,
            selected_values: selectedAnswers,
            action_plans: actionPlans.map(plan => plan.action).filter(action => action.trim() !== ""),
            gender: gender,
            age_group: ageGroup,
            enjoyment_rating: null,
            improvement_rating: null,
          }),
        })
        onSetHasSubmittedGameData(true)
      } catch {
        console.error("ゲームデータの自動保存に失敗")
      }
    }

    saveGameData()
  }, [])

  // アンケート送信処理（affiliate_clicksのみ送信）
  const handleSurveySubmit = async () => {
    if (hasSubmitted || isSubmitting) return

    setIsSubmitting(true)

    await fetch("/api/affiliate-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        game_name: "thanks",
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

      fetch("/api/affiliate-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game_name: "thanks",
          user_id: userId,
          session_id: sessionId,
          gender: gender || null,
          age_group: ageGroup || null,
          enjoyment_rating: enjoymentRating,
          improvement_rating: improvementRating,
          affiliate_clicked: true,
          affiliate_pattern_index: affiliatePatternIndex,
        }),
      }).catch(() => {}).finally(() => {
        setHasSubmitted(true)
        setIsSubmitting(false)
        if (shouldRedirect && redirectUrl) {
          setTimeout(() => {
            window.open(redirectUrl, "_blank")
          }, 200)
        }
      })
    },
    [isSubmitting, hasSubmitted, userId, sessionId, gender, ageGroup, enjoymentRating, improvementRating, affiliatePatternIndex],
  )

  // iframeからのメッセージを受信するリスナーを修正
  // iframeからのメッセージを受信するリスナーを修正
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // オリジンチェック（セキュリティ向上）
      if (event.origin !== window.location.origin) {
        return
      }

      if (event.data && event.data.type === "affiliate-click") {
        // クリックデータを含めてhandleAffiliateClickを呼び出し
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
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/background-bright-forest-road.png"
          alt="結果画面背景"
          fill
          className="object-cover object-top"
          priority
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent && !parent.querySelector('.image-fallback')) {
              const fallback = document.createElement('div')
              fallback.className = 'image-fallback absolute inset-0 flex items-center justify-center'
              fallback.innerHTML = '<div class="w-32 h-32 rounded-full bg-green-400"></div>'
              parent.appendChild(fallback)
            }
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* 統合された診断結果とアフィリエイトセクション */}
        <div className="text-center bg-white bg-opacity-95 rounded-xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-green-800 mb-6">{t("result_title")}</h1>

          <div className="text-5xl font-bold text-green-700 mb-3">🏆{t("result_total_points")} {totalPoints}{t("points")}</div>
          <div className="text-xl font-bold text-green-300 mb-6">🏆1200{t("points")}/{t("result_average_points")}</div>

          <div className="text-2xl font-bold text-purple-600 mb-6">{t("result_share_message")}</div>


          {/* 選択した価値観と行動プラン */}
          <div className="space-y-6 mt-8">
            {/* 選択した価値観 */}
            {selectedAnswers.length > 0 && (
              <div className="bg-green-50 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
                  {t("result_selected_values_title")}
                </h2>
                <div className="space-y-3">
                  {selectedAnswers.map((answer, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-md shadow-sm">
                      <span className="bg-green-500 text-white font-bold min-w-[32px] h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-green-900 font-medium text-lg">{answer}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 行動プラン */}
            {actionPlans.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                  {t("result_action_plan_title")}
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
                            <span className="font-bold text-blue-700">{t("result_action_plan_when")}</span> {plan.when || t("result_action_plan_not_entered")}
                          </p>
                          <p className="text-gray-700 mb-1">
                            <span className="font-bold text-blue-700">{t("result_action_plan_action")}</span> {plan.action || t("result_action_plan_not_entered")}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-bold text-blue-700">{t("result_action_plan_why")}</span> {plan.motivation || t("result_action_plan_not_entered")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* アンケートセクション */}
          {!hasSubmitted ? (
            <div className="mt-8 pt-8 border-t-2 border-gray-200">
              <h2 className="text-2xl font-bold text-purple-600 mb-6">
                {language === "ja" ? "📝 アンケートにご協力ください" : "📝 Please help us with a survey"}
              </h2>

              <div className="space-y-6 text-left">
                {/* 楽しさ */}
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2">
                    {language === "ja"
                      ? `このゲームは楽しかったですか？ (${enjoymentRating}/10)`
                      : `Did you enjoy this game? (${enjoymentRating}/10)`}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={enjoymentRating}
                    onChange={(e) => setEnjoymentRating(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>{language === "ja" ? "つまらない" : "Not fun"}</span>
                    <span>{language === "ja" ? "とても楽しい" : "Very fun"}</span>
                  </div>
                </div>

                {/* 改善度 */}
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2">
                    {language === "ja"
                      ? `自分を見つめ直すきっかけになりましたか？ (${improvementRating}/10)`
                      : `Did this help you reflect on yourself? (${improvementRating}/10)`}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={improvementRating}
                    onChange={(e) => setImprovementRating(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>{language === "ja" ? "全くならなかった" : "Not at all"}</span>
                    <span>{language === "ja" ? "とてもなった" : "Very much"}</span>
                  </div>
                </div>

                {/* 送信ボタン */}
                <div className="text-center pt-4">
                  <Button
                    onClick={handleSurveySubmit}
                    disabled={isSubmitting}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 text-lg"
                  >
                    {isSubmitting
                      ? (language === "ja" ? "送信中..." : "Submitting...")
                      : (language === "ja" ? "アンケートを送信" : "Submit Survey")}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 pt-8 border-t-2 border-gray-200 text-center">
              <p className="text-xl text-green-600 font-bold">
                {language === "ja"
                  ? "✓ アンケートにご協力ありがとうございました！"
                  : "✓ Thank you for your feedback!"}
              </p>
            </div>
          )}

          {/* アフィリエイト部分を同じカード内に統合 - 日本語版のみ */}
          {language === "ja" && (
            <div className="mt-8 pt-8 border-t-2 border-gray-200">
              <h2 className="text-2xl font-bold text-orange-600 mt-8">{affiliateTextPattern.headline}</h2>

              <div className="text-center">
                <AffiliateComponent
                  className="mx-auto"
                  affiliateTextPattern={affiliateTextPattern}
                  onAffiliateClick={() => {
                    console.log("アフィリエイトリンクがクリックされました")
                    fetch("/api/affiliate-click", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        game_name: "thanks",
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
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={onRestart} className="bg-green-500 hover:bg-green-600 text-white px-8 py-3">
            {t("result_restart_button")}
          </Button>
          <Button onClick={onExit} className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3">
            {t("result_exit_button")}
          </Button>
        </div>
      </div>
    </div>
  )
}


const QuizGame = () => {
  const router = useRouter()
  const [gameState, setGameState] = useState<"intro" | "prestart" | "quiz" | "result">("intro")
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>([""])
  const [allUserAnswers, setAllUserAnswers] = useState<string[][]>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [enjoymentRating, setEnjoymentRating] = useState(5)
  const [improvementRating, setImprovementRating] = useState(5)
  // 新しいステート：価値観選択と行動プラン（削除予定だが、ResultPageで使用されているため残す）
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([])
  // データ送信用のステート
  const [gender, setGender] = useState<string>("")
  const [ageGroup, setAgeGroup] = useState<string>("")
  const [userId, setUserId] = useState<string>("")
  const [sessionId, setSessionId] = useState<string>("")
  const [hasSubmittedGameData, setHasSubmittedGameData] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const bgmRef = useRef<HTMLAudioElement | null>(null)

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
    const shouldPlayBgm = gameState !== "intro" && gameState !== "result"

    if (shouldPlayBgm && !isMuted) {
      if (!bgmRef.current) {
        bgmRef.current = new Audio("/sound/gamebgmchild.mp3")
        bgmRef.current.loop = true
        bgmRef.current.volume = 0.3
      }
      bgmRef.current.play().catch(console.error)
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
          bgmRef.current.play().catch(console.error)
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

  // userId/sessionIdの初期化
  useEffect(() => {
    let storedUserId = localStorage.getItem("quiz_user_id")
    if (!storedUserId) {
      storedUserId = crypto.randomUUID()
      localStorage.setItem("quiz_user_id", storedUserId)
    }
    setUserId(storedUserId)
    setSessionId(crypto.randomUUID())
  }, [])

  const handleUpdateAnswer = (index: number, value: string) => {
    const newAnswers = [...userAnswers]
    while (newAnswers.length <= index) {
      newAnswers.push("")
    }
    newAnswers[index] = value
    setUserAnswers(newAnswers)
  }

  const handleSubmit = () => {
    const currentAnswers = userAnswers.filter((answer) => answer.trim() !== "")
    if (currentAnswers.length === 0) return

    setAllUserAnswers((prev) => [...prev, currentAnswers])

    if (currentQuiz < quizzes.length - 1) {
      setCurrentQuiz((prev) => prev + 1)
      setUserAnswers([""])
      // ゴールド問題の場合は300pt、通常は100pt
      const pointsToAdd = isGoldenQuestion(currentQuiz) ? 300 : 100
      if (pointsToAdd === 300) {
        playSoundEffect("/sound/300ptnextpage.mp3")
      } else {
        playSoundEffect("/sound/100pt.mp3")
      }
      setTotalPoints((prev) => prev + pointsToAdd)
    } else {
      playSoundEffect("/sound/gamefinish.mp3")
      setGameState("result")
    }
  }

  const handleEndQuiz = () => {
    // 現在の回答を保存してから直接結果ページへ移行
    playSoundEffect("/sound/gamefinish.mp3")
    const currentAnswers = userAnswers.filter((answer) => answer.trim() !== "")
    if (currentAnswers.length > 0) {
      setAllUserAnswers((prev) => [...prev, currentAnswers])
    }
    setGameState("result")
  }

  const handleDirectToAffiliate = () => {
    setGameState("result")
  }

  const handleTimeUp = () => {
    playSoundEffect("/sound/timeup.mp3")
    setTotalPoints((prev) => prev - 50)
  }

  const handleRestart = () => {
    playSoundEffect("/sound/replay.mp3")
    setGameState("intro")
    setCurrentQuiz(0)
    setUserAnswers([""])
    setAllUserAnswers([])
    setTotalPoints(0)
    setEnjoymentRating(5)
    setImprovementRating(5)
    setSelectedAnswers([])
    setActionPlans([])
    setHasSubmittedGameData(false)
    // session_idを新規生成
    setSessionId(crypto.randomUUID())
  }

  const handleExit = () => {
    router.push("/")
  }

  const handleStart = () => {
    playSoundEffect("/sound/gamestart.mp3")
    setGameState("prestart")
  }

  return (
    <AnimatePresence mode="wait">
      {gameState === "intro" && <IntroPage key="intro" onStart={handleStart} isMuted={isMuted} setIsMuted={setIsMuted} />}
      {gameState === "prestart" && (
        <PrestartPage
          key="prestart"
          gender={gender}
          setGender={setGender}
          ageGroup={ageGroup}
          setAgeGroup={setAgeGroup}
          onContinue={() => setGameState("quiz")}
        />
      )}
      {gameState === "quiz" && (
        <QuizPage
          key="quiz"
          currentQuiz={currentQuiz}
          userAnswers={userAnswers}
          totalPoints={totalPoints}
          allUserAnswers={allUserAnswers}
          onUpdateAnswer={handleUpdateAnswer}
          onSubmit={handleSubmit}
          onEndQuiz={handleEndQuiz}
          onDirectToAffiliate={handleDirectToAffiliate}
          onTimeUp={handleTimeUp}
          playSoundEffect={playSoundEffect}
        />
      )}
      {gameState === "result" && (
        <ResultPage
          key="result"
          totalPoints={totalPoints}
          selectedAnswers={selectedAnswers}
          actionPlans={actionPlans}
          onRestart={handleRestart}
          onExit={handleExit}
          gender={gender}
          setGender={setGender}
          ageGroup={ageGroup}
          setAgeGroup={setAgeGroup}
          enjoymentRating={enjoymentRating}
          setEnjoymentRating={setEnjoymentRating}
          improvementRating={improvementRating}
          setImprovementRating={setImprovementRating}
          userId={userId}
          sessionId={sessionId}
          hasSubmittedGameData={hasSubmittedGameData}
          onSetHasSubmittedGameData={setHasSubmittedGameData}
        />
      )}
    </AnimatePresence>
  )
}

export default QuizGame
