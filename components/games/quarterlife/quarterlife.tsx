"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import ConfettiCanvas from "@/components/animations/ConfettiCanvas"
import { TermsOfService } from "@/components/terms-of-service/terms-of-service"

// 行動プランの型定義
type ActionPlan = {
  when: string
  where: string
  what: string
}

// 効果音再生用のカスタムフック
const useInteractionSounds = (isMuted: boolean) => {
  const typingAudioRef = useRef<HTMLAudioElement | null>(null)

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

  return { playTyping, playClick }
}

// アフィリエイトコンポーネント
const AffiliateComponent = ({ className = "" }: { className?: string }) => {
  const affiliateHtml = `<a href="https://px.a8.net/svt/ejp?a8mat=45167E+679KMQ+5OI8+5ZEMP" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www27.a8.net/svt/bgt?aid=250317482375&wid=001&eno=01&mid=s00000026504001005000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=45167E+679KMQ+5OI8+5ZEMP" alt="">`

  return (
    <div className={`w-full mx-auto mt-2 mb-2 relative min-h-[300px] ${className}`}>
      <div className="relative z-10 flex justify-center" dangerouslySetInnerHTML={{ __html: affiliateHtml }} />
    </div>
  )
}

// ローディングページ
const LoadingPage = ({ onLoadComplete }: { onLoadComplete: () => void }) => {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('準備中...')

  const loadingMessages = ['準備中...', 'BGMを読み込んでいます...', '効果音を準備中...', '完了間近です...']

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onLoadComplete, 500)
          return 100
        }
        return prev + 10
      })
    }, 200)

    const messageInterval = setInterval(() => {
      setLoadingText(prev => {
        const idx = loadingMessages.indexOf(prev)
        return loadingMessages[(idx + 1) % loadingMessages.length]
      })
    }, 800)

    return () => {
      clearInterval(interval)
      clearInterval(messageInterval)
    }
  }, [onLoadComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 flex flex-col items-center justify-center z-50">
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
            }}
          />
        ))}
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center animate-bounce">
              <span className="text-4xl">🌟</span>
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">クォーターライフ・クライシス</h1>
        <p className="text-white/80 mb-8 text-lg">理解度チェックゲーム</p>
        <div className="w-64 h-3 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
          <div className="h-full bg-white rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-4 text-white font-bold text-xl">{progress}%</p>
        <p className="mt-2 text-white/90 text-sm animate-pulse">{loadingText}</p>
      </div>
    </div>
  )
}

// イントロページ
const IntroPage = ({ onStart, isMuted, setIsMuted }: { onStart: () => void; isMuted: boolean; setIsMuted: (v: boolean) => void }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isTermsOpen, setIsTermsOpen] = useState(false)

  const playSound = useCallback((soundFile: string) => {
    if (isMuted) return
    audioRef.current = new Audio(soundFile)
    audioRef.current.volume = 0.5
    audioRef.current.play().catch(() => {})
  }, [isMuted])

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center animate-fade-in py-4">
      <TermsOfService isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-indigo-200 to-purple-300" />
      <div className="relative z-10 text-center space-y-6 bg-indigo-700 bg-opacity-70 p-8 rounded-lg max-w-2xl mx-4">
        <h1 className="text-4xl font-bold text-white">クォーターライフ・クライシス</h1>
        <p className="text-lg text-white whitespace-pre-line">
          20代の不安を科学的に理解しよう{"\n"}
          この記事の内容を確認して、クイズに挑戦！
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all shadow-lg border-2 ${
              isMuted ? "bg-gray-700 hover:bg-gray-800 border-gray-500 text-white" : "bg-white hover:bg-yellow-50 border-yellow-400 text-gray-800"
            } font-bold`}
          >
            <span className="text-2xl">{isMuted ? "🔊" : "🔇"}</span>
            <span>{isMuted ? "BGMをオンにする" : "消音にする"}</span>
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-white/70 text-sm text-center">
            スタートボタンをおすと、<button type="button" onClick={() => setIsTermsOpen(true)} className="text-indigo-300 underline hover:text-indigo-200 font-medium">利用規約</button>に同意したことになります。
          </p>
          <Button
            onClick={() => { playSound('/sound/nextpage.mp3'); onStart() }}
            className="bg-gradient-to-r from-indigo-500 to-purple-700 hover:opacity-90 px-8 py-4 text-xl text-white"
          >
            スタート
          </Button>
        </div>
      </div>
    </div>
  )
}

// 記事内容確認ページ
const ArticleContentPage = ({ onComplete, isMuted }: { onComplete: () => void; isMuted: boolean }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playSound = useCallback((soundFile: string) => {
    if (isMuted) return
    audioRef.current = new Audio(soundFile)
    audioRef.current.volume = 0.5
    audioRef.current.play().catch(() => {})
  }, [isMuted])

  const articleContent = `25歳前後で、急に人生が不安になった。

「自分はこのままでいいのか」「もう若くない」「何者にもなれていない」。

周りは結婚したり、昇進したり、起業したり。自分だけが取り残されている気がする。

私も20代半ばで、突然この感覚に襲われました。学生時代は「まだ時間がある」と思っていた。でも社会人になって数年経つと、「もう後戻りできない」という焦りが出てきたのです。

これは**クォーターライフ・クライシス（Quarter-Life Crisis）**という、科学的に認められた現象なのです。

【クォーターライフ・クライシスとは何か】

心理学者オリバー・ロビンソンによると、これは20代から30代前半に起こる発達的な危機です。

特徴は以下の5つ：
・アイデンティティの混乱（自分が何者かわからない）
・将来への不安（このままでいいのか）
・他者との比較（周りに置いていかれている）
・選択への後悔（違う道を選べばよかった）
・意味の喪失（何のために生きているのか）

研究によると、18〜35歳の約70%がこの危機を経験することがわかっています。

【科学的に乗り越える方法】

それは、「人生は直線ではない」と脳に教えることです。

クォーターライフ・クライシスの根本には、「人生には正しいレール」があるという思い込みがあります。25歳までに〇〇、30歳までに△△。

でも実際には、人生は螺旋階段のように、行ったり来たりしながら上っていくもの。「今の迷いも成長の一部」と理解することで、脳の焦りは和らぎます。

これは心理学でいう**人生の再構築（Life Restructuring）**であり、危機を成長の機会に変える方法です。

【具体的にどうするのか】

「〇歳までに△△しなければ」というリストを書き出す。そして、それぞれに「本当に？誰が決めた？」と問いかける。

多くの場合、それは社会や親が押し付けた基準であり、あなた自身が決めたものではない。自分の基準で人生を測り直すことで、焦りは減っていきます。

【解決策その2：エクスポージャー】

「自分は何者にもなれない」という恐怖に、あえて向き合う。これがエクスポージャーです。

「失敗するかも」「このままかも」という恐怖を避け続けると、脳は「これは本当に危険だ」と誤認し続けます。安全な環境で向き合うことで、脳は「何者にならなくても大丈夫」と学習するのです。

【まとめ】

20代の不安はクォーターライフ・クライシスという正常な現象。「人生に正解のレールはない」と理解する。これだけで、焦りは減っていきます。`

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in overflow-y-auto" style={{ background: "#f0f4ff" }}>
      <div className="w-full max-w-2xl space-y-6 pb-20">
        <div className="text-center py-4">
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-800" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
            📖 記事を読んでクイズに備えよう
          </h1>
          <p className="text-indigo-600 text-sm mt-2">下の内容を読んでから、確認クイズに挑戦！</p>
        </div>

        <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-300">
          <p className="text-yellow-800 font-bold text-center">📝 この内容のクイズで点数が稼げるよ！しっかり読んでね</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-indigo-200">
          <div className="prose prose-indigo max-w-none">
            <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed font-sans">{articleContent}</pre>
          </div>
        </div>

        <div className="text-center py-6">
          <button
            onClick={() => { playSound('/sound/nextpage.mp3'); onComplete() }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black px-12 py-4 rounded-full text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            🎯 理解度クイズに挑戦する →
          </button>
        </div>
      </div>
    </div>
  )
}

// クイズカード用のアート画像
const QUIZ_ART_IMAGES = [
  '/image/art1.png', '/image/art2.png', '/image/art3.png', '/image/art4.png', '/image/art5.png',
  '/image/art6.png', '/image/art7.png', '/image/art8.png', '/image/art9.png', '/image/art10.png',
]

// クイズページ
const QuizPage = ({
  onComplete,
  onExit,
  totalPoints,
  setTotalPoints,
  isMuted,
  onWrongAnswersUpdate,
}: {
  onComplete: () => void
  onExit: () => void
  totalPoints: number
  setTotalPoints: (value: number | ((prev: number) => number)) => void
  isMuted: boolean
  onWrongAnswersUpdate?: (wrongAnswers: number[]) => void
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showPointAnimation, setShowPointAnimation] = useState(false)
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([])
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { playClick } = useInteractionSounds(isMuted)

  // ランダムなアート画像を選択
  const [quizArtImage] = useState(() => QUIZ_ART_IMAGES[Math.floor(Math.random() * QUIZ_ART_IMAGES.length)])

  const playSound = useCallback((soundFile: string) => {
    if (isMuted) return
    audioRef.current = new Audio(soundFile)
    audioRef.current.volume = 0.5
    audioRef.current.play().catch(() => {})
  }, [isMuted])

  const questions = [
    {
      q: "クォーターライフ・クライシスは何歳頃に起こる現象ですか？",
      options: ["10代から20代前半", "20代から30代前半", "40代から50代前半"],
      correct: 1,
      fb_correct: "✅ 正解！クォーターライフ・クライシスは20代から30代前半に起こる発達的な危機です。",
      fb_wrong: "❌ 不正解。クォーターライフ・クライシスは20代から30代前半に起こる現象です。"
    },
    {
      q: "研究によると、18〜35歳の何%がクォーターライフ・クライシスを経験しますか？",
      options: ["約30%", "約50%", "約70%"],
      correct: 2,
      fb_correct: "✅ 正解！研究によると約70%の人がこの危機を経験することがわかっています。",
      fb_wrong: "❌ 不正解。研究によると約70%の人がこの危機を経験します。あなただけではありません。"
    },
    {
      q: "クォーターライフ・クライシスを乗り越えるために大切な考え方は？",
      options: ["人生には正しいレールがある", "人生は直線ではない", "25歳までに全てを決めるべき"],
      correct: 1,
      fb_correct: "✅ 正解！「人生は直線ではない」と理解することで、脳の焦りは和らぎます。",
      fb_wrong: "❌ 不正解。「人生は直線ではない」と脳に教えることが大切です。"
    },
    {
      q: "「〇歳までに△△しなければ」という基準は多くの場合、誰が決めたものですか？",
      options: ["自分自身", "社会や親", "科学的な研究"],
      correct: 1,
      fb_correct: "✅ 正解！多くの場合、それは社会や親が押し付けた基準であり、あなた自身が決めたものではありません。",
      fb_wrong: "❌ 不正解。多くの場合、それは社会や親が押し付けた基準です。"
    },
    {
      q: "エクスポージャーとは何をすることですか？",
      options: ["恐怖から逃げ続けること", "恐怖にあえて向き合うこと", "恐怖を忘れること"],
      correct: 1,
      fb_correct: "✅ 正解！エクスポージャーは恐怖にあえて向き合い、脳に「大丈夫」と学習させる方法です。",
      fb_wrong: "❌ 不正解。エクスポージャーは恐怖にあえて向き合うことです。"
    }
  ]

  const handleSelectAnswer = (idx: number) => {
    if (answered) return
    setAnswered(true)
    setSelectedAnswer(idx)
    playClick()
    if (idx === questions[currentQuestion].correct) {
      setScore(prev => prev + 1)
      const newConsecutive = consecutiveCorrect + 1
      setConsecutiveCorrect(newConsecutive)
      const points = newConsecutive >= 2 ? 300 : 100
      setTotalPoints((prev) => prev + points)
      playSound('/sound/100pt.mp3')
      setShowPointAnimation(true)
      setTimeout(() => setShowPointAnimation(false), 1500)
    } else {
      setWrongAnswers(prev => [...prev, currentQuestion])
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

  if (showResult) {
    const total = questions.length
    let icon = "🎉", msg = "", sub = ""
    if (score === total) {
      icon = "🌟"; msg = "完璧！準備バッチリです"; sub = "クォーターライフ・クライシスの大切なポイントをすべて理解できています。"
    } else if (score >= 3) {
      icon = "👍"; msg = "よくできました！"; sub = "大部分は理解できています。間違えた問題を復習しましょう。"
    } else {
      icon = "📚"; msg = "もう一度確認しよう"; sub = "記事をもう一度読んでから再チャレンジしてみてください。"
    }

    return (
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in" style={{ background: "#f0f4ff" }}>
        <div className="text-center space-y-6 max-w-md">
          <div className="text-6xl">{icon}</div>
          <div className="text-5xl font-bold text-indigo-600">{score} / {total}</div>
          <div className="text-lg font-bold text-gray-800">{msg}</div>
          <p className="text-sm text-gray-500 max-w-md leading-relaxed">{sub}</p>
          {wrongAnswers.length > 0 && <p className="text-sm text-orange-600 font-semibold">📝 間違えた問題は後で復習できます！</p>}
          <div className="flex gap-4 justify-center pt-4">
            <button
              onClick={() => { playSound('/sound/nextpage.mp3'); if (onWrongAnswersUpdate) onWrongAnswersUpdate(wrongAnswers); onComplete() }}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              次へ進む →
            </button>
          </div>
          <AffiliateComponent />
          <button onClick={onExit} className="text-gray-500 hover:text-gray-700 underline text-sm">終了する</button>
        </div>
      </div>
    )
  }

  const q = questions[currentQuestion]
  const progress = ((currentQuestion) / questions.length) * 100

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in" style={{ background: "#f0f4ff" }}>
      <ConfettiCanvas isActive={showPointAnimation} duration={1000} particleCount={30} points={consecutiveCorrect >= 2 ? 300 : 100} />
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex justify-between items-center">
          {consecutiveCorrect >= 2 && <div className="text-orange-500 text-sm font-bold animate-pulse">🔥 {consecutiveCorrect}連続正解！ボーナス+300pt</div>}
          <div className="text-indigo-600 text-xl font-extrabold ml-auto">🏆 {totalPoints}pt</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs text-gray-500">{currentQuestion + 1} / {questions.length}</span>
        </div>

        {/* クイズカードにアート画像 */}
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-indigo-400 shadow-lg flex-shrink-0">
            <Image src={quizArtImage} alt="Quiz Art" width={80} height={80} className="w-full h-full object-cover" />
          </div>
          <div className="relative flex-1 bg-white rounded-2xl p-4 shadow-md border-2 border-indigo-300">
            <p className="text-xs tracking-widest text-indigo-600 mb-2">QUESTION {String(currentQuestion + 1).padStart(2, "0")}</p>
            <p className="text-base font-bold leading-relaxed" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>{q.q}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-indigo-100">
          <div className="space-y-3">
            {q.options.map((opt, i) => {
              let optionClass = "bg-gray-50 border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50"
              if (answered) {
                if (i === q.correct) optionClass = "bg-green-50 border-green-500"
                else if (i === selectedAnswer) optionClass = "bg-red-50 border-red-400"
                else optionClass = "bg-gray-50 border-gray-200 opacity-60"
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelectAnswer(i)}
                  disabled={answered}
                  className={`w-full text-left border-2 rounded-xl p-4 text-sm flex items-center gap-3 transition-all ${optionClass}`}
                >
                  <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    answered && i === q.correct ? "border-green-500 text-green-600 bg-green-100" :
                    answered && i === selectedAnswer ? "border-red-400 text-red-500 bg-red-100" : "border-gray-400 text-gray-500"
                  }`}>
                    {answered ? (i === q.correct ? "✓" : i === selectedAnswer ? "✗" : String.fromCharCode(65 + i)) : String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>

          {answered && (
            <div className={`mt-5 p-4 rounded-lg text-sm ${selectedAnswer === q.correct ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-600"}`}>
              {selectedAnswer === q.correct ? q.fb_correct : q.fb_wrong}
            </div>
          )}

          {answered && (
            <div className="mt-5 text-center">
              <button onClick={() => { playSound('/sound/nextpage.mp3'); handleNextQuestion() }} className="border-2 border-indigo-500 text-indigo-600 font-bold px-8 py-3 rounded-full hover:bg-indigo-500 hover:text-white transition-all">
                {currentQuestion < questions.length - 1 ? "次の問題へ →" : "結果を見る →"}
              </button>
            </div>
          )}

          <AffiliateComponent />
          <div className="mt-5 text-center">
            <button onClick={onExit} className="text-gray-500 hover:text-gray-700 underline text-sm">終了する</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 行動リスト作成ページ
const ActionPlanPage = ({
  actionPlans,
  totalPoints,
  setTotalPoints,
  onActionPlanAdd,
  onComplete,
  onExit,
  isMuted,
}: {
  actionPlans: ActionPlan[]
  totalPoints: number
  setTotalPoints: (value: number | ((prev: number) => number)) => void
  onActionPlanAdd: (when: string, where: string, what: string) => void
  onComplete: () => void
  onExit: () => void
  isMuted: boolean
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [showIntro, setShowIntro] = useState(true)
  const [currentStep, setCurrentStep] = useState<'when' | 'where' | 'what' | 'confirmation'>('when')
  const [currentLevel, setCurrentLevel] = useState(actionPlans.length + 1)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [customInput, setCustomInput] = useState('')
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<ActionPlan>({ when: '', where: '', what: '' })
  const [showConfetti, setShowConfetti] = useState(false)
  const [currentPoints, setCurrentPoints] = useState(0)

  const playSound = useCallback((soundFile: string) => {
    if (isMuted) return
    audioRef.current = new Audio(soundFile)
    audioRef.current.volume = 0.5
    audioRef.current.play().catch(() => {})
  }, [isMuted])

  const whenOptions = ['朝', '昼', '夜']
  const whereOptions = ['自宅', '職場', '外出先', 'SNS']

  const handleSubmit = () => {
    const answer = isCustomMode ? customInput : selectedAnswer
    if (!answer.trim()) return

    let points = currentStep === 'when' ? (isCustomMode ? 300 : 100) : currentStep === 'where' ? (isCustomMode ? 300 : 200) : 300
    setTotalPoints((prev) => prev + points)
    setCurrentPoints(points)
    playSound('/sound/100pt.mp3')
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 1500)

    if (currentStep === 'when') {
      setCurrentPlan(prev => ({ ...prev, when: answer }))
      setTimeout(() => { setCurrentStep('where'); setSelectedAnswer(''); setCustomInput(''); setIsCustomMode(false) }, 1000)
    } else if (currentStep === 'where') {
      setCurrentPlan(prev => ({ ...prev, where: answer }))
      setTimeout(() => { setCurrentStep('what'); setSelectedAnswer(''); setCustomInput(''); setIsCustomMode(true) }, 1000)
    } else if (currentStep === 'what') {
      setCurrentPlan(prev => ({ ...prev, what: answer }))
      setTimeout(() => setCurrentStep('confirmation'), 1000)
    }
  }

  const handleAddLevel = () => {
    onActionPlanAdd(currentPlan.when, currentPlan.where, currentPlan.what)
    setCurrentLevel(prev => prev + 1)
    setCurrentStep('when')
    setCurrentPlan({ when: '', where: '', what: '' })
    setSelectedAnswer('')
    setCustomInput('')
    setIsCustomMode(false)
  }

  if (showIntro) {
    return (
      <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in overflow-y-auto" style={{ background: "#f0f4ff" }}>
        <div className="w-full max-w-2xl space-y-6 pb-20">
          <div className="text-center py-4">
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-800" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>🎯 行動リストの作成</h1>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-indigo-400">
            <h2 className="text-indigo-600 font-bold text-lg mb-4">📝 これからやること</h2>
            <div className="space-y-4">
              <div className="flex gap-4 bg-indigo-50 p-4 rounded-xl">
                <span className="text-3xl">🎯</span>
                <div>
                  <p className="font-bold text-gray-800 mb-2">「人生に正解のレールはない」を実践する行動をリストアップ</p>
                  <p className="text-sm text-gray-600">社会の基準ではなく、自分の基準で行動を計画します。</p>
                </div>
              </div>
              <div className="flex gap-4 bg-indigo-50 p-4 rounded-xl">
                <span className="text-3xl">⏰</span>
                <div>
                  <p className="font-bold text-gray-800 mb-2">いつ・どこで・何をするか</p>
                  <p className="text-sm text-gray-600">具体的に書くほど、実行しやすくなります。</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center py-6">
            <button onClick={() => { playSound('/sound/nextpage.mp3'); setShowIntro(false) }} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all">
              行動リストを作成する →
            </button>
          </div>
          <div className="text-center"><button onClick={onExit} className="text-gray-500 hover:text-gray-700 underline text-sm">終了する</button></div>
        </div>
      </div>
    )
  }

  if (currentStep === 'confirmation') {
    return (
      <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in" style={{ background: "#f0f4ff" }}>
        <ConfettiCanvas isActive={showConfetti} duration={1500} particleCount={50} points={currentPoints} />
        <div className="w-full max-w-md space-y-6">
          <div className="text-indigo-600 text-2xl font-extrabold text-center">🏆 {totalPoints}pt</div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-indigo-800 mb-4 text-center">レベル{currentLevel}の行動プランが完成！</h2>
            <div className="bg-indigo-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700"><span className="font-bold text-indigo-700">いつ：</span>{currentPlan.when}</p>
              <p className="text-gray-700"><span className="font-bold text-indigo-700">どこで：</span>{currentPlan.where}</p>
              <p className="text-gray-700"><span className="font-bold text-indigo-700">何をする：</span>{currentPlan.what}</p>
            </div>
          </div>
          <div className="space-y-3">
            {actionPlans.length < 5 && (
              <Button onClick={() => { playSound('/sound/nextpage.mp3'); handleAddLevel() }} className="w-full py-6 text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl">
                レベル{currentLevel + 1}を追加する ✨
              </Button>
            )}
            <Button onClick={() => { playSound('/sound/nextpage.mp3'); if (currentPlan.when) onActionPlanAdd(currentPlan.when, currentPlan.where, currentPlan.what); onComplete() }} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
              次へ進む →
            </Button>
          </div>
          <AffiliateComponent />
          <Button onClick={onExit} className="w-full py-3 text-indigo-600 bg-white border-2 border-indigo-300">終了する</Button>
        </div>
      </div>
    )
  }

  const getBubbleText = () => currentStep === 'when' ? 'いつ実践する？' : currentStep === 'where' ? 'どこで実践する？' : '何をする？'

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in" style={{ background: "#f0f4ff" }}>
      <ConfettiCanvas isActive={showConfetti} duration={1500} particleCount={50} points={currentPoints} />
      <div className="w-full max-w-md space-y-6">
        <div className="text-center text-indigo-600 text-lg font-extrabold">🏆 {totalPoints}pt</div>
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-3 border-2 border-indigo-400">
          <p className="text-center text-indigo-800 font-bold">Lv{currentLevel}: {getBubbleText()}</p>
        </div>

        {currentStep === 'what' ? (
          <div className="p-3 rounded-xl border-4 border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50">
            <p className="text-sm text-yellow-700 font-bold mb-1">自由記述 (+300pt)</p>
            <Input type="text" placeholder="具体的な行動を入力..." value={customInput} onChange={(e) => setCustomInput(e.target.value)} className="w-full" autoFocus />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 justify-center">
              {(currentStep === 'when' ? whenOptions : whereOptions).map((option) => (
                <button key={option} onClick={() => { setSelectedAnswer(option); setIsCustomMode(false) }}
                  className={`px-4 py-2 rounded-xl border-2 font-medium transition-all ${selectedAnswer === option ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300'}`}>
                  {option}
                </button>
              ))}
            </div>
            <button onClick={() => { setIsCustomMode(true); setSelectedAnswer('') }}
              className={`w-full p-3 rounded-xl border-4 font-medium transition-all ${isCustomMode ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-white hover:border-yellow-300'}`}>
              <span className="text-yellow-700 font-bold">自由記述 (+300pt)</span>
            </button>
            {isCustomMode && <Input type="text" placeholder="自由に入力..." value={customInput} onChange={(e) => setCustomInput(e.target.value)} className="w-full border-2 border-yellow-400" autoFocus />}
          </div>
        )}

        <Button onClick={handleSubmit} disabled={!(isCustomMode ? customInput.trim() : selectedAnswer)}
          className={`w-full py-3 font-bold rounded-xl ${(isCustomMode ? customInput.trim() : selectedAnswer) ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
          回答する
        </Button>
        <AffiliateComponent />
        <Button onClick={onExit} className="w-full py-2 text-indigo-600 bg-transparent hover:bg-indigo-50 text-sm">終了する</Button>
      </div>
    </div>
  )
}

// 間違えた問題復習ページ
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

  const playSound = useCallback((soundFile: string) => {
    if (isMuted) return
    audioRef.current = new Audio(soundFile)
    audioRef.current.volume = 0.5
    audioRef.current.play().catch(() => {})
  }, [isMuted])

  const allQuestions = [
    { q: "クォーターライフ・クライシスは何歳頃に起こる現象ですか？", options: ["10代から20代前半", "20代から30代前半", "40代から50代前半"], correct: 1 },
    { q: "研究によると、18〜35歳の何%がクォーターライフ・クライシスを経験しますか？", options: ["約30%", "約50%", "約70%"], correct: 2 },
    { q: "クォーターライフ・クライシスを乗り越えるために大切な考え方は？", options: ["人生には正しいレールがある", "人生は直線ではない", "25歳までに全てを決めるべき"], correct: 1 },
    { q: "「〇歳までに△△しなければ」という基準は多くの場合、誰が決めたものですか？", options: ["自分自身", "社会や親", "科学的な研究"], correct: 1 },
    { q: "エクスポージャーとは何をすることですか？", options: ["恐怖から逃げ続けること", "恐怖にあえて向き合うこと", "恐怖を忘れること"], correct: 1 }
  ]

  const questions = wrongAnswers.map(idx => allQuestions[idx])
  const currentQuestion = questions[currentIndex]
  if (!currentQuestion) { onComplete(); return null }

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
    <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in" style={{ background: "#f0f4ff" }}>
      <ConfettiCanvas isActive={showPointAnimation} duration={1000} particleCount={30} points={50} />
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center py-4"><h1 className="text-2xl font-bold text-gray-800">💖 間違えた問題の復習 💖</h1><p className="text-sm text-gray-500 mt-2">正解すると50pt獲得！</p></div>
        <div className="flex justify-end"><div className="text-indigo-600 text-xl font-extrabold">🏆 {totalPoints}pt</div></div>
        <div className="bg-white rounded-2xl p-8 shadow-md border border-orange-100">
          <p className="text-xs tracking-widest text-orange-600 mb-4">💖 復習問題 {currentIndex + 1} / {questions.length}</p>
          <p className="text-lg font-bold mb-7">{currentQuestion.q}</p>
          <div className="space-y-3">
            {currentQuestion.options.map((opt, i) => (
              <button key={i} onClick={() => handleSelectAnswer(i)} disabled={answered}
                className={`w-full text-left border-2 rounded-xl p-4 text-sm flex items-center gap-3 transition-all ${answered ? (i === currentQuestion.correct ? "bg-green-50 border-green-500" : i === selectedAnswer ? "bg-red-50 border-red-400" : "bg-gray-50 opacity-60") : "bg-gray-50 border-orange-100 hover:border-orange-500"}`}>
                <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${answered && i === currentQuestion.correct ? "border-green-500 text-green-600 bg-green-100" : answered && i === selectedAnswer ? "border-red-400 text-red-500 bg-red-100" : "border-gray-400 text-gray-500"}`}>
                  {answered ? (i === currentQuestion.correct ? "✓" : i === selectedAnswer ? "✗" : String.fromCharCode(65 + i)) : String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            ))}
          </div>
          {answered && <div className="mt-5 text-center"><button onClick={handleNext} className="border-2 border-orange-500 text-orange-600 font-bold px-8 py-3 rounded-full hover:bg-orange-500 hover:text-white transition-all">{currentIndex < questions.length - 1 ? "次の問題へ →" : "復習完了！ →"}</button></div>}
          <AffiliateComponent />
          <div className="mt-5 text-center"><button onClick={onExit} className="text-gray-500 hover:text-gray-700 underline text-sm">終了する</button></div>
        </div>
      </div>
    </div>
  )
}

// アンケートページ
const SurveyPage = ({
  totalPoints,
  setTotalPoints,
  onComplete,
  onExit,
  isMuted
}: {
  totalPoints: number
  setTotalPoints: (value: number | ((prev: number) => number)) => void
  onComplete: () => void
  onExit: () => void
  isMuted: boolean
}) => {
  const [gender, setGender] = useState('')
  const [ageGroup, setAgeGroup] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playSound = useCallback((soundFile: string) => {
    if (isMuted) return
    audioRef.current = new Audio(soundFile)
    audioRef.current.volume = 0.5
    audioRef.current.play().catch(() => {})
  }, [isMuted])

  const handleSelect = (type: 'gender' | 'age', value: string) => {
    if (type === 'gender' && !gender) {
      setGender(value)
      setTotalPoints(prev => prev + 100)
      playSound('/sound/100pt.mp3')
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 1000)
    } else if (type === 'age' && !ageGroup) {
      setAgeGroup(value)
      setTotalPoints(prev => prev + 100)
      playSound('/sound/100pt.mp3')
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 1000)
    }
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in overflow-y-auto" style={{ background: "#f0f4ff" }}>
      <ConfettiCanvas isActive={showConfetti} duration={1000} particleCount={50} points={100} />
      <div className="w-full max-w-2xl space-y-6 pb-20">
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-indigo-800">💕 簡単なアンケート 💕</h1>
          <div className="text-indigo-600 text-xl font-extrabold mt-2">🏆 {totalPoints}pt</div>
        </div>

        <div className="bg-white rounded-2xl p-7 shadow-md border border-indigo-100">
          <h2 className="text-indigo-600 font-bold mb-5">👤 基本情報 <span className="text-yellow-600 text-sm">各+100pt</span></h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">性別</label>
              <div className="flex flex-wrap gap-2">
                {["男性", "女性", "その他", "回答しない"].map((option) => (
                  <button key={option} onClick={() => handleSelect('gender', option)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm transition-all ${gender === option ? "bg-indigo-500 text-white border-indigo-500" : gender ? "bg-gray-100 text-gray-400 border-gray-200" : "bg-gray-50 text-gray-700 border-indigo-100 hover:border-indigo-500"}`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">年代</label>
              <div className="flex flex-wrap gap-2">
                {["10代", "20代", "30代", "40代", "50代以上"].map((option) => (
                  <button key={option} onClick={() => handleSelect('age', option)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm transition-all ${ageGroup === option ? "bg-indigo-500 text-white border-indigo-500" : ageGroup ? "bg-gray-100 text-gray-400 border-gray-200" : "bg-gray-50 text-gray-700 border-indigo-100 hover:border-indigo-500"}`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center py-6">
          <button onClick={() => { playSound('/sound/nextpage.mp3'); onComplete() }} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all">
            次へ進む →
          </button>
        </div>
        <AffiliateComponent />
        <div className="text-center"><button onClick={onExit} className="text-gray-500 hover:text-gray-700 underline text-sm">終了する</button></div>
      </div>
    </div>
  )
}

// 結果ページ
const ResultPage = ({
  totalPoints,
  onExit
}: {
  totalPoints: number
  onExit: () => void
}) => {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      <div className="text-center space-y-6 max-w-md bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
        <div className="text-6xl">🎉</div>
        <h1 className="text-3xl font-bold text-indigo-800">ゲーム完了！</h1>
        <div className="text-5xl font-bold text-indigo-600">🏆 {totalPoints}pt</div>
        <p className="text-gray-600">クォーターライフ・クライシスについて理解が深まりましたね！</p>
        <p className="text-sm text-gray-500">「人生に正解のレールはない」を忘れずに、自分らしく進んでいきましょう。</p>

        <AffiliateComponent />

        <div className="pt-4">
          <p className="text-sm text-indigo-600 mb-2">もっとメンタルケアを学びたい方はこちら</p>
          <a href="https://note.com/cozy_pansy9521" target="_blank" rel="noopener noreferrer" className="text-indigo-500 underline hover:text-indigo-700">noteでもっと記事を読む</a>
        </div>

        <button onClick={onExit} className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all">
          終了する
        </button>
      </div>
    </div>
  )
}

// メインコンポーネント
export default function QuarterLifeCrisisGame() {
  const [currentPage, setCurrentPage] = useState<'loading' | 'intro' | 'article' | 'quiz' | 'actionPlan' | 'review' | 'survey' | 'result'>('loading')
  const [isMuted, setIsMuted] = useState(false)
  const [totalPoints, setTotalPoints] = useState(0)
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([])
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([])
  const bgmRef = useRef<HTMLAudioElement | null>(null)

  // BGM管理
  useEffect(() => {
    const shouldPlayBgm = currentPage !== 'loading' && currentPage !== 'intro' && !isMuted

    if (shouldPlayBgm) {
      if (!bgmRef.current) {
        bgmRef.current = new Audio('/sound/gamebgmchild.mp3')
        bgmRef.current.loop = true
        bgmRef.current.volume = 0.3
      }
      bgmRef.current.play().catch(() => {})
    } else if (bgmRef.current) {
      bgmRef.current.pause()
    }

    // タブの可視性変更時にBGMを制御
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (bgmRef.current) {
          bgmRef.current.pause()
        }
      } else {
        if (shouldPlayBgm && bgmRef.current) {
          bgmRef.current.play().catch(() => {})
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      if (bgmRef.current) bgmRef.current.pause()
    }
  }, [currentPage, isMuted])

  const handleAddActionPlan = (when: string, where: string, what: string) => {
    setActionPlans(prev => [...prev, { when, where, what }])
  }

  const handleExit = () => {
    if (bgmRef.current) bgmRef.current.pause()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen">
      {currentPage === 'loading' && <LoadingPage onLoadComplete={() => setCurrentPage('intro')} />}
      {currentPage === 'intro' && <IntroPage onStart={() => setCurrentPage('article')} isMuted={isMuted} setIsMuted={setIsMuted} />}
      {currentPage === 'article' && <ArticleContentPage onComplete={() => setCurrentPage('quiz')} isMuted={isMuted} />}
      {currentPage === 'quiz' && (
        <QuizPage
          onComplete={() => setCurrentPage('actionPlan')}
          onExit={handleExit}
          totalPoints={totalPoints}
          setTotalPoints={setTotalPoints}
          isMuted={isMuted}
          onWrongAnswersUpdate={setWrongAnswers}
        />
      )}
      {currentPage === 'actionPlan' && (
        <ActionPlanPage
          actionPlans={actionPlans}
          totalPoints={totalPoints}
          setTotalPoints={setTotalPoints}
          onActionPlanAdd={handleAddActionPlan}
          onComplete={() => setCurrentPage(wrongAnswers.length > 0 ? 'review' : 'survey')}
          onExit={handleExit}
          isMuted={isMuted}
        />
      )}
      {currentPage === 'review' && (
        <QuizReviewPage
          wrongAnswers={wrongAnswers}
          totalPoints={totalPoints}
          setTotalPoints={setTotalPoints}
          onComplete={() => setCurrentPage('survey')}
          onExit={handleExit}
          isMuted={isMuted}
        />
      )}
      {currentPage === 'survey' && (
        <SurveyPage
          totalPoints={totalPoints}
          setTotalPoints={setTotalPoints}
          onComplete={() => setCurrentPage('result')}
          onExit={handleExit}
          isMuted={isMuted}
        />
      )}
      {currentPage === 'result' && <ResultPage totalPoints={totalPoints} onExit={handleExit} />}
    </div>
  )
}
