"use client"
import { useState, useEffect, useCallback } from "react" // ← useStateを追加
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

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
    headline: "「モテる要因一位の親切な自分に変われる、メンタルヘルスをよくするのが一番の自分磨き。 」",
    description:
      "洋服や化粧水などで大きくかわれましたか？変われたならこの文章は読まなくて大丈夫。大きな要因をつぶしていないと、いくら表面をきれいにしても結果は出ないでしょう。洋服一着くらいの値段を同じようにかけて、大きな成果を出すのはメンタルヘルスを直すことです。メンタルヘルスはいらいらしていない自分になり、やさしくなるので、モテる要因一位の親切さをより進化させます。やさしくするだけのクリニックが多い中、心理学のマスター（公認心理士（国家資格））しか在籍していないクリニックがあります。学問的な知識であなたにアドバイスをします。今日のあなたが一番若く治ったら、明日からのあなたはもっと楽しい時間になるのだから、今日行動したら一番いいですよね？あなたの人生がいいものになるなら何でもお金をかける価値があります。オンラインなので家のソファーで受けられますよ。",
  },
  {
    headline: "SNSやゲームが救ってくれると信じて何年経ちましたか？あなたの人生を楽にする方法",
    description:
      "SNSやゲームはかえって疲れることが科学的にわかっています（ドーパミン疲れ、情報過多）。また理系は、テクノロジーに執着する傾向が進化論的にあります。この事実から逃げたらまた同じ人生を明日以降も送ることでしょう。ゲーム一個買うのをやめる、一時間ティックトックを見るのをやめる。これらで作ったリソースで　イライラしてない自分を買うのです。やさしいだけカウンセリングではなく、心理学の国家資格公認心理士が100％のこのクリニックを予約してください。さらにオンラインなので家のソファーで受けられますよ。",
  },
  {
    headline:
      "あなたが心理学を利用したこのゲームで一瞬で変われたように 、学問的カウンセリングで一瞬でキラキラした人になれます。",
    description:
      "カウンセリングは優しくしてくれるだけのところではありません。心理学という学問を学ぶ学校でもあります。心理学のマスターしか在籍していない、クリニックがあります。他のクリニックはやさしさに特化した人もいるところが多いです。今日のあなたが一番若く治ったら、明日からのあなたはもっと楽しい時間になるのだから、今日行動したら一番いいですよね？あなたの人生がいいものになるなら何でもお金をかける価値があります。オンラインなので家のソファーで受けられますよ。",
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

const AffiliateComponent = ({ className = "", affiliateTextPattern }: { className?: string; affiliateTextPattern?: any }) => {
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

const IntroPage = ({ onStart }: { onStart: () => void }) => {
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
          src="/image/background-bright-forest-road.png?height=1080&width=1920"
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
          1問20秒です。直感で答えてみましょう！ではいってらっしゃい！（※完全無料です。）
        </p>

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
                    className="w-5 h-5 rounded border-2 border-white cursor-pointer"
                  />
                  <span className="text-white">同意する</span>
                </label>
              </div>

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
  const [timeLeft, setTimeLeft] = useState(20)
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
            setTimeLeft(20)
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
        setTimeLeft(20) // タイマーをリセット
      }, 150)
    }, 800)
  }

  // handleSubmitLocal関数の前に、回答が有効かどうかをチェックする関数を追加
  const hasValidAnswers = userAnswers.some((answer) => answer.trim() !== "")

  return (
    <div className="relative w-full h-screen flex flex-col">
      {/* Confetti Canvas Animation */}
      <ConfettiCanvas isActive={showFlash} duration={2000} particleCount={50} />

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
          <div className="bg-white bg-opacity-90 rounded-b-lg p-4">
            <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-2">
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
          </div>

          {/* クイズ質問 */}
          <div className="bg-white bg-opacity-90 rounded-lg p-8 mb-4">
            <div className="flex items-center justify-center gap-3">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center leading-tight">
                {generateQuestionText(currentQuiz, allUserAnswers)}
              </h2>
              <button
                onClick={() => setIsHelpOpen(true)}
                className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors shadow-lg"
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
            {/* アフィリエイト画像 - 回答欄の左下 */}
            <div className="flex justify-end mt-4 mb-2">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: `<a href="https://px.a8.net/svt/ejp?a8mat=45167E+679KMQ+5OI8+5ZEMP" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www27.a8.net/svt/bgt?aid=250317482375&wid=001&eno=01&mid=s00000026504001005000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=45167E+679KMQ+5OI8+5ZEMP" alt="">` 
                }}
              />
            </div>

            {/* 終えるボタンと次へボタンを最下部に配置 */}
            <div className="mt-auto pt-16">
              <div className="space-y-8">
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

                <div className="pt-12">
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
}: {
  totalPoints: number
  selectedAnswers: string[]
  actionPlans: ActionPlan[]
  onRestart: () => void
  onExit: () => void
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

      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.log("Supabase環境変数が設定されていないため、データ保存をスキップします")
        setHasSubmitted(true)
        setIsSubmitting(false)

        if (shouldRedirect && redirectUrl) {
          setTimeout(() => {
            window.open(redirectUrl, "_blank")
          }, 200)
        }
      } else {
        supabase!.from("quiz_responses").insert({
          total_points: totalPoints,
          affiliate_pattern_index: affiliatePatternIndex,
          affiliate_clicked: true,
          affiliate_click_type: clickData?.clickType || "unknown",
          selected_values: selectedAnswers,
          action_plans: actionPlans.map(plan => plan.action).filter(action => action.trim() !== ""),
          enjoyment_rating: null,
          improvement_rating: null,
        }).then(({ error }) => {
          if (error) {
            console.error("データの保存に失敗しました:", error)
          } else {
            console.log("データが正常に保存されました")
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
    [isSubmitting, hasSubmitted, totalPoints, affiliatePatternIndex, selectedAnswers, actionPlans],
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
          src="/image/background-bright-forest-road.png?height=1080&width=1920"
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

          <div className="text-4xl font-bold text-green-700 mb-3">🏆 合計ポイント: {totalPoints}pt</div>
          <div className="text-xl font-bold text-green-300 mb-3">🏆1200pt/全国平均</div>


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

          {/* アフィリエイト部分を同じカード内に統合 */}
          <div className="mt-8 pt-8 border-t-2 border-gray-200">
            <h2 className="text-2xl font-bold text-orange-600 mt-8">{affiliateTextPattern.headline}</h2>

            <div className="text-center">
              <AffiliateComponent className="mx-auto" affiliateTextPattern={affiliateTextPattern} />
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
          src="/image/background-bright-forest-road.png?height=1080&width=1920"
          alt="価値観選択背景"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      {/* Confetti Canvas Animation */}
      <ConfettiCanvas isActive={showConfetti} duration={1000} particleCount={30} />

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
  onActionPlanAdd,
  onComplete,
  onTimeUp,
}: {
  selectedAnswers: string[]
  actionPlans: ActionPlan[]
  totalPoints: number
  onActionPlanAdd: (when: string, action: string, motivation: string) => void
  onComplete: () => void
  onTimeUp: () => void
}) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [currentPlan, setCurrentPlan] = useState<ActionPlan>({ when: "", action: "", motivation: "" })
  const [showConfetti, setShowConfetti] = useState(false)
  const [showDarkAnimation, setShowDarkAnimation] = useState(false)
  const [timeLeft, setTimeLeft] = useState(40)
  const [timeUpCount, setTimeUpCount] = useState(0)

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
            setTimeLeft(40)
          }, 100)

          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onTimeUp])

  const handleInputChange = (field: keyof ActionPlan, value: string) => {
    setCurrentPlan((prev) => ({ ...prev, [field]: value }))
  }

  const handleAdd = () => {
    if (currentPlan.when.trim() || currentPlan.action.trim() || currentPlan.motivation.trim()) {
      onActionPlanAdd(currentPlan.when, currentPlan.action, currentPlan.motivation)
      setCurrentPlan({ when: "", action: "", motivation: "" })
      setShowConfetti(true)
      setTimeLeft(40) // タイマーリセット
      setTimeout(() => {
        setShowConfetti(false)
      }, 1000)
    }
  }

  const hasValidPlan = currentPlan.when.trim() !== "" || currentPlan.action.trim() !== "" || currentPlan.motivation.trim() !== ""

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/background-bright-forest-road.png?height=1080&width=1920"
          alt="行動プラン背景"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      {/* Confetti Canvas Animation */}
      <ConfettiCanvas isActive={showConfetti} duration={1000} particleCount={50} />

      {/* Dark Animation Canvas - タイムアップ時 */}
      <DarkAnimationCanvas isActive={showDarkAnimation} duration={1000} />

      <div className="relative z-10 max-w-3xl w-full space-y-6">
        <div className="bg-white bg-opacity-95 rounded-xl p-8 shadow-2xl">
          {/* ヘッダー */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-green-600 text-sm font-medium">行動プラン作成</div>
            <div className={`text-sm font-medium ${getTimeColor(timeLeft, timeUpCount)}`}>
              ⏱️残り時間: {timeLeft}秒
            </div>
            <div className="text-green-600 text-sm font-bold">🏆{totalPoints}pt</div>
          </div>

          <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">行動プランを作成しましょう</h1>

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
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-blue-800 mb-4">🎯 新しい行動プラン</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">いつ？</label>
                <Input
                  type="text"
                  placeholder="例：毎朝起きたとき、仕事が終わったら"
                  value={currentPlan.when}
                  onChange={(e) => handleInputChange("when", e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">どんな行動？</label>
                <Input
                  type="text"
                  placeholder="例：5分間瞑想する、感謝の気持ちを書く"
                  value={currentPlan.action}
                  onChange={(e) => handleInputChange("action", e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">なぜ？</label>
                <Input
                  type="text"
                  placeholder="例：心を落ち着けるため、前向きな気持ちになるため"
                  value={currentPlan.motivation}
                  onChange={(e) => handleInputChange("motivation", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <Button
              onClick={handleAdd}
              disabled={!hasValidPlan}
              className={`w-full mt-4 py-3 text-lg font-bold ${
                hasValidPlan
                  ? "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            >
              追加する
            </Button>
          </div>

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

          {/* 完了ボタン */}
          <Button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white py-4 text-lg font-bold"
          >
            行動プランの最終ページへ
          </Button>
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
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/background-bright-forest-road.png?height=1080&width=1920"
          alt="アンケート背景"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      <div className="relative z-10 max-w-2xl w-full space-y-6">
        <div className="text-center bg-white bg-opacity-95 rounded-xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-green-800 mb-8">フィードバックをお聞かせください</h1>

          <div className="space-y-8">
            <div className="bg-white bg-opacity-90 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                このゲームはどれくらい楽しかったですか？ (1: 全く楽しくなかった - 10: 非常に楽しかった)
              </h3>
              <input
                type="range"
                min="1"
                max="10"
                value={enjoymentRating}
                onChange={(e) => setEnjoymentRating(Number.parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                aria-label="楽しさの評価"
              />
              <p className="text-center text-gray-600">{enjoymentRating}</p>
            </div>

            <div className="bg-white bg-opacity-90 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                このゲームはあなたの心の状態を改善するのにどれくらい役立ちましたか？ (1: 全く役立たなかった - 10:
                非常に役立った)
              </h3>
              <input
                type="range"
                min="1"
                max="10"
                value={improvementRating}
                onChange={(e) => setImprovementRating(Number.parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                aria-label="改善効果の評価"
              />
              <p className="text-center text-gray-600">{improvementRating}</p>
            </div>
          </div>

          <Button onClick={onSubmit} className="mt-8 bg-green-500 hover:bg-green-600 text-white px-8 py-3 w-full">
            送信して結果を見る
          </Button>
        </div>
      </div>
    </div>
  )
}

const QuizGame = () => {
  const router = useRouter()
  const [gameState, setGameState] = useState<"intro" | "quiz" | "summary" | "action" | "survey" | "result">("intro")
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>([""])
  const [allUserAnswers, setAllUserAnswers] = useState<string[][]>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [enjoymentRating, setEnjoymentRating] = useState(5)
  const [improvementRating, setImprovementRating] = useState(5)
  // 新しいステート：価値観選択と行動プラン
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([])

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
      setTotalPoints((prev) => prev + pointsToAdd)
    } else {
      setGameState("survey")
    }
  }

  const handleEndQuiz = () => {
    // 現在の回答を保存してからサマリーページ（価値観選択）へ移行
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
    setTotalPoints((prev) => prev - 50)
  }

  const handleSurveySubmit = () => {
    // アンケート結果をSupabaseに保存
    if (supabase) {
      supabase.from("quiz_responses").insert({
        total_points: totalPoints,
        affiliate_pattern_index: 0,
        affiliate_clicked: false,
        affiliate_click_type: "survey_completion",
        user_answers: allUserAnswers,
        enjoyment_rating: enjoymentRating,
        improvement_rating: improvementRating,
      }).then(({ error }) => {
        if (error) {
          console.error("アンケートデータの保存に失敗しました:", error)
        } else {
          console.log("アンケートデータが正常に保存されました")
        }
      })
    }
    
    setGameState("result")
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
    setGameState("action")
  }

  // 行動プランの追加ハンドラー
  const handleActionPlanAdd = (when: string, action: string, motivation: string) => {
    setActionPlans((prev) => [...prev, { when, action, motivation }])
  }

  // 行動プランから最終ページへ（アンケートページへ変更）
  const handleActionComplete = () => {
    setGameState("survey")
  }

  const handleRestart = () => {
    setGameState("intro")
    setCurrentQuiz(0)
    setUserAnswers([""])
    setAllUserAnswers([])
    setTotalPoints(0)
    setEnjoymentRating(5)
    setImprovementRating(5)
    setSelectedAnswers([])
    setActionPlans([])
  }

  const handleExit = () => {
    router.push("/")
  }

  return (
    <AnimatePresence mode="wait">
      {gameState === "intro" && <IntroPage key="intro" onStart={() => setGameState("quiz")} />}
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
        />
      )}
      {gameState === "summary" && (
        <SummaryPage
          key="summary"
          allUserAnswers={allUserAnswers}
          selectedAnswers={selectedAnswers}
          onAnswerSelect={handleAnswerSelect}
          onContinue={handleContinueToAction}
          onExit={handleExit}
        />
      )}
      {gameState === "action" && (
        <ActionPlanPage
          key="action"
          selectedAnswers={selectedAnswers}
          actionPlans={actionPlans}
          totalPoints={totalPoints}
          onActionPlanAdd={handleActionPlanAdd}
          onComplete={handleActionComplete}
          onTimeUp={handleTimeUp}
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
          totalPoints={totalPoints}
          selectedAnswers={selectedAnswers}
          actionPlans={actionPlans}
          onRestart={handleRestart}
          onExit={handleExit}
        />
      )}
    </AnimatePresence>
  )
}

export default QuizGame
