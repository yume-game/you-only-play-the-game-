"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { Leaf, Wind, Target, Clock, Plus, ArrowRight, Star, Award, Diamond } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { TermsOfService } from "@/components/terms-of-service/terms-of-service"

// Supabaseクライアントの設定（Pervasiveness用プロジェクト）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_PERVASIVENESS
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PERVASIVENESS

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL_PERVASIVENESS === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL_PERVASIVENESS.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PERVASIVENESS === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PERVASIVENESS.length > 0

type Quiz = {
  question: string
  画像: {
    メイン: string[] // 5つのパターンの背景画像
    オーバーレイ: string
  }
}

const quizzes: Quiz[] = [
  {
    question:
      "あなたの身の回りにあるものをなんでもいいので書いてください。イスやペン本当になんでもいいです。（より楽にするため）",
    画像: {
      メイン: [
        "/image/background-firstroom.png",
        "/image/background-blue-sky.png",
        "/image/baclground-bright-forest-road.png",
        "/image/background-cat-reaf.png",
        "/image/background-reaf-road.png",
      ],
      オーバーレイ: "/image/very-black-opponent.png",
    },
  },
  {
    question: "それらに対して感謝を伝えるとしたらなんといいますか？（よりあなたが楽になるため）",
    画像: {
      メイン: [
        "/image/background-firstroom.png",
        "/image/background-blue-sky.png",
        "/image/baclground-bright-forest-road.png",
        "/image/background-cat-reaf.png",
        "/image/background-reaf-road.png",
      ],
      オーバーレイ: "/image/very-black-opponent.png",
    },
  },
  {
    question: "あなたが大事だと思う人や者は何ですか？（さらに視野が広がるため）",
    画像: {
      メイン: [
        "/image/background-firstroom.png",
        "/image/background-blue-sky.png",
        "/image/baclground-bright-forest-road.png",
        "/image/background-cat-reaf.png",
        "/image/background-reaf-road.png",
      ],
      オーバーレイ: "/image/usual-opponent.png",
    },
  },
  {
    question:
      "それらの考えうる最悪の状況を考えてください。そのストーリーを書いてみましょう。（つらいでしょうが、視野を広げるため一回書いて、次のクイズまでみてください）",
    画像: {
      メイン: [
        "/image/background-firstroom.png",
        "/image/background-blue-sky.png",
        "/image/baclground-bright-forest-road.png",
        "/image/background-cat-reaf.png",
        "/image/background-reaf-road.png",
      ],
      オーバーレイ: "/image/usual-opponent.png",
    },
  },
  {
    question:
      "それらに対して感謝を伝えるとしたらなんといいますか？生きててくれてありがとうなど（さらに視野が広がるため）",
    画像: {
      メイン: [
        "/image/background-firstroom.png",
        "/image/background-blue-sky.png",
        "/image/baclground-bright-forest-road.png",
        "/image/background-cat-reaf.png",
        "/image/background-reaf-road.png",
      ],
      オーバーレイ: "/image/usual-opponent.png",
    },
  },
  {
    question:
      "あなたの国では当たり前なことはどんなものがありますか？治安がいいなどなんでもいいです。貧しい国との比較など（よりあなたが楽になるため）",
    画像: {
      メイン: [
        "/image/background-firstroom.png",
        "/image/background-blue-sky.png",
        "/image/baclground-bright-forest-road.png",
        "/image/background-cat-reaf.png",
        "/image/background-reaf-road.png",
      ],
      オーバーレイ: "/image/white-opponent.png",
    },
  },
  {
    question: "それらに対して感謝を伝えるとしたらなんといいますか？（より楽にするため）",
    画像: {
      メイン: [
        "/image/background-firstroom.png",
        "/image/background-blue-sky.png",
        "/image/baclground-bright-forest-road.png",
        "/image/background-cat-reaf.png",
        "/image/background-reaf-road.png",
      ],
      オーバーレイ: "/image/white-opponent.png",
    },
  },
  {
    question:
      "あなたを構成している体の部分、あなたの自分を支えてきたことはなんですか？胃や口や足などなんでもいいです。（あなたがめっちゃ楽になるため）",
    画像: {
      メイン: [
        "/image/background-firstroom.png",
        "/image/background-blue-sky.png",
        "/image/baclground-bright-forest-road.png",
        "/image/background-cat-reaf.png",
        "/image/background-reaf-road.png",
      ],
      オーバーレイ: "/image/very-white-opponent.png",
    },
  },
  {
    question: "それらに対して感謝を伝えるとしたらなんといいますか？（あなたがめっちゃ楽になるため）",
    画像: {
      メイン: [
        "/image/background-firstroom.png",
        "/image/background-blue-sky.png",
        "/image/baclground-bright-forest-road.png",
        "/image/background-cat-reaf.png",
        "/image/background-reaf-road.png",
      ],
      オーバーレイ: "/image/very-white-opponent.png",
    },
  },
]

const MAX_POINTS_PER_QUIZ = 1600
const TARGET_PERCENTAGE = 0.8
const TARGET_POINTS = Math.floor(MAX_POINTS_PER_QUIZ * TARGET_PERCENTAGE)
const MAX_ANSWERS = 20

// ポイントに応じた背景パターンのインデックスを取得する関数
const getBackgroundPatternIndex = (points: number): number => {
  if (points >= MAX_POINTS_PER_QUIZ) return 4 // 満点
  if (points >= 3000) return 3
  if (points >= 1500) return 2
  if (points >= 500) return 1
  return 0 // デフォルト
}

const getTimeLimit = (answerIndex: number): number => {
  if (answerIndex < 3) return 20
  if (answerIndex < 6) return 15
  if (answerIndex < 9) return 10
  return 5
}

// アフィリエイト用のテキストパターン
const affiliateTextPatterns = [
  {
    headline: "<span class='text-red-600 text-5xl'>モテる</span>要因一位の親切な自分に変われる、メンタルヘルスをよくするのが一番の自分<span class='text-red-600 text-5xl'>磨き</span>。",
    description:
      "洋服や化粧水などで大きくかわれましたか？変われたならこの文章は読まなくて大丈夫。大きな要因をつぶしていないと、いくら表面をきれいにしても結果は出ないでしょう。洋服一着くらいの値段を同じようにかけて、大きな成果を出すのはメンタルヘルスを直すことです。メンタルヘルスはいらいらしていない自分になり、やさしくなるので、<span class='text-red-600 text-3xl'>モテる</span>要因一位の親切さをより進化させます。やさしくする<span class='text-red-600 text-3xl'>だけのところではありません</span>、心理学のマスター（公認心理士（国家資格））しか在籍していないクリニックがあります。学問的な知識であなたにアドバイスをします。今日のあなたが一番若く治ったら、明日からのあなたはもっと<span class='text-red-600 text-3xl'>楽にする</span>時間になるのだから、今日行動したら一番いいですよね？あなたの人生がいいものになるなら何でもお金をかける価値があります。オンラインなので家のソファーで受けられますよ。",
  },
  {
    headline: "あなたの人生を<span class='text-red-600 text-5xl'>楽にする</span>SNS、ゲーム以外の方法",
    description:
      "SNSやゲームはかえって疲れることが科学的にわかっています（ドーパミン疲れ、情報過多）。また理系は、テクノロジーに執着する傾向が進化論的にあります。この事実から逃げたらまた同じ人生を明日以降も送ることでしょう。ゲーム一個買うのをやめる、一時間ティックトックを見るのをやめる。これらで作ったリソースで　イライラしてない自分を買うのです。やさしい<span class='text-red-600 text-3xl'>だけのところではありません</span>カウンセリングではなく、心理学の国家資格公認心理士が100％のこのクリニックを予約してください。さらにオンラインなので家のソファーで受けられますよ。",
  },
  {
    headline: "あなたが心理学を利用したこのゲームで一瞬で変われたように 、学問的カウンセリングで一瞬でキラキラした人になれます。",
    description:
      "カウンセリングは優しくしてくれる<span class='text-red-600 text-3xl'>だけのところではありません</span>。心理学という学問を学ぶ学校でもあります。心理学のマスターしか在籍していない、クリニックがあります。他のクリニックはやさしさに特化した人もいるところが多いです。今日のあなたが一番若く治ったら、明日からのあなたはもっと<span class='text-red-600 text-3xl'>楽にする</span>時間になるのだから、今日行動したら一番いいですよね？あなたの人生がいいものになるなら何でもお金をかける価値があります。オンラインなので家のソファーで受けられますよ。",
  },
  {
    headline: "女の子から話しかけられる<span class='text-red-600 text-5xl'>男磨き</span>。",
    description:
      "あなたは怒りっぽい人に話しかけたくなりますか？話しかけたくなる人は総じてめちゃくちゃメンタルの状態がいいです。さらにあなたを高めるため、やさしさではなく直す理論を得ましょう。あなたがこのゲームで簡単に変われたのは心理学のたまものです。全員が心理学の国家資格を持ったクリニック以外には行かないでください。かといって足を運ぶのはめんどくさいので簡単にお家のソファーなどで受けられるクリニックを張っておきます。",
  },
]

// アフィリエイト画像コンポーネント（afi.htmlの内容をそのまま使用）
const AffiliateComponent = ({ className = "", affiliateTextPattern }: { className?: string; affiliateTextPattern?: any }) => {
   
  // afi.htmlの内容をそのまま定数として定義
  const affiliateHtml = `<a href="https://px.a8.net/svt/ejp?a8mat=45167E+679KMQ+5OI8+5ZEMP" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www27.a8.net/svt/bgt?aid=250317482375&wid=001&eno=01&mid=s00000026504001005000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=45167E+679KMQ+5OI8+5ZEMP" alt="">`

  return (
    <div className={`w-full mx-auto mt-2 mb-2 ${className}`}>
      {/* アフィリエイト広告ヘッドライン */}
      {affiliateTextPattern && (
        <h2 className="text-4xl font-bold text-orange-600 mt-8 mb-4 text-center" dangerouslySetInnerHTML={{ __html: affiliateTextPattern.headline }}></h2>
      )}
      
      <div 
        style={{
          fontFamily: "'Hiragino Sans', 'Yu Gothic', sans-serif",
          margin: 0,
          padding: "10px",
          backgroundColor: "#bbf7d0",
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
            dangerouslySetInnerHTML={{ __html: affiliateTextPattern.description }}
          />
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
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-screen flex flex-col items-center justify-center"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/background-bright-forest-road.png?height=1080&width=1920"
          alt="心の状態"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative z-10 text-center space-y-6 bg-green-700 bg-opacity-70 p-8 rounded-lg max-w-2xl">
        <h1 className="text-4xl font-bold text-white">さあ、ここでつらい思いを軽減させましょう！</h1>
        <p className="text-lg text-white">
          このゲームではいくつかの質問に答えてもらうことで、あなたのメンタルの改善を図ります。　　　多くの質問に答えれるほど、メンタルヘルスの改善が見込めます。
          　　　　　　　　一問20秒です。ではいってらっしゃい！（※完全無料です。）
        </p>

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
                className="w-8 h-8 rounded border-2 border-white cursor-pointer transition-all duration-300 hover:scale-125 hover:border-green-300 checked:scale-110 checked:bg-green-400"
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
      </div>

      {/* 利用規約ポップアップ */}
      <TermsOfService isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </motion.div>
  )
}

const QuizPage = ({
  currentQuiz,
  userAnswers,
  previousAnswers,
  totalPoints,
  isPointsAnimating,
  backgroundPatternIndex,
  onUpdateAnswer,
  onAddAnswerField,
  onSubmit,
  onEndQuiz,
  onTimeUp,
}: {
  currentQuiz: number
  userAnswers: string[]
  previousAnswers: string[]
  totalPoints: number
  isPointsAnimating: boolean
  backgroundPatternIndex: number
  onUpdateAnswer: (index: number, value: string) => void
  onAddAnswerField: () => void
  onSubmit: () => void
  onEndQuiz: () => void
  onTimeUp: () => void
}) => {
  const currentAnswerIndex = userAnswers.length - 1
  const [timeLeft, setTimeLeft] = useState(getTimeLimit(currentAnswerIndex))
  const [overlayOffset, setOverlayOffset] = useState(100) // 初期位置を右側に設定（100px）
  const overlayControls = useAnimation()
  const addButtonControls = useAnimation()
  const submitButtonControls = useAnimation()
  const cardControls = useAnimation()

  const [showFireworks, setShowFireworks] = useState(false)
  const [showFlash, setShowFlash] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showSubmitEffects, setShowSubmitEffects] = useState(false)
  const [showGoldenRays, setShowGoldenRays] = useState(false)
  const [showPointsExplosion, setShowPointsExplosion] = useState(false)

  // 回答するボタンのアニメーション用の参照
  const submitButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          onTimeUp()
          return getTimeLimit(0)
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentAnswerIndex, onTimeUp])

  useEffect(() => {
    setTimeLeft(getTimeLimit(currentAnswerIndex))
  }, [currentAnswerIndex])

  useEffect(() => {
    // 「追加する」ボタンのパルスアニメーション
    if (userAnswers[currentAnswerIndex]?.trim() !== "") {
      addButtonControls.start({
        scale: [1, 1.05, 1],
        boxShadow: ["0 0 0 rgba(34, 197, 94, 0.4)", "0 0 20px rgba(34, 197, 94, 0.6)", "0 0 0 rgba(34, 197, 94, 0.4)"],
        transition: {
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        },
      })
    } else {
      addButtonControls.stop()
    }

    // 「回答する」ボタンのパルスアニメーション
    if (userAnswers.some((answer) => answer.trim() !== "")) {
      submitButtonControls.start({
        scale: [1, 1.02, 1],
        boxShadow: ["0 0 0 rgba(34, 197, 94, 0.4)", "0 0 15px rgba(34, 197, 94, 0.6)", "0 0 0 rgba(34, 197, 94, 0.4)"],
        transition: {
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        },
      })
    } else {
      submitButtonControls.stop()
    }
  }, [userAnswers, currentAnswerIndex, addButtonControls, submitButtonControls])

  const handleAddAnswer = () => {
    // 既存の処理
    onAddAnswerField()
    setTimeLeft(getTimeLimit(currentAnswerIndex + 1))

    // オーバーレイ画像のアニメーション
    overlayControls
      .start({
        x: overlayOffset + 20, // 現在の位置から20px右へ
        transition: { duration: 0.3, ease: "easeOut" },
      })
      .then(() => {
        // アニメーション完了後にオフセットを更新
        setOverlayOffset((prev) => prev + 20)
      })

    // 新しい派手なアニメーション効果
    // フラッシュエフェクト
    setShowFlash(true)
    setTimeout(() => setShowFlash(false), 300)

    // 花火エフェクト
    setShowFireworks(true)
    setTimeout(() => setShowFireworks(false), 1500)

    // 紙吹雪エフェクト
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 2000)
  }

  const handleSubmitClick = () => {
    // カードの振動アニメーション
    cardControls.start({
      scale: [1, 1.02, 0.98, 1.01, 0.99, 1],
      rotate: [0, 0.5, -0.5, 0.3, -0.3, 0],
      transition: { duration: 0.5 },
    })

    // ゴールデンレイエフェクト
    setShowGoldenRays(true)
    setTimeout(() => setShowGoldenRays(false), 2000)

    // ポイント爆発エフェクト
    setShowPointsExplosion(true)
    setTimeout(() => setShowPointsExplosion(false), 2500)

    // 回答するボタンの特殊エフェクト
    setShowSubmitEffects(true)
    setTimeout(() => setShowSubmitEffects(false), 1500)

    // 実際の回答処理を少し遅延させて実行
    setTimeout(() => {
      onSubmit()
    }, 800)
  }

  const handleTyping = (index: number, value: string) => {
    onUpdateAnswer(index, value)
    overlayControls.start({
      x: [overlayOffset, overlayOffset - 2, overlayOffset + 2, overlayOffset - 2, overlayOffset + 2, overlayOffset], // 左右に2ピクセルずつ振動
      transition: { duration: 0.3 },
    })
  }

  // 背景パターンに応じたラベルを表示
  const getBackgroundLabel = () => {
    switch (backgroundPatternIndex) {
      case 1:
        return "良い状態"
      case 2:
        return "とても良い状態"
      case 3:
        return "素晴らしい状態"
      case 4:
        return "完璧な状態"
      default:
        return "初期状態"
    }
  }

  // 回答数に基づいてポイントを計算
  const calculateCurrentPoints = () => {
    return userAnswers.reduce((total, answer, index) => {
      if (answer.trim() !== "") {
        return total + ((index + 1) % 3 === 0 ? 300 : 100)
      }
      return total
    }, 0)
  }

  return (
    <>
      {/* フラッシュエフェクト */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white z-40 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* 花火エフェクト */}
      <AnimatePresence>
        {showFireworks && (
          <motion.div className="fixed inset-0 z-40 pointer-events-none flex items-end justify-center">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: (Math.random() - 0.5) * (typeof window !== "undefined" ? window.innerWidth * 0.8 : 800),
                  y: 0,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: (Math.random() - 0.5) * (typeof window !== "undefined" ? window.innerWidth * 0.8 : 800),
                  y: -(typeof window !== "undefined" ? window.innerHeight * (0.5 + Math.random() * 0.5) : 400),
                  scale: 2 + Math.random() * 2,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.8 + Math.random() * 0.7,
                  ease: "easeOut",
                }}
                className="absolute w-4 h-4 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${
                    ["#FF5252", "#FFD740", "#64FFDA", "#448AFF", "#E040FB"][Math.floor(Math.random() * 5)]
                  } 0%, transparent 70%)`,
                  boxShadow: `0 0 10px 2px ${
                    ["#FF5252", "#FFD740", "#64FFDA", "#448AFF", "#E040FB"][Math.floor(Math.random() * 5)]
                  }`,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 紙吹雪エフェクト */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div className="fixed inset-0 z-40 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x:
                    (typeof window !== "undefined" ? window.innerWidth / 2 : 400) +
                    (Math.random() - 0.5) * (typeof window !== "undefined" ? window.innerWidth : 800),
                  y: typeof window !== "undefined" ? window.innerHeight : 600,
                  opacity: 1,
                  rotate: 0,
                }}
                animate={{
                  x:
                    (typeof window !== "undefined" ? window.innerWidth / 2 : 400) +
                    (Math.random() - 0.5) * (typeof window !== "undefined" ? window.innerWidth * 1.5 : 1200),
                  y: -100,
                  opacity: 0,
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 1 + Math.random() * 1.5,
                  ease: "easeOut",
                }}
                className="absolute w-3 h-3"
                style={{
                  backgroundColor: ["#FF5252", "#FFD740", "#64FFDA", "#448AFF", "#E040FB", "#69F0AE", "#FFAB40"][
                    Math.floor(Math.random() * 7)
                  ],
                  borderRadius: Math.random() > 0.5 ? "50%" : "0%",
                  transform: `scale(${0.5 + Math.random()})`,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 回答するボタンのゴールデンレイエフェクト */}
      <AnimatePresence>
        {showGoldenRays && (
          <motion.div
            className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="absolute w-full h-full"
              style={{
                background: "radial-gradient(circle, rgba(255,215,0,0.6) 0%, rgba(255,215,0,0) 70%)",
              }}
              animate={{
                scale: [1, 2.5],
                opacity: [0.7, 0],
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-yellow-400"
                style={{
                  width: "4px",
                  height: "100px",
                  transformOrigin: "center bottom",
                  rotate: `${i * 30}deg`,
                  bottom: "50%",
                  left: "calc(50% - 2px)",
                  filter: "blur(1px)",
                }}
                animate={{
                  height: ["0px", "300px", "400px"],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeOut",
                  delay: i * 0.05,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ポイント爆発エフェクト */}
      <AnimatePresence>
        {showPointsExplosion && (
          <motion.div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
            {[...Array(Math.min(20, calculateCurrentPoints() / 50))].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  x: (Math.random() - 0.5) * (typeof window !== "undefined" ? window.innerWidth * 0.8 : 800),
                  y: (Math.random() - 0.5) * (typeof window !== "undefined" ? window.innerHeight * 0.8 : 600),
                  scale: 1,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5 + Math.random() * 1,
                  ease: "easeOut",
                  delay: i * 0.05,
                }}
                className="absolute flex items-center justify-center"
              >
                <div className="text-2xl font-bold text-yellow-500 bg-white bg-opacity-80 px-2 py-1 rounded-lg shadow-lg">
                  {i % 3 === 0 ? "+300pt" : "+100pt"}
                </div>
              </motion.div>
            ))}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.5, 1],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2,
                times: [0, 0.3, 0.7, 1],
                ease: "easeOut",
                delay: 0.5,
              }}
              className="absolute text-4xl font-bold text-white bg-green-600 px-6 py-3 rounded-xl shadow-2xl"
            >
              +{calculateCurrentPoints()}ポイント！
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 回答するボタンの特殊エフェクト */}
      <AnimatePresence>
        {showSubmitEffects && submitButtonRef.current && (
          <motion.div
            className="fixed inset-0 z-40 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* ボタンの周りに輝く星 */}
            {[...Array(15)].map((_, i) => {
              const buttonRect = submitButtonRef.current?.getBoundingClientRect() || {
                top: 0,
                left: 0,
                width: 0,
                height: 0,
              }
              const centerX = buttonRect.left + buttonRect.width / 2
              const centerY = buttonRect.top + buttonRect.height / 2

              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: centerX,
                    top: centerY,
                    width: 10 + Math.random() * 10,
                    height: 10 + Math.random() * 10,
                  }}
                  initial={{
                    x: 0,
                    y: 0,
                    scale: 0,
                    opacity: 0,
                    rotate: 0,
                  }}
                  animate={{
                    x: (Math.random() - 0.5) * 200,
                    y: (Math.random() - 0.5) * 200,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    duration: 1 + Math.random() * 0.5,
                    ease: "easeOut",
                    delay: i * 0.03,
                  }}
                >
                  <Star className="text-yellow-400 fill-yellow-400" />
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div animate={cardControls} className="w-full">
        <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-0 overflow-hidden">
          <CardHeader className="space-y-2 bg-gradient-to-r from-green-100 to-green-200 py-3">
            <div className="space-y-1">
              <p className="text-center text-sm text-green-700">
                問題 {currentQuiz + 1} / {quizzes.length}
              </p>
              <Progress value={((currentQuiz + 1) / quizzes.length) * 100} className="h-2 bg-green-200" />
            </div>
            <motion.div
              className="flex items-center justify-center gap-3 text-xl font-bold text-green-800"
              animate={isPointsAnimating ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              {/* 光るダイヤ */}
              <div className="relative">
                <motion.div
                  className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
                  animate={{
                    boxShadow: [
                      "0 4px 6px -1px rgba(59, 130, 246, 0.5)",
                      "0 10px 15px -3px rgba(147, 51, 234, 0.8)",
                      "0 4px 6px -1px rgba(59, 130, 246, 0.5)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Diamond className="w-4 h-4 text-white fill-current" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 bg-blue-400 rounded-full opacity-30"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.1, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </div>
              {totalPoints}
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-8 relative">
            <motion.div
              className="absolute top-0 right-0 text-green-300"
              animate={{
                rotate: [0, 10, 0, -10, 0],
                transition: { duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
              }}
            >
              <Wind size={48} />
            </motion.div>
            <div className="relative">
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full flex items-center z-20">
                <Clock className="w-4 h-4 mr-2" />
                <span>{timeLeft}秒</span>
              </div>
              <div className="absolute top-2 right-2 bg-green-500 bg-opacity-70 text-white px-3 py-1 rounded-full z-20">
                <span>{getBackgroundLabel()}</span>
              </div>
              <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={backgroundPatternIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={
                        quizzes[currentQuiz].画像.メイン[backgroundPatternIndex] ||
                        "/placeholder.svg?height=400&width=600&query=部屋の背景" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt={`背景パターン${backgroundPatternIndex + 1}`}
                      fill
                      className="object-contain"
                      priority={currentQuiz === 0 && backgroundPatternIndex === 0}
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
                  </motion.div>
                </AnimatePresence>
                <motion.div
                  className="absolute left-0 top-0 w-1/3 h-full"
                  initial={{ x: overlayOffset }}
                  animate={overlayControls}
                >
                  <Image
                    src={
                      quizzes[currentQuiz].画像.オーバーレイ ||
                      "/placeholder.svg?height=400&width=200&query=明るい白い人影" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
                    }
                    alt="オーバーレイ画像"
                    fill
                    className="object-contain object-left"
                    priority={currentQuiz === 0}
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
                </motion.div>
              </div>
            </div>
            <CardTitle className="text-center text-xl font-medium text-green-800">
              {quizzes[currentQuiz].question}
            </CardTitle>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                {previousAnswers.length > 0 && (
                  <div className="p-4 bg-green-50 rounded-md border border-green-200 mb-4">
                    <h3 className="text-sm font-semibold text-green-700 mb-2">前の問題での回答:</h3>
                    <div className="flex flex-wrap gap-2">
                      {previousAnswers.map((answer, index) => (
                        <div
                          key={index}
                          className="bg-green-200 text-green-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                        >
                          {answer}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <motion.div
                  className="relative"
                  initial={false}
                  animate={(currentAnswerIndex + 1) % 3 === 0 ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                >
                  <Input
                    type="text"
                    placeholder="回答を入力してください"
                    value={userAnswers[currentAnswerIndex]}
                    onChange={(e) => handleTyping(currentAnswerIndex, e.target.value)}
                    className={`
                      bg-white/50 backdrop-blur-sm border-2 transition-all
                      ${
                        (currentAnswerIndex + 1) % 3 === 0
                          ? "border-yellow-400 focus:border-yellow-500 text-yellow-700 placeholder-yellow-400 bg-gradient-to-r from-yellow-100 to-yellow-200"
                          : "border-green-300 focus:border-green-500 text-green-700 placeholder-green-400"
                      }
                    `}
                  />
                  <span
                    className={`
                      absolute right-3 top-1/2 -translate-y-1/2 font-semibold
                      ${(currentAnswerIndex + 1) % 3 === 0 ? "text-yellow-600 text-lg" : "text-green-600"}
                    `}
                  >
                    {(currentAnswerIndex + 1) % 3 === 0 ? "+300pt" : "+100pt"}
                  </span>
                  {(currentAnswerIndex + 1) % 3 === 0 && (
                    <motion.div
                      className="absolute inset-0 rounded-md bg-gradient-to-r from-yellow-400/20 to-yellow-300/20 pointer-events-none"
                      animate={{ opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                  )}
                </motion.div>

                {/* 追加するボタン - 解答欄のすぐ下に配置 */}
                <div className="flex justify-center mt-4">
                  <motion.button
                    onClick={handleAddAnswer}
                    disabled={userAnswers.length >= MAX_ANSWERS || userAnswers[currentAnswerIndex].trim() === ""}
                    className={`
                      relative overflow-hidden flex items-center justify-center gap-2
                      px-8 py-3 rounded-full text-lg font-bold
                      ${
                        userAnswers[currentAnswerIndex].trim() === "" || userAnswers.length >= MAX_ANSWERS
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700"
                      }
                      transition-all duration-300 transform hover:scale-105
                    `}
                    animate={addButtonControls}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{
                      scale: 0.95,
                      boxShadow: "0 0 15px 5px rgba(34, 197, 94, 0.7)",
                    }}
                  >
                    <Plus className="w-5 h-5" />
                    追加する
                    {/* キラキラエフェクト */}
                    {userAnswers[currentAnswerIndex].trim() !== "" && userAnswers.length < MAX_ANSWERS && (
                      <>
                        <motion.span
                          className="absolute top-0 left-0 w-full h-full bg-white opacity-0"
                          animate={{
                            opacity: [0, 0.3, 0],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                          }}
                        />
                        <motion.span
                          className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full"
                          animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                            delay: 0.5,
                          }}
                        />
                        <motion.span
                          className="absolute -bottom-1 -left-1 w-3 h-3 bg-yellow-300 rounded-full"
                          animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                            delay: 1,
                          }}
                        />
                      </>
                    )}
                  </motion.button>
                </div>

                <p className="text-sm text-green-700 text-center">
                  {userAnswers.length}/{MAX_ANSWERS} 回答
                </p>
              </div>
            </ScrollArea>

            {/* 目標ポイント表示 - 終えるボタンの上に配置 */}
            <div className="flex items-center justify-center space-x-2 text-green-700 mt-4 mb-2">
              <Target size={18} />
              <span className="font-semibold">目標: {TARGET_POINTS}ポイント</span>
            </div>

            {/* 回答するボタンと終えるボタン - 位置を入れ替えて配置 */}
            <div className="flex flex-col gap-3 mt-2">
              <motion.button
                ref={submitButtonRef}
                onClick={handleSubmitClick}
                animate={submitButtonControls}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-green-700 hover:opacity-90 transition-opacity text-white flex items-center justify-center gap-2 text-lg font-bold rounded-xl shadow-lg relative overflow-hidden"
              >
                {/* キラキラエフェクト */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                  animate={{
                    x: ["-100%", "100%"],
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    repeatDelay: 3,
                  }}
                />

                {/* トロフィーアイコン */}
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    repeatDelay: 1,
                  }}
                >
                  <Award className="w-6 h-6 text-yellow-300" />
                </motion.div>

                <span>回答する</span>

                <motion.span
                  className="absolute right-4"
                  animate={{
                    x: [0, 5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.span>

                {/* 背景の波紋エフェクト */}
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(34, 197, 94, 0)",
                      "0 0 0 10px rgba(34, 197, 94, 0.3)",
                      "0 0 0 20px rgba(34, 197, 94, 0)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                />
              </motion.button>

              <Button
                variant="ghost"
                onClick={onEndQuiz}
                className="w-full py-2 text-green-600 hover:bg-green-50 flex items-center justify-center gap-2 text-sm"
              >
                終える
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}

const ResultPage = ({
  totalPoints,
  allUserAnswers,
  onRestart,
  onExit,
}: {
  totalPoints: number
  allUserAnswers: string[][]
  onRestart: () => void
  onExit: () => void
}) => {
  const [affiliateTextPattern, setAffiliateTextPattern] = useState(affiliateTextPatterns[0])
  const [affiliatePatternIndex, setAffiliatePatternIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false) // 追加: 送信中フラグ
  const [hasSubmitted, setHasSubmitted] = useState(false) // 追加: 送信済みフラグ

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

      if (!supabase || !isSupabaseConfigured) {
        console.log("Supabase環境変数が設定されていないため、アフィリエイトデータ保存をスキップします")
        setHasSubmitted(true)
        setIsSubmitting(false)
        
        if (shouldRedirect && redirectUrl) {
          setTimeout(() => {
            window.open(redirectUrl, "_blank")
          }, 200)
        }
      } else {
        // 既存のレコードを更新（アフィリエイト情報のみ追加）
        const responseId = localStorage.getItem('quiz_response_id')
        
        if (responseId) {
          // 既存レコードを更新
          supabase.from("pervasiveness_responses").update({
            affiliate_pattern_index: affiliatePatternIndex,
            affiliate_clicked: true,
            affiliate_click_type: clickData?.clickType || "unknown",
          }).eq('id', responseId).then(({ error }) => {
            if (error) {
              console.error("アフィリエイトデータの更新に失敗しました:", error)
            } else {
              console.log("アフィリエイトデータが正常に更新されました")
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
        } else {
          console.warn("quiz_response_idが見つかりません。アフィリエイト情報のみで新規レコードを作成します")
          // レスポンスIDがない場合は新規作成
          supabase.from("pervasiveness_responses").insert({
            total_points: totalPoints || 0,
            all_user_answers: allUserAnswers || [],
            enjoyment_rating: 5, // デフォルト値
            improvement_rating: 5, // デフォルト値
            affiliate_pattern_index: affiliatePatternIndex,
            affiliate_clicked: true,
            affiliate_click_type: clickData?.clickType || "unknown",
          }).then(({ error }) => {
            if (error) {
              console.error("アフィリエイトデータの保存に失敗しました:", error)
            } else {
              console.log("アフィリエイトデータが正常に保存されました")
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
      }
    },
    [isSubmitting, hasSubmitted, totalPoints, affiliatePatternIndex, allUserAnswers],
  )

  
  // iframeからのメッセージを受信するリスナー
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
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6"
    >
      <Leaf className="w-24 h-24 mx-auto text-green-600" />
      <h1 className="text-4xl font-bold text-green-800">Finish！</h1>
      <p className="text-2xl font-semibold text-green-700">合計ポイント: {totalPoints}</p>
      <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgb(0, 112, 35)" }}>
        おめでとうございます！あなたの創造力と思考力が森の中で育まれました。
        このスコアは、あなたのユニークな視点と深い思考を反映しています。
      </p>


        {/* アフィリエイトコンポーネント */}
        <AffiliateComponent affiliateTextPattern={affiliateTextPattern} />

{hasSubmitted && (
  <div className="mt-4 text-center text-sm text-green-600 font-medium">
    ✨ ありがとうございます！
  </div>
)}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={onRestart}
          className="bg-gradient-to-r from-green-500 to-green-700 hover:opacity-90 transition-opacity px-8 py-3 text-lg text-white"
        >
          もう一度遊ぶ
        </Button>
        <Button
          onClick={onExit}
          variant="outline"
          className="px-8 py-3 text-lg border-green-500 text-green-700 hover:bg-green-100 bg-transparent"
        >
          終わる
        </Button>
      </div>
    </motion.div>
  )
}

const EvaluationDisplay = ({ evaluation }: { evaluation: string }) => {
  const variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  }

  // 評価に基づいて背景色のグラデーションを決定
  const getGradientClass = () => {
    switch (evaluation) {
      case "GOOD":
        return "from-green-400 to-green-600"
      case "EXCELLENT":
        return "from-green-500 to-green-700"
      case "PERFECT":
        return "from-green-600 to-green-800"
      default:
        return "from-green-400 to-green-600" // デフォルト値
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <motion.div
        className={`text-center p-8 rounded-lg bg-gradient-to-r ${getGradientClass()} shadow-lg`}
        initial={{ scale: 0.8, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Leaf className="w-24 h-24 mx-auto text-green-200 mb-4" />
        <h2 className="text-4xl font-bold text-white mb-4">{evaluation}</h2>
      </motion.div>
    </motion.div>
  )
}

const SurveyPage = ({
  onSubmit,
  totalPoints,
}: {
  onSubmit: (enjoyment: number, mentalImprovement: number, feedback: string) => void
  totalPoints: number
}) => {
  const [enjoyment, setEnjoyment] = useState(5)
  const [mentalImprovement, setMentalImprovement] = useState(5)
  const [feedback, setFeedback] = useState("")

  return (
    <Card className="w-full max-w-2xl backdrop-blur-sm bg-white/80 shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-green-100 to-green-200">
        <CardTitle className="text-2xl font-bold text-center text-green-800">森の感想</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 bg-green-50">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-700">このゲームの楽しさを評価してください（1-10）</h3>
          <Slider
            min={1}
            max={10}
            step={1}
            value={[enjoyment]}
            onValueChange={(value) => setEnjoyment(value[0])}
            className="bg-green-200"
          />
          <p className="text-center text-green-600">{enjoyment}</p>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-700">どれくらい楽になりましたか？（1-10）</h3>
          <Slider
            min={1}
            max={10}
            step={1}
            value={[mentalImprovement]}
            onValueChange={(value) => setMentalImprovement(value[0])}
            className="bg-green-200"
          />
          <p className="text-center text-green-600">{mentalImprovement}</p>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-700">感想や気づいたことを自由に書いてください ＋1000pt</h3>
          <Textarea
            placeholder="ここに感想を入力してください..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[120px] bg-white border-green-200 focus:border-green-400"
          />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-green-700">現在の合計ポイント: {totalPoints}</p>
          <p className="text-sm text-green-600">※感想の回答でさらにポイントが加算されます</p>
        </div>
      </CardContent>
      <CardFooter className="bg-gradient-to-r from-green-100 to-green-200">
        <Button
          className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:opacity-90 transition-opacity text-white"
          onClick={() => onSubmit(enjoyment, mentalImprovement, feedback)}
        >
          次へ
        </Button>
      </CardFooter>
    </Card>
  )
}

const QuizGame = () => {
  const [gameState, setGameState] = useState<"intro" | "quiz" | "evaluation" | "survey" | "result">("intro")
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>([""])
  const [previousAnswers, setPreviousAnswers] = useState<string[]>([])
  const [allUserAnswers, setAllUserAnswers] = useState<string[][]>([]) // 全ての回答を保存
  const [totalPoints, setTotalPoints] = useState(0)
  const [isPointsAnimating, setIsPointsAnimating] = useState(false)
  const [evaluation, setEvaluation] = useState<string>("")
  const [backgroundPatternIndex, setBackgroundPatternIndex] = useState(0) // 背景パターンのインデックス

  const calculateTotalPoints = useCallback(() => {
    const points = userAnswers.reduce((total, answer, index) => {
      if (answer.trim() !== "") {
        return total + ((index + 1) % 3 === 0 ? 300 : 100)
      }
      return total
    }, 0)

    const newTotalPoints = Math.min(totalPoints + points, MAX_POINTS_PER_QUIZ)
    setTotalPoints(newTotalPoints)

    // ポイントに応じて背景パターンを更新
    setBackgroundPatternIndex(getBackgroundPatternIndex(newTotalPoints))

    setIsPointsAnimating(true)
    setTimeout(() => setIsPointsAnimating(false), 1000)
  }, [userAnswers, totalPoints])

  const getEvaluation = useCallback((filledAnswers: number) => {
    if (filledAnswers >= MAX_ANSWERS) return "PERFECT"
    if (filledAnswers >= Math.floor(MAX_ANSWERS * 0.6)) return "EXCELLENT"
    if (filledAnswers >= Math.floor(MAX_ANSWERS * 0.3)) return "GOOD"
    return ""
  }, [])

  const handleContinue = useCallback(() => {
    if (currentQuiz < quizzes.length - 1) {
      // 現在の回答を全回答履歴に追加
      setAllUserAnswers((prev) => [...prev, userAnswers.filter((answer) => answer.trim() !== "")])
      setPreviousAnswers(userAnswers)
      setCurrentQuiz(currentQuiz + 1)
      setUserAnswers([""])
      setGameState("quiz")
    } else {
      // 最後の回答も追加
      setAllUserAnswers((prev) => [...prev, userAnswers.filter((answer) => answer.trim() !== "")])
      setGameState("result")
    }
  }, [currentQuiz, userAnswers])

  const handleSubmit = useCallback(() => {
    calculateTotalPoints()
    const filledAnswers = userAnswers.filter((answer) => answer.trim() !== "").length
    const currentEvaluation = getEvaluation(filledAnswers)
    setEvaluation(currentEvaluation)
    setGameState("evaluation")

    setTimeout(() => {
      if (currentQuiz < quizzes.length - 1) {
        handleContinue()
      } else {
        setGameState("survey")
      }
    }, 3000)
  }, [calculateTotalPoints, currentQuiz, getEvaluation, userAnswers, handleContinue])

  // handleEndQuiz関数を以下のように修正します
  const handleEndQuiz = useCallback(async () => {
    calculateTotalPoints()

    // 現在までの回答を全回答履歴に追加
    setAllUserAnswers((prev) => [...prev, userAnswers.filter((answer) => answer.trim() !== "")])

    // 直接結果ページに遷移
    setGameState("result")
  }, [calculateTotalPoints, allUserAnswers, userAnswers, totalPoints])

  const addAnswerField = useCallback(() => {
    if (userAnswers.length < MAX_ANSWERS && userAnswers[userAnswers.length - 1].trim() !== "") {
      setUserAnswers((prev) => [...prev, ""])
    }
  }, [userAnswers])

  const updateAnswer = useCallback((index: number, value: string) => {
    setUserAnswers((prev) => {
      const newAnswers = [...prev]
      newAnswers[index] = value
      return newAnswers
    })
  }, [])

  const restartQuiz = useCallback(() => {
    setCurrentQuiz(0)
    setTotalPoints(0)
    setUserAnswers([""])
    setPreviousAnswers([])
    setAllUserAnswers([])
    setBackgroundPatternIndex(0) // 背景パターンをリセット
    setGameState("quiz")
  }, [])

  const handleSurveySubmit = useCallback(
    async (enjoyment: number, mentalImprovement: number, feedback: string) => {
      const surveyPoints = (enjoyment + mentalImprovement) * 50 // 各回答につき最大500ポイント
      const feedbackBonus = feedback.trim().length > 0 ? 200 : 0 // 感想入力ボーナス
      const newTotalPoints = totalPoints + surveyPoints + feedbackBonus

      setTotalPoints(newTotalPoints)

      // Supabaseに基本データを送信
      if (supabase && isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.from("pervasiveness_responses").insert({
            total_points: newTotalPoints,
            all_user_answers: allUserAnswers,
            enjoyment_rating: enjoyment,
            improvement_rating: mentalImprovement,
            affiliate_clicked: false, // 初期値はfalse
          }).select('id').single()
          
          if (error) {
            console.error("データの保存に失敗しました:", error)
          } else {
            console.log("基本データが正常に保存されました", data)
            // レスポンスIDを保存（アフィリエイトクリック時の更新用）
            if (data?.id) {
              localStorage.setItem('quiz_response_id', data.id.toString())
            }
          }
        } catch (error) {
          console.error("Supabaseへの送信中にエラーが発生しました:", error)
        }
      } else {
        console.log("Supabase環境変数が設定されていないため、データ保存をスキップします")
      }

      setGameState("result")
    },
    [totalPoints, allUserAnswers],
  )

  const handleTimeUp = useCallback(() => {
    if (currentQuiz < quizzes.length - 1) {
      calculateTotalPoints()
      setAllUserAnswers((prev) => [...prev, userAnswers.filter((answer) => answer.trim() !== "")])
      setPreviousAnswers(userAnswers)
      setCurrentQuiz(currentQuiz + 1)
      setUserAnswers([""])
    } else {
      // 最後のクイズで時間切れの場合、ポイント計算してから感想ページへ
      calculateTotalPoints()
      setAllUserAnswers((prev) => [...prev, userAnswers.filter((answer) => answer.trim() !== "")])
      setGameState("survey")
    }
  }, [currentQuiz, userAnswers, calculateTotalPoints])

  return (
    <div className="min-h-screen bg-green-200 flex items-center justify-center relative overflow-hidden">
      <AnimatePresence mode="wait">
        {gameState === "intro" && <IntroPage key="intro" onStart={() => setGameState("quiz")} />}
        {gameState === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl p-6"
          >
            <QuizPage
              currentQuiz={currentQuiz}
              userAnswers={userAnswers}
              previousAnswers={previousAnswers}
              totalPoints={totalPoints}
              isPointsAnimating={isPointsAnimating}
              backgroundPatternIndex={backgroundPatternIndex}
              onUpdateAnswer={updateAnswer}
              onAddAnswerField={addAnswerField}
              onSubmit={handleSubmit}
              onEndQuiz={handleEndQuiz}
              onTimeUp={handleTimeUp}
            />
          </motion.div>
        )}
        {gameState === "evaluation" && <EvaluationDisplay key="evaluation" evaluation={evaluation} />}
        {gameState === "survey" && (
          <motion.div
            key="survey"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="p-6"
          >
            <SurveyPage onSubmit={handleSurveySubmit} totalPoints={totalPoints} />
          </motion.div>
        )}
        {gameState === "result" && (
          <ResultPage
            key="result"
            totalPoints={totalPoints}
            allUserAnswers={allUserAnswers}
            onRestart={restartQuiz}
            onExit={() => {
              // 状態を初期化
              setCurrentQuiz(0)
              setTotalPoints(0)
              setUserAnswers([""])
              setPreviousAnswers([])
              setAllUserAnswers([])
              setBackgroundPatternIndex(0)
              // イントロ画面に戻る
               window.location.href = "https://yume-webdesign.com" // ここに戻りたいURLを入力
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default QuizGame
