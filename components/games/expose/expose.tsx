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
import { TermsOfService } from "@/components/terms-of-service/terms-of-service"
import { useLanguage } from "@/contexts/LanguageContext"
import { exposeTranslations, type TranslationKey } from "@/locales/expose-translations"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

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
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const { language } = useLanguage()
  const t = (key: TranslationKey) => exposeTranslations[language][key]

  useEffect(() => {
    window.scrollTo(0, 0)
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

          <Button
            onClick={onStart}
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

// 行動プランページ（不安リスト作成ページ）
const ActionPlanPage = ({
  actionPlans,
  totalPoints,
  setTotalPoints,
  onActionPlanAdd,
  onComplete,
  onTimeUp,
  onExit,
  onFieldComplete,
}: {
  actionPlans: ActionPlan[]
  totalPoints: number
  setTotalPoints: (value: number | ((prev: number) => number)) => void
  onActionPlanAdd: (when: string, where: string, what: string) => void
  onComplete: () => void
  onTimeUp: () => void
  onExit: () => void
  onFieldComplete: () => void
}) => {
  const { language } = useLanguage()
  const t = (key: TranslationKey) => exposeTranslations[language][key]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [currentPlan, setCurrentPlan] = useState<ActionPlan>({ when: "", where: "", what: "" })
  const [showConfetti, setShowConfetti] = useState(false)
  const [showDarkAnimation, setShowDarkAnimation] = useState(false)
  // 初期制限時間は40秒、追加するごとに3秒減る
  const getInitialTime = () => Math.max(10, 40 - (actionPlans.length * 3))
  const [timeLeft, setTimeLeft] = useState(getInitialTime())
  const [timeUpCount, setTimeUpCount] = useState(0)
  const [fieldAnimations, setFieldAnimations] = useState<{ [key: string]: boolean }>({})
  const [animationTimer, setAnimationTimer] = useState<NodeJS.Timeout | null>(null)
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set())

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

  // コンポーネントのアンマウント時にタイマーをクリア
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

      // 既存のタイマーをクリア
      if (animationTimer) {
        clearTimeout(animationTimer)
      }

      // 新しいタイマーを設定
      const newTimer = setTimeout(() => {
        setFieldAnimations({}) // 全てのアニメーションをリセット
      }, 1000)
      setAnimationTimer(newTimer)
    }
  }

  const handleAdd = () => {
    if (currentPlan.when.trim() || currentPlan.where.trim() || currentPlan.what.trim()) {
      onActionPlanAdd(currentPlan.when, currentPlan.where, currentPlan.what)
      setCurrentPlan({ when: "", where: "", what: "" })
      setCompletedFields(new Set()) // フィールド完了状態をリセット
      setShowConfetti(true)
      // 次のレベルに応じた制限時間を設定（追加後なのでactionPlans.length + 1）
      setTimeLeft(Math.max(10, 40 - ((actionPlans.length + 1) * 3)))
      setTimeout(() => {
        setShowConfetti(false)
      }, 1000)
    }
  }

  const hasValidPlan = currentPlan.when.trim() !== "" || currentPlan.where.trim() !== "" || currentPlan.what.trim() !== ""

  // 3回に1回は金色（ゴールド問題）
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

      {/* Confetti Canvas Animation */}
      <ConfettiCanvas
        isActive={showConfetti}
        duration={1000}
        particleCount={50}
        points={
          completedFields.has("when") && !completedFields.has("where")
            ? 100
            : completedFields.has("where") && completedFields.size === 2
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
            <div className="text-green-600 text-lg font-bold">{t("action_plan_title")}</div>
            <div className={`text-2xl font-extrabold ${getTimeColor(timeLeft, timeUpCount)}`}>
              ⏱️{t("remaining_time")} {timeLeft}{t("seconds")}
            </div>
            <div className="text-green-600 text-3xl font-extrabold">🏆{totalPoints}{t("points")}</div>
          </div>

          <h1 className="text-3xl font-bold text-green-800 mb-2 text-center">{t("action_plan_title")}</h1>
          <p className="text-lg text-green-600 mb-6 text-center">
            {t("action_plan_subtitle")}
          </p>

          {/* 不安リスト入力フォーム */}
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
              🎯 {t("action_plan_new")}（{t("action_plan_difficulty")}{actionPlans.length + 1}）
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">{t("action_plan_when")}</label>
                <div className="flex gap-2">
                  <div className={`relative transition-all duration-500 flex-1 ${fieldAnimations['field-when'] ? "bg-green-50 rounded-lg p-1" : ""}`}>
                    {/* 草エフェクトを上側に固定表示 */}
                    {fieldAnimations['field-when'] && (
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-green-500 text-xl z-10 animate-bounce">
                        🌿
                      </span>
                    )}
                    <Input
                      type="text"
                      placeholder={t("action_plan_when_placeholder")}
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
                    {completedFields.has("when") ? "✓" : t("action_plan_submit")}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">{t("action_plan_where")}</label>
                <div className="flex gap-2">
                  <div className={`relative transition-all duration-500 flex-1 ${fieldAnimations['field-where'] ? "bg-green-50 rounded-lg p-1" : ""}`}>
                    {/* 草エフェクトを上側に固定表示 */}
                    {fieldAnimations['field-where'] && (
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-green-500 text-xl z-10 animate-bounce">
                        🌿
                      </span>
                    )}
                    <Input
                      type="text"
                      placeholder={t("action_plan_where_placeholder")}
                      value={currentPlan.where}
                      onChange={(e) => handleInputChange("where", e.target.value)}
                      className={`w-full ${fieldAnimations['field-where'] ? "border-green-400 shadow-lg" : ""}`}
                      disabled={!completedFields.has("when")}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (currentPlan.where.trim() && !completedFields.has("where")) {
                        setTotalPoints((prev) => prev + 200) // 2個目は200pt
                        setCompletedFields((prev) => new Set(prev).add("where"))
                        setShowConfetti(true)
                        setTimeout(() => setShowConfetti(false), 1000)
                      }
                    }}
                    disabled={!currentPlan.where.trim() || completedFields.has("where") || !completedFields.has("when")}
                    className={`px-4 py-2 text-sm font-medium ${
                      completedFields.has("where")
                        ? "bg-green-500 text-white cursor-default"
                        : !currentPlan.where.trim() || !completedFields.has("when")
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {completedFields.has("where") ? "✓" : t("action_plan_submit")}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">{t("action_plan_what")}</label>
                <div className={`relative transition-all duration-500 ${fieldAnimations['field-what'] ? "bg-green-50 rounded-lg p-1" : ""}`}>
                  {/* 草エフェクトを上側に固定表示 */}
                  {fieldAnimations['field-what'] && (
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-green-500 text-xl z-10 animate-bounce">
                      🌿
                    </span>
                  )}
                  <Input
                    type="text"
                    placeholder={t("action_plan_what_placeholder")}
                    value={currentPlan.what}
                    onChange={(e) => handleInputChange("what", e.target.value)}
                    className={`w-full ${fieldAnimations['field-what'] ? "border-green-400 shadow-lg" : ""}`}
                  />
                </div>
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
                <span>{t("action_plan_add")}</span>
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
            {t("action_plan_complete")}
          </Button>

          {/* 作成済みの不安リスト */}
          {actionPlans.length > 0 && (
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-green-800 mb-4">✅ {t("action_plan_created_list")}</h2>
              <div className="space-y-3">
                {actionPlans.map((plan, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <span className="bg-blue-500 text-white font-bold min-w-[28px] h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-1 text-sm">
                        <p className="text-gray-700">
                          <span className="font-bold text-blue-700">{t("action_plan_when_label")}</span> {plan.when || t("action_plan_not_entered")}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-bold text-blue-700">{t("action_plan_where_label")}</span> {plan.where || t("action_plan_not_entered")}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-bold text-blue-700">{t("action_plan_what_label")}</span> {plan.what || t("action_plan_not_entered")}
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
            {t("action_plan_exit")}
          </Button>
        </div>
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
  onExit
}: {
  actionPlans: ActionPlan[]
  totalPoints: number
  onImageComplete: () => void
  onAddPoints: () => void
  onExit: () => void
}) => {
  const { language } = useLanguage()
  const t = (key: TranslationKey) => exposeTranslations[language][key]

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const leavesRef = useRef<Leaf[]>([])
  const [currentLevel, setCurrentLevel] = useState(0) // 現在のレベル（0から始まる）
  const [timeLeft, setTimeLeft] = useState(30) // 各レベル30秒
  const [isActive, setIsActive] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const [hasAddedPoints, setHasAddedPoints] = useState(false) // ポイント追加済みフラグ

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
    <div className="relative h-screen w-full overflow-hidden bg-green-100">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <ConfettiCanvas
        isActive={showConfetti}
        duration={1000}
        particleCount={50}
        points={300}
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between p-8">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            {/* 作成数メーター */}
            <div className="mb-4 bg-white/90 p-4 rounded-lg">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-lg font-bold text-gray-700">{t("viz_progress")}</span>
                <span className="text-xl font-extrabold text-gray-900">
                  {currentLevel + 1} / {actionPlans.length}
                </span>
              </div>
              <div className="w-64 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getLevelBgColor(currentLevel)} transition-all duration-500`}
                  style={{ width: `${((currentLevel + 1) / actionPlans.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <h1 className={`mb-2 text-3xl font-bold md:text-5xl ${getLevelColor(currentLevel)}`}>
              {t("viz_your_level")}{currentLevel + 1}
            </h1>
            <div className="mb-6 text-xl font-medium text-green-800 md:text-3xl bg-white/80 p-4 rounded-lg">
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

            {/* 時間メーター（対数関数） */}
            <div className="mb-4 bg-white/90 p-4 rounded-lg w-full max-w-2xl">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-lg font-bold text-gray-700">{t("viz_imagination_time")}</span>
                <h2 className="text-4xl font-bold text-green-900 md:text-5xl">{formatTime(timeLeft)}</h2>
              </div>
              <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getLevelBgColor(currentLevel)} transition-all duration-300`}
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>

            <p className="text-xl font-medium leading-relaxed text-green-800 md:text-3xl md:leading-relaxed">
              {t("viz_imagine_for_30s")}
            </p>
            <div className="mt-4 text-2xl font-bold text-orange-600">
              🏆 {t("viz_current_points")} {totalPoints}{t("points")}
            </div>
          </div>
        </div>

        <div className="pointer-events-auto flex flex-col items-center gap-8 pb-8">
          <Button
            size="lg"
            className="bg-gradient-to-r from-green-500 to-emerald-600 px-12 py-6 text-xl font-bold text-white shadow-lg shadow-green-500/50 transition-all hover:scale-105 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl hover:shadow-green-500/60"
            onClick={() => {
              // ボタンクリック時はポイント追加しない（30秒経過時のみ追加）
              setShowConfetti(true) // アニメーション表示
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
            }}
          >
            {currentLevel < actionPlans.length - 1 ? t("viz_next_level") : t("viz_imagination_complete")}
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="border-2 border-green-600/50 bg-white/50 px-8 py-2 text-sm text-green-800 backdrop-blur-sm transition-all hover:border-green-700/70 hover:bg-white/70 hover:text-green-900"
            onClick={onExit}
          >
            {t("viz_exit")}
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
  const { language } = useLanguage()
  const t = (key: TranslationKey) => exposeTranslations[language][key]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/background-bright-forest-road.png"
          alt={t("survey_title")}
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

      <div className="relative z-10 max-w-2xl w-full space-y-6">
        <div className="text-center bg-white bg-opacity-95 rounded-xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-green-800 mb-8">{t("survey_title")}</h1>

          <div className="space-y-8">
            <div className="bg-white bg-opacity-90 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {t("survey_enjoyment")}
              </h3>
              <input
                type="range"
                min="1"
                max="10"
                value={enjoymentRating}
                onChange={(e) => setEnjoymentRating(Number.parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                aria-label={t("survey_enjoyment")}
              />
              <p className="text-center text-gray-600">{enjoymentRating}</p>
            </div>

            <div className="bg-white bg-opacity-90 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {t("survey_improvement")}
              </h3>
              <input
                type="range"
                min="1"
                max="10"
                value={improvementRating}
                onChange={(e) => setImprovementRating(Number.parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                aria-label={t("survey_improvement")}
              />
              <p className="text-center text-gray-600">{improvementRating}</p>
            </div>
          </div>

          <Button onClick={onSubmit} className="mt-8 bg-green-500 hover:bg-green-600 text-white px-8 py-3 w-full">
            {t("survey_submit")}
          </Button>
        </div>
      </div>
    </div>
  )
}

const ResultPage = ({
  totalPoints,
  actionPlans,
  onRestart,
  onExit,
}: {
  totalPoints: number
  actionPlans: ActionPlan[]
  onRestart: () => void
  onExit: () => void
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
          action_plans: actionPlans.map(plan => `いつ: ${plan.when}, どこで: ${plan.where}, どんなことが起こる: ${plan.what}`).filter(action => action.trim() !== ""),
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

          if (shouldRedirect && redirectUrl) {
            setTimeout(() => {
              window.open(redirectUrl, "_blank")
            }, 200)
          }
        })
      }
    },
    [isSubmitting, hasSubmitted, totalPoints, affiliatePatternIndex, actionPlans],
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
  const [gameState, setGameState] = useState<"intro" | "action" | "visualization" | "survey" | "result">("intro")
  const [totalPoints, setTotalPoints] = useState(0)
  const [enjoymentRating, setEnjoymentRating] = useState(5)
  const [improvementRating, setImprovementRating] = useState(5)
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([])

  const handleTimeUp = () => {
    setTotalPoints((prev) => prev - 50)
  }

  // フィールド完了時に100pt追加
  const handleFieldComplete = () => {
    setTotalPoints((prev) => prev + 100)
  }

  // 不安リストの追加ハンドラー（3回に1回は900pt、それ以外は600pt）
  const handleActionPlanAdd = (when: string, where: string, what: string) => {
    setActionPlans((prev) => [...prev, { when, where, what }])
    const isGolden = (actionPlans.length + 1) % 3 === 0
    setTotalPoints((prev) => prev + (isGolden ? 900 : 600))
  }

  // 不安リストから不安イメージページへ
  const handleActionComplete = () => {
    setGameState("visualization")
  }

  // 想像完了時に300pt追加
  const handleAddPoints = () => {
    setTotalPoints((prev) => prev + 300)
  }

  // 不安イメージからアンケートページへ
  const handleVisualizationComplete = () => {
    setGameState("survey")
  }

  const handleSurveySubmit = () => {
    // アンケート結果をSupabaseに保存
    if (supabase) {
      supabase.from("quiz_responses").insert({
        total_points: totalPoints,
        affiliate_pattern_index: 0,
        affiliate_clicked: false,
        affiliate_click_type: "survey_completion",
        action_plans: actionPlans.map(plan => `いつ: ${plan.when}, どこで: ${plan.where}, どんなことが起こる: ${plan.what}`),
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

  const handleRestart = () => {
    setGameState("intro")
    setTotalPoints(0)
    setEnjoymentRating(5)
    setImprovementRating(5)
    setActionPlans([])
  }

  const handleExit = () => {
    router.push("/")
  }

  const handleDirectToAffiliate = () => {
    setGameState("result")
  }

  return (
    <AnimatePresence mode="wait">
      {gameState === "intro" && <IntroPage key="intro" onStart={() => setGameState("action")} />}
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
          actionPlans={actionPlans}
          onRestart={handleRestart}
          onExit={handleExit}
        />
      )}
    </AnimatePresence>
  )
}

export default ExposeGame
