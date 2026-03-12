"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import ConfettiCanvas from "@/components/animations/ConfettiCanvas"
import DarkAnimationCanvas from "@/components/animations/DarkAnimationCanvas"
import ButtonAnimationCanvas from "@/components/animations/ButtonAnimationCanvas"
import TransitionCanvas from "@/components/animations/TransitionCanvas"
import { TermsOfService } from "@/components/terms-of-service/terms-of-service"

// Supabaseクライアントの設定（Selfworth用プロジェクト）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_SELFWORTH
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_SELFWORTH

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null


// const supabase = createClientComponentClient()

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
    question: "今あなたの欲しい物やことは何ですか？",
    画像: {
      PC: ["/image/worthho1 (2).png"],
      スマホ: ["/image/worth1"],
    },
  },
  {
    question: "動的に生成される質問",
    画像: {
      PC: ["/image/worthho2.png"],
      スマホ: ["/image/worth52"],
    },
  },
  {
    question: "動的に生成される質問",
    画像: {
      PC: ["/image/worthho3.png"],
      スマホ: ["/image/worth31"],
    },
  },
  {
    question: "動的に生成される質問",
    画像: {
      PC: ["/image/worthho4.png"],
      スマホ: ["/image/worth41"],
    },
  },
  {
    question: "動的に生成される質問",
    画像: {
      PC: ["/image/worthho5.png"],
      スマホ: ["/image/worth51"],
    },
  },
  {
    question: "動的に生成される質問",
    画像: {
      PC: ["/image/worthho6.png"],
      スマホ: ["/image/worth6"],
    },
  },
  {
    question: "動的に生成される質問",
    画像: {
      PC: ["/image/worthho7.png"],
      スマホ: ["/image/worth7"],
    },
  },
  {
    question: "動的に生成される質問",
    画像: {
      PC: ["/image/worthho8.png"],
      スマホ: ["/image/worth8"],
    },
  },
  {
    question: "動的に生成される質問",
    画像: {
      PC: ["/image/worthho9.png"],
      スマホ: ["/image/worth9"],
    },
  },
  {
    question: "動的に生成される質問",
    画像: {
      PC: ["/image/worthho10.png"],
      スマホ: ["/image/worth10"],
    },
  },
  {
    question: "動的に生成される質問",
    画像: {
      PC: ["/image/worthho11.png"],
      スマホ: ["/image/worth11"],
    },
  },
  {
    question: "動的に生成される質問",
    画像: {
      PC: ["/image/worthho12.png"],
      スマホ: ["/image/worth12"],
    },
  },
  {
    question: "動的に生成される質問",
    画像: {
      PC: ["/image/worthho13.png"],
      スマホ: ["/image/worth13"],
    },
  },
  {
    question: "動的に生成される質問",
    画像: {
      PC: ["/image/worthho14.png"],
      スマホ: ["/image/worth14"],
    },
  },
  {
    question: "動的に生成される質問",
    画像: {
      PC: ["/image/worthho15.png"],
      スマホ: ["/image/worth15"],
    },
  },
  {
    question: "動的に生成される質問",
    画像: {
      PC: ["/image/worthho16.png"],
      スマホ: ["/image/worth16"],
    },
  },
  {
    question: "動的に生成される質問",
    画像: {
      PC: ["/image/worthho17.png"],
      スマホ: ["/image/worth17"],
    },
  },
  {
    question: "動的に生成される質問",
    画像: {
      PC: ["/image/worthho18.png"],
      スマホ: ["/image/worth18"],
    },
  },
  {
    question: "動的に生成される質問",
    画像: {
      PC: ["/image/worthho19.png"],
      スマホ: ["/image/worth19"],
    },
  },
  {
    question: "動的に生成される質問",
    画像: {
      PC: ["/image/worthho20.png"],
      スマホ: ["/image/worth20"],
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

  // アフィリエイトリンクのクリックを検知
  const handleContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    // aタグまたはその子要素（img等）がクリックされた場合
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
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [allImages, setAllImages] = useState<string[]>([])
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

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
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/background-bright-forest-road.png"
          alt="心の状態"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      <div className="relative z-10 text-center space-y-6 bg-green-700 bg-opacity-70 p-8 rounded-lg max-w-2xl">
        <h1 className="text-4xl font-bold text-white">後悔しない人生により近づきます！</h1>
        <p className="text-lg text-white">
          あなたが心の奥深くで求めているものを見つけることを目指します。その通りの行動をすることであなたは幸福度が高い人生を送れます。
          1問30秒です。直感で答えてみましょう！ではいってらっしゃい！（※完全無料です。）
        </p>
        <p className="text-base text-red-300 font-bold">
          ⚠️ 残り時間が過ぎると-50ptされます！
        </p>
        <p className="text-base text-yellow-200 font-semibold">
          あなたを守るため、個人情報は入力しないでください。　ex 　佐々木君がではなく　ｓ君がとしましょう。
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
            <span>{isMuted ? "消音モード中" : "消音モードを選択"}</span>
          </button>
        </div>

        {!imagesLoaded && allImages.length > 0 ? (
          <ImagePreloader images={allImages} onComplete={handleImagesLoaded} />
        ) : allImages.length === 0 ? (
          <div className="text-white text-lg">デバイスを確認中...</div>
        ) : (
          <>
            {/* 利用規約セクション */}
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={() => setIsTermsOpen(true)}
                  className="text-white underline hover:text-green-200 transition-colors"
                >
                  利用規約
                </button>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-8 h-8 rounded-full border-2 border-white cursor-pointer transition-all duration-300 hover:scale-125 hover:border-green-300 checked:scale-110 checked:bg-green-400"
                  />
                  <span className="text-white">同意する</span>
                </label>
              </div>

              {/* 注意書き */}
              <p className="text-red-300 text-sm text-center mb-4">
                重度のトラウマなどお持ちの方は私のゲームではなく、精神科医にかかる事を推奨いたします
              </p>

              <Button
                onClick={onStart}
                disabled={!agreedToTerms}
                className={`bg-gradient-to-r from-green-500 to-green-700 hover:opacity-90 transition-opacity px-8 py-4 text-xl text-white ${
                  !agreedToTerms ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                スタート
              </Button>
            </div>
          </>
        )}
      </div>

      {/* 利用規約ポップアップ */}
      <TermsOfService isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />

      {/* 初期画像のみプリロード */}
      <div className="absolute -top-full opacity-0 pointer-events-none">
        {allImages.slice(0, 3).map((src, index) => (
          <Image key={src} src={src || "/placeholder.svg"} alt="" width={1} height={1} priority={index < 3} />
        ))}
      </div>
    </div>
  )
}

// はじめに画面：性別・年代入力
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
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-green-100 to-green-200" />

      <div className="relative z-10 max-w-md w-full bg-white rounded-xl p-8 shadow-2xl">
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
  userId,
  sessionId,
  gender,
  ageGroup,
  onSetHasSubmittedGameData,
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
  userId: string
  sessionId: string
  gender: string
  ageGroup: string
  onSetHasSubmittedGameData: (value: boolean) => void
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

  const generateQuestionText = (currentQuiz: number, allUserAnswers: string[][]) => {
    if (currentQuiz === 0) {
      return "あなたの欲しい物やことは何ですか？"
    }

    const previousAnswers = allUserAnswers[currentQuiz - 1] || []
    if (previousAnswers.length > 0) {
      const answersText = previousAnswers.join("、")
      return `どうして「${answersText}」が欲しいのですか？`
    }

    return "どうして「前の問題の回答」が欲しいのですか？"
  }

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
          <div className="bg-white bg-opacity-90 rounded-b-lg p-4 md:relative md:top-0 fixed top-0 left-0 right-0 z-20">
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
                {generateQuestionText(currentQuiz, allUserAnswers)}
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
                      placeholder={`回答 ${index + 1}`}
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
                      {isNextButtonAnimating ? "移動中..." : "欲求が見つかった。（次のステージへ）"}
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
                <div
                  className="flex justify-center"
                  onClick={(e) => {
                    const target = e.target as HTMLElement
                    // aタグまたはその子要素（img等）がクリックされた場合
                    if (target.tagName === 'A' || target.closest('a')) {
                      console.log("QuizPage: アフィリエイト画像がクリックされました")
                      // アフィリエイトクリックをaffiliate_clicksに記録
                      if (supabase) {
                        supabase.from("affiliate_clicks").insert({
                          user_id: userId,
                          session_id: sessionId,
                          game_name: "selfworth",
                          gender: gender || null,
                          age_group: ageGroup || null,
                          enjoyment_rating: null,
                          improvement_rating: null,
                          affiliate_clicked: true,
                          affiliate_pattern_index: null,
                        }).then(({ error }) => {
                          if (error) {
                            console.error("アフィリエイトクリックの記録に失敗:", error)
                          } else {
                            console.log("QuizPageからのアフィリエイトクリックが記録されました")
                          }
                        })
                      }
                    }
                  }}
                >
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
                    onClick={async () => {
                      console.log("QuizPage: 終えるボタンがクリックされました")
                      // ゲームデータをquiz_responses_v3に送信（完了を待ってから遷移）
                      if (supabase) {
                        const currentAnswers = userAnswers.filter((answer) => answer.trim() !== "")
                        const allAnswers = [...allUserAnswers, currentAnswers].flat()
                        const { error } = await supabase.from("quiz_responses_v3").insert({
                          user_id: userId,
                          session_id: sessionId,
                          total_points: totalPoints,
                          selected_values: allAnswers,
                          action_plans: [],
                          gender: gender,
                          age_group: ageGroup,
                          enjoyment_rating: null,
                          improvement_rating: null,
                        })
                        if (error) {
                          console.error("データの保存に失敗:", error)
                        } else {
                          console.log("終えるボタンからのデータが保存されました")
                          onSetHasSubmittedGameData(true)
                        }
                      }
                      onDirectToAffiliate()
                    }}
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
                {isGoldenQuestion(currentQuiz) ? (
                  <>
                    <p className="text-lg font-semibold text-yellow-600">
                      🌟 ゴールド問題！ 300pt獲得のチャンス！
                    </p>
                    <p>
                      「回答する」ボタンをあなたが求めているものの深い目的が探し出せるまで押してください。
                    </p>
                    <p>
                      よくわからなくなったら、どんな理由でそれが大事なの？、それがしたいの？、それがほしいの？、それがあなたにとって重要なの？と解いてみてください。
                    </p>
                    <p>
                      見つかったら「欲求が見つかった（次のステージへ）」ボタンを押してください。
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      「回答する」ボタンをあなたが求めているものの深い目的が探し出せるまで押してください。
                    </p>
                    <p>
                      よくわからなくなったら、どんな理由でそれが大事なの？、それがしたいの？、それがほしいの？、それがあなたにとって重要なの？と解いてみてください。
                    </p>
                    <p>
                      見つかったら「欲求が見つかった（次のステージへ）」ボタンを押してください。
                    </p>
                  </>
                )}
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
      if (!supabase) return

      try {
        const { error } = await supabase.from("quiz_responses_v3").insert({
          user_id: userId,
          session_id: sessionId,
          total_points: totalPoints,
          selected_values: selectedAnswers,
          action_plans: actionPlans.map(plan => plan.action).filter(action => action.trim() !== ""),
          gender: gender,
          age_group: ageGroup,
          enjoyment_rating: null,
          improvement_rating: null,
        })

        if (error) {
          console.error("ゲームデータの自動保存に失敗:", error)
        } else {
          console.log("ゲームデータが自動保存されました")
          onSetHasSubmittedGameData(true)
        }
      } catch (err) {
        console.error("データ保存中にエラーが発生:", err)
      }
    }

    saveGameData()
  }, [])

  // アンケート送信処理（affiliate_clicksのみ送信）
  const handleSurveySubmit = async () => {
    if (hasSubmitted || isSubmitting) return

    setIsSubmitting(true)

    if (supabase) {
      try {
        // アンケートデータをaffiliate_clicksに保存
        const { error: affiliateError } = await supabase.from("affiliate_clicks").insert({
          user_id: userId,
          session_id: sessionId,
          game_name: "selfworth",
          gender: gender || null,
          age_group: ageGroup || null,
          enjoyment_rating: enjoymentRating,
          improvement_rating: improvementRating,
          affiliate_clicked: false,
          affiliate_pattern_index: affiliatePatternIndex,
        })

        if (affiliateError) {
          console.error("アンケートデータの保存に失敗:", affiliateError)
        } else {
          console.log("アンケートデータが保存されました")
        }

        setHasSubmitted(true)
      } catch (err) {
        console.error("データ保存中にエラーが発生:", err)
      }
    }

    setIsSubmitting(false)
  }

  // アフィリエイトリンクがクリックされた時の処理
  // handleAffiliateClick関数をuseCallbackでメモ化
  const handleAffiliateClick = useCallback(
    (clickData?: { url?: string; clickType?: string }) => {
      if (isSubmitting || hasSubmitted) {
        // すでに処理中または完了済みの場合でも、遷移は実行
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
          game_name: "selfworth",
          gender: gender || null,
          age_group: ageGroup || null,
          enjoyment_rating: enjoymentRating,
          improvement_rating: improvementRating,
          affiliate_clicked: true,
          affiliate_pattern_index: affiliatePatternIndex,
        }).then(({ error }) => {
          if (error) {
            console.error("アフィリエイトクリックの記録に失敗:", error)
          } else {
            console.log("アフィリエイトクリックが記録されました")
          }

          setHasSubmitted(true)
          setIsSubmitting(false)

          // データ送信完了後（成功・失敗問わず）にアフィリエイトリンクに遷移
          if (shouldRedirect && redirectUrl) {
            setTimeout(() => {
              window.open(redirectUrl, "_blank")
            }, 200)
          }
        })
      }
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
        />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* 統合された診断結果とアフィリエイトセクション */}
        <div className="text-center bg-white bg-opacity-95 rounded-xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-green-800 mb-6">あなたの価値観診断結果</h1>

          <div className="text-5xl font-bold text-green-700 mb-3">🏆合計ポイント {totalPoints}pt</div>
          <div className="text-xl font-bold text-green-300 mb-6">🏆1200pt/全国平均</div>

          <div className="text-2xl font-bold text-purple-600 mb-6">★yumeのゲーム　　スクショしてSNSに投稿しよう！★</div>


          {/* 選択した価値観と行動プラン */}
          <div className="space-y-6 mt-8">
            {/* 選択した価値観 */}
            {selectedAnswers.length > 0 && (
              <div className="bg-green-50 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
                  💎 あなたが選んだ価値観
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
                  🎯 あなたの行動プラン
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
                            <span className="font-bold text-blue-700">いつ:</span> {plan.when || "未入力"}
                          </p>
                          <p className="text-gray-700 mb-1">
                            <span className="font-bold text-blue-700">行動:</span> {plan.action || "未入力"}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-bold text-blue-700">なぜ:</span> {plan.motivation || "未入力"}
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
              <h2 className="text-2xl font-bold text-purple-600 mb-6">📝 アンケートにご協力ください</h2>

              <div className="space-y-6 text-left">
                {/* 楽しさ */}
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2">
                    このゲームは楽しかったですか？ ({enjoymentRating}/10)
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
                    <span>つまらない</span>
                    <span>とても楽しい</span>
                  </div>
                </div>

                {/* 改善度 */}
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2">
                    自分を見つめ直すきっかけになりましたか？ ({improvementRating}/10)
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
                    <span>全くならなかった</span>
                    <span>とてもなった</span>
                  </div>
                </div>

                {/* 送信ボタン */}
                <div className="text-center pt-4">
                  <Button
                    onClick={handleSurveySubmit}
                    disabled={isSubmitting}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 text-lg"
                  >
                    {isSubmitting ? "送信中..." : "アンケートを送信"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 pt-8 border-t-2 border-gray-200 text-center">
              <p className="text-xl text-green-600 font-bold">✓ アンケートにご協力ありがとうございました！</p>
            </div>
          )}

          {/* アフィリエイト部分を同じカード内に統合 */}
          <div className="mt-8 pt-8 border-t-2 border-gray-200">
            <h2 className="text-2xl font-bold text-orange-600 mt-8">{affiliateTextPattern.headline}</h2>

            <div className="text-center">
              <AffiliateComponent
                className="mx-auto"
                affiliateTextPattern={affiliateTextPattern}
                onAffiliateClick={() => {
                  console.log("アフィリエイトリンクがクリックされました")
                  // アフィリエイトクリックをaffiliate_clicksに記録
                  if (supabase) {
                    supabase.from("affiliate_clicks").insert({
                      user_id: userId,
                      session_id: sessionId,
                      game_name: "selfworth",
                      gender: gender || null,
                      age_group: ageGroup || null,
                      enjoyment_rating: enjoymentRating,
                      improvement_rating: improvementRating,
                      affiliate_clicked: true,
                      affiliate_pattern_index: affiliatePatternIndex,
                    }).then(({ error }) => {
                      if (error) {
                        console.error("アフィリエイトクリックの記録に失敗:", error)
                      } else {
                        console.log("アフィリエイトクリックが記録されました")
                      }
                    })
                  }
                }}
              />
            </div>
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

  // 全ての回答を平坦化して重複を除去
  const allAnswers = Array.from(new Set(allUserAnswers.flat().filter((answer) => answer.trim() !== "")))
  const [showConfetti, setShowConfetti] = useState(false)

  const handleContinue = () => {
    if (selectedAnswers.length === 0) return
    setShowConfetti(true)
    setTimeout(() => {
      setShowConfetti(false)
      onContinue()
    }, 1000)
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/background-bright-forest-road.png"
          alt="価値観選択背景"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      {/* Confetti Canvas Animation */}
      <ConfettiCanvas isActive={showConfetti} duration={1000} particleCount={30} points={300} />

      <div className="relative z-10 max-w-3xl w-full space-y-6">
        <div className="text-center bg-white bg-opacity-95 rounded-xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-green-800 mb-4">価値観を選択してください</h1>
          <p className="text-lg text-gray-700 mb-2">
            あなたの回答の中から最大3つまで選んでください
          </p>
          <p className="text-sm text-gray-600 mb-6">選択済み: {selectedAnswers.length}/3</p>

          {/* 回答リスト */}
          <div className="space-y-3 mb-8">
            {allAnswers.map((answer, index) => {
              const isSelected = selectedAnswers.includes(answer)
              const canSelect = selectedAnswers.length < 3 || isSelected

              return (
                <button
                  key={index}
                  onClick={() => canSelect && onAnswerSelect(answer)}
                  disabled={!canSelect}
                  className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                    isSelected
                      ? "bg-green-500 text-white shadow-lg transform scale-105"
                      : canSelect
                        ? "bg-white text-gray-800 hover:bg-gray-50 hover:shadow-md border-2 border-gray-200"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-gray-300"
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

          {/* ボタン */}
          <div className="space-y-4">
            <Button
              onClick={handleContinue}
              disabled={selectedAnswers.length === 0}
              className={`w-full py-4 text-lg font-bold ${
                selectedAnswers.length > 0
                  ? "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white"
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
        </div>
      </div>
    </div>
  )
}

// 行動プランページ（ActionPlanPage）
const ActionPlanPage = ({
  selectedAnswers,
  actionPlans,
  totalPoints,
  setTotalPoints,
  onActionPlanAdd,
  onComplete,
  onTimeUp,
  onExit,
  onFieldComplete,
}: {
  selectedAnswers: string[]
  actionPlans: ActionPlan[]
  totalPoints: number
  setTotalPoints: (value: number | ((prev: number) => number)) => void
  onActionPlanAdd: (when: string, action: string, motivation: string) => void
  onComplete: () => void
  onTimeUp: () => void
  onExit: () => void
  onFieldComplete: () => void
}) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [currentPlan, setCurrentPlan] = useState<ActionPlan>({ when: "", action: "", motivation: "" })
  const [showConfetti, setShowConfetti] = useState(false)
  const [showDarkAnimation, setShowDarkAnimation] = useState(false)
  const getInitialTime = () => Math.max(10, 40 - (actionPlans.length * 3))
  const [timeLeft, setTimeLeft] = useState(getInitialTime())
  const [timeUpCount, setTimeUpCount] = useState(0)
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set())
  const [fieldAnimations, setFieldAnimations] = useState<{ [key: string]: boolean }>({})
  const [animationTimer, setAnimationTimer] = useState<NodeJS.Timeout | null>(null)

  // タイマーの色
  const getTimeColor = (timeLeft: number, timeUpCount: number) => {
    if (timeLeft <= 10) return "text-red-500 font-bold"
    if (timeUpCount === 0) return "text-green-500"
    if (timeUpCount === 1) return "text-amber-800"
    if (timeUpCount === 2) return "text-orange-700"
    if (timeUpCount === 3) return "text-red-700"
    if (timeUpCount >= 4) return "text-red-600"
    return "text-green-500"
  }

  // タイマー
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          setTimeUpCount((prev) => prev + 1)
          setShowDarkAnimation(true)
          onTimeUp()

          setTimeout(() => {
            setShowDarkAnimation(false)
          }, 1000)

          setTimeout(() => {
            setTimeLeft(getInitialTime())
          }, 100)

          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onTimeUp])

  useEffect(() => {
    return () => {
      if (animationTimer) {
        clearTimeout(animationTimer)
      }
    }
  }, [animationTimer])

  const handleInputChange = (field: keyof ActionPlan, value: string) => {
    const previousValue = currentPlan[field] || ""
    setCurrentPlan((prev) => ({ ...prev, [field]: value }))

    // 入力が完了した時（空から文字が入力された時）に草エフェクト
    if (previousValue === "" && value.trim() !== "") {
      const animationKey = `field-${field}`
      setFieldAnimations((prev) => ({ ...prev, [animationKey]: true }))

      if (animationTimer) {
        clearTimeout(animationTimer)
      }

      const newTimer = setTimeout(() => {
        setFieldAnimations({})
      }, 1000)
      setAnimationTimer(newTimer)
    }
  }

  const handleAdd = () => {
    if (currentPlan.when.trim() || currentPlan.action.trim() || currentPlan.motivation.trim()) {
      onActionPlanAdd(currentPlan.when, currentPlan.action, currentPlan.motivation)
      setCurrentPlan({ when: "", action: "", motivation: "" })
      setCompletedFields(new Set())
      setShowConfetti(true)
      setTimeLeft(Math.max(10, 40 - ((actionPlans.length + 1) * 3)))
      setTimeout(() => {
        setShowConfetti(false)
      }, 1000)
    }
  }

  const hasValidPlan = currentPlan.when.trim() !== "" || currentPlan.action.trim() !== "" || currentPlan.motivation.trim() !== ""
  const isGoldenPlan = () => (actionPlans.length + 1) % 3 === 0

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/background-bright-forest-road.png"
          alt="行動プラン背景"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      {/* Confetti Canvas Animation */}
      <ConfettiCanvas
        isActive={showConfetti}
        duration={1000}
        particleCount={50}
        points={
          completedFields.has("when") && !completedFields.has("action")
            ? 100
            : completedFields.has("action") && completedFields.size === 2
              ? 200
              : isGoldenPlan()
                ? 900
                : 600
        }
      />

      {/* Dark Animation Canvas - タイムアップ時 */}
      <DarkAnimationCanvas isActive={showDarkAnimation} duration={1000} />

      <div className="relative z-10 max-w-3xl w-full space-y-6">
        <div className="bg-white bg-opacity-95 rounded-xl p-8 shadow-2xl">
          {/* ヘッダー */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-green-600 text-lg font-bold">行動プラン作成</div>
            <div className={`text-2xl font-extrabold ${getTimeColor(timeLeft, timeUpCount)}`}>
              ⏱️残り時間: {timeLeft}秒
            </div>
            <div className="text-green-600 text-3xl font-extrabold">🏆{totalPoints}pt</div>
          </div>

          <h1 className="text-3xl font-bold text-green-800 mb-2 text-center">行動プランを作成しましょう</h1>
          <p className="text-lg text-green-600 mb-6 text-center">具体的にあなたの価値観通りの行動を考えておきましょう。</p>

          {/* 選択された価値観 */}
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-bold text-green-800 mb-3">💎 あなたが選んだ価値観</h2>
            <div className="space-y-2">
              {selectedAnswers.map((answer, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-white rounded-md">
                  <span className="bg-green-500 text-white font-bold min-w-[28px] h-7 rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  <span className="text-green-900 font-medium">{answer}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 行動プラン入力フォーム */}
          <div
            className={`rounded-lg p-6 mb-6 ${
              isGoldenPlan()
                ? "bg-gradient-to-br from-yellow-50 via-yellow-100 to-amber-50 border-4 border-yellow-400 shadow-xl shadow-yellow-400/50 animate-pulse"
                : "bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 border-2 border-blue-200 shadow-lg"
            } transition-all duration-500`}
          >
            <h2
              className={`text-xl font-bold mb-4 ${
                isGoldenPlan() ? "text-yellow-800" : "text-blue-800"
              }`}
            >
              🎯 新しい行動プラン
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">いつ？</label>
                <div className="flex gap-2">
                  <div className={`relative transition-all duration-500 flex-1 ${fieldAnimations['field-when'] ? "bg-green-50 rounded-lg p-1" : ""}`}>
                    {fieldAnimations['field-when'] && (
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-green-500 text-xl z-10 animate-bounce">
                        🌿
                      </span>
                    )}
                    <Input
                      type="text"
                      placeholder="例：毎朝起きたとき、仕事が終わったら"
                      value={currentPlan.when}
                      onChange={(e) => handleInputChange("when", e.target.value)}
                      className={`w-full ${fieldAnimations['field-when'] ? "border-green-400 shadow-lg" : ""}`}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (currentPlan.when.trim() && !completedFields.has("when")) {
                        onFieldComplete()
                        setCompletedFields((prev) => new Set(prev).add("when"))
                        setShowConfetti(true)
                        setTimeout(() => setShowConfetti(false), 1000)
                      }
                    }}
                    disabled={!currentPlan.when.trim() || completedFields.has("when")}
                    className={`px-4 py-2 text-sm font-medium ${
                      completedFields.has("when")
                        ? "bg-green-500 text-white cursor-default"
                        : !currentPlan.when.trim()
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {completedFields.has("when") ? "✓" : "回答する"}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">どんな行動？</label>
                <div className="flex gap-2">
                  <div className={`relative transition-all duration-500 flex-1 ${fieldAnimations['field-action'] ? "bg-green-50 rounded-lg p-1" : ""}`}>
                    {fieldAnimations['field-action'] && (
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-green-500 text-xl z-10 animate-bounce">
                        🌿
                      </span>
                    )}
                    <Input
                      type="text"
                      placeholder="例：5分間瞑想する、感謝の気持ちを書く"
                      value={currentPlan.action}
                      onChange={(e) => handleInputChange("action", e.target.value)}
                      className={`w-full ${fieldAnimations['field-action'] ? "border-green-400 shadow-lg" : ""}`}
                      disabled={!completedFields.has("when")}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (currentPlan.action.trim() && !completedFields.has("action")) {
                        setTotalPoints((prev) => prev + 200)
                        setCompletedFields((prev) => new Set(prev).add("action"))
                        setShowConfetti(true)
                        setTimeout(() => setShowConfetti(false), 1000)
                      }
                    }}
                    disabled={!currentPlan.action.trim() || completedFields.has("action") || !completedFields.has("when")}
                    className={`px-4 py-2 text-sm font-medium ${
                      completedFields.has("action")
                        ? "bg-green-500 text-white cursor-default"
                        : !currentPlan.action.trim() || !completedFields.has("when")
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {completedFields.has("action") ? "✓" : "回答する"}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">その行動をしたくないときに、自分になんと声をかける？</label>
                <Input
                  type="text"
                  placeholder="例：これをやった方がもっと成長できるよ"
                  value={currentPlan.motivation}
                  onChange={(e) => handleInputChange("motivation", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <Button
              onClick={handleAdd}
              disabled={!hasValidPlan}
              className={`w-full mt-6 py-4 text-base font-bold ${
                !hasValidPlan
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : isGoldenPlan()
                    ? "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-white animate-pulse hover:animate-none shadow-xl shadow-yellow-500/50 border-2 border-yellow-300 hover:border-yellow-100 transform hover:scale-105"
                    : "bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800 text-white animate-pulse hover:animate-none shadow-xl shadow-green-500/50 border-2 border-green-400 hover:border-green-200 transform hover:scale-105"
              } transition-all duration-300 rounded-xl`}
            >
              <span className="flex items-center justify-center gap-2">
                <span>追加する</span>
                <span className="text-sm">
                  {isGoldenPlan() ? "+900pt 🏆" : "+600pt"}
                </span>
              </span>
            </Button>
          </div>

          {/* 完了ボタン */}
          <Button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white py-8 text-2xl font-extrabold mb-4 shadow-2xl shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
          >
            行動プランを書き終えた（次のステージへ）
          </Button>

          {/* 作成済みの行動プラン */}
          {actionPlans.length > 0 && (
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-green-800 mb-4">✅ 作成済みの行動プラン</h2>
              <div className="space-y-3">
                {actionPlans.map((plan, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <span className="bg-blue-500 text-white font-bold min-w-[28px] h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-1 text-sm">
                        <p className="text-gray-700">
                          <span className="font-bold text-blue-700">いつ:</span> {plan.when || "未入力"}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-bold text-blue-700">行動:</span> {plan.action || "未入力"}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-bold text-blue-700">なぜ:</span> {plan.motivation || "未入力"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 終了ボタン */}
          <Button
            onClick={onExit}
            className="w-full text-green-600 bg-transparent hover:text-green-700 hover:bg-green-50 border-0"
          >
            終了
          </Button>
        </div>
      </div>
    </div>
  )
}

const QuizGame = () => {
  const router = useRouter()
  const [gameState, setGameState] = useState<"intro" | "prestart" | "quiz" | "summary" | "action" | "result">("intro")
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
  const [hasSubmittedGameData, setHasSubmittedGameData] = useState(false)
  // 新しいステート：価値観選択と行動プラン
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([])
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

    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause()
      }
    }
  }, [gameState, isMuted])

  // user_idとsession_idの初期化
  useEffect(() => {
    // user_id: localStorageから取得、なければ生成して保存
    let storedUserId = localStorage.getItem("quiz_user_id")
    if (!storedUserId) {
      storedUserId = crypto.randomUUID()
      localStorage.setItem("quiz_user_id", storedUserId)
    }
    setUserId(storedUserId)

    // session_id: 毎回新規生成
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
    // 現在の回答を保存してからサマリーページ（価値観選択）へ移行
    playSoundEffect("/sound/gamefinish.mp3")
    const currentAnswers = userAnswers.filter((answer) => answer.trim() !== "")
    if (currentAnswers.length > 0) {
      setAllUserAnswers((prev) => [...prev, currentAnswers])
    }
    setGameState("summary")
  }

  const handleDirectToAffiliate = () => {
    setGameState("result")
  }

  const handleTimeUp = () => {
    playSoundEffect("/sound/timeup.mp3")
    setTotalPoints((prev) => prev - 50)
  }


  // 価値観選択のハンドラー
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers((prev) => {
      if (prev.includes(answer)) {
        // 既に選択されていれば削除
        return prev.filter((a) => a !== answer)
      } else if (prev.length < 3) {
        // 最大3つまで選択可能
        return [...prev, answer]
      }
      return prev
    })
  }

  // 価値観選択から行動プランページへ進む
  const handleContinueToAction = () => {
    playSoundEffect("/sound/300ptnextpage.mp3")
    setGameState("action")
  }

  // フィールド完了時に100pt追加
  const handleFieldComplete = () => {
    playSoundEffect("/sound/100pt.mp3")
    setTotalPoints((prev) => prev + 100)
  }

  // 行動プランの追加ハンドラー（3回に1回は900pt、それ以外は600pt）
  const handleActionPlanAdd = (when: string, action: string, motivation: string) => {
    playSoundEffect("/sound/100pt.mp3")
    setActionPlans((prev) => [...prev, { when, action, motivation }])
    const isGolden = (actionPlans.length + 1) % 3 === 0
    setTotalPoints((prev) => prev + (isGolden ? 900 : 600))
  }

  // 行動プランから最終ページへ
  const handleActionComplete = () => {
    playSoundEffect("/sound/gamefinish.mp3")
    setGameState("result")
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
          userId={userId}
          sessionId={sessionId}
          gender={gender}
          ageGroup={ageGroup}
          onSetHasSubmittedGameData={setHasSubmittedGameData}
          playSoundEffect={playSoundEffect}
        />
      )}
      {gameState === "summary" && (
        <SummaryPage
          key="summary"
          allUserAnswers={allUserAnswers}
          selectedAnswers={selectedAnswers}
          onAnswerSelect={handleAnswerSelect}
          onContinue={handleContinueToAction}
          onExit={handleDirectToAffiliate}
        />
      )}
      {gameState === "action" && (
        <ActionPlanPage
          key="action"
          selectedAnswers={selectedAnswers}
          actionPlans={actionPlans}
          totalPoints={totalPoints}
          setTotalPoints={setTotalPoints}
          onActionPlanAdd={handleActionPlanAdd}
          onComplete={handleActionComplete}
          onTimeUp={handleTimeUp}
          onExit={handleDirectToAffiliate}
          onFieldComplete={handleFieldComplete}
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
