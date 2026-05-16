"use client"

import { useState, useEffect } from "react"
import { Search } from "@/components/search/search"
import { QuizCard } from "@/components/quiz-card/quiz-card"
import { FeaturedQuiz } from "@/components/featured-quiz/featured-quiz"
import { Header } from "@/components/header/header"
import { PainMeter } from "@/components/pain-meter"
import Image from "next/image"
import { Play, Music, Twitter, PenLine } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { homeTranslations, type HomeTranslationKey } from "@/locales/home-translations"

// サンプルデータ
const quizData = [
  {
    id: 18,
    gameId: "valuediscovery", // URL: /games/valuediscovery
    titleKey: "game_valuediscovery_title",
    descriptionKey: "game_valuediscovery_description",
    categoryKey: "game_valuediscovery_category",
    image: "/image/art15.png",
    difficultyKey: "difficulty_beginner",
    durationKey: "duration_3_10",
    tagKeys: ["game_valuediscovery_tags_1", "game_valuediscovery_tags_2", "game_valuediscovery_tags_3"],
    featured: false,
  },
  {
    id: 19,
    gameId: "desirediscovery", // URL: /games/desirediscovery
    titleKey: "game_desirediscovery_title",
    descriptionKey: "game_desirediscovery_description",
    categoryKey: "game_desirediscovery_category",
    image: "/image/art17.png",
    difficultyKey: "difficulty_beginner",
    durationKey: "duration_3_10",
    tagKeys: ["game_desirediscovery_tags_1", "game_desirediscovery_tags_2", "game_desirediscovery_tags_3"],
    featured: false,
  },
  {
    id: 6,
    gameId: "expose", // URL: /games/expose
    titleKey: "game_expose_title",
    descriptionKey: "game_expose_description",
    categoryKey: "game_expose_category",
    image: "/image/art30.png",
    difficultyKey: "difficulty_beginner",
    durationKey: "duration_3_10",
    tagKeys: ["game_expose_tags_1", "game_expose_tags_2", "game_expose_tags_3"],
    featured: false,
  },
  {
    id: 7,
    gameId: "thanks", // URL: /games/thanks
    titleKey: "game_thanks_title",
    descriptionKey: "game_thanks_description",
    categoryKey: "game_thanks_category",
    image: "/image/art39.png",
    difficultyKey: "difficulty_beginner",
    durationKey: "duration_3_10",
    tagKeys: ["game_thanks_tags_1", "game_thanks_tags_2", "game_thanks_tags_3"],
    featured: false,
  },
  {
    id: 11,
    gameId: "actionboost", // URL: /games/actionboost
    titleKey: "game_actionboost_title",
    descriptionKey: "game_actionboost_description",
    categoryKey: "game_actionboost_category",
    image: "/image/art10.png",
    difficultyKey: "difficulty_beginner",
    durationKey: "duration_3_10",
    tagKeys: ["game_actionboost_tags_1", "game_actionboost_tags_2", "game_actionboost_tags_3"],
    featured: false,
  },
  {
    id: 12,
    gameId: "quarterlife", // URL: /games/quarterlife
    titleKey: "game_quarterlife_title",
    descriptionKey: "game_quarterlife_description",
    categoryKey: "game_quarterlife_category",
    image: "/image/art5.png",
    difficultyKey: "difficulty_beginner",
    durationKey: "duration_3_10",
    tagKeys: ["game_quarterlife_tags_1", "game_quarterlife_tags_2", "game_quarterlife_tags_3"],
    featured: false,
  },
  // エクスポージャーテーマ別カード
  {
    id: 13,
    gameId: "expose?theme=perfectionism",
    titleKey: "game_expose_perfectionism_title",
    descriptionKey: "game_expose_perfectionism_description",
    categoryKey: "game_expose_category",
    image: "/image/art30.png",
    difficultyKey: "difficulty_beginner",
    durationKey: "duration_5_15",
    tagKeys: ["game_expose_tags_1", "game_expose_tags_2"],
    featured: false,
  },
  {
    id: 14,
    gameId: "expose?theme=asking-out",
    titleKey: "game_expose_askingout_title",
    descriptionKey: "game_expose_askingout_description",
    categoryKey: "game_expose_category",
    image: "/image/art30.png",
    difficultyKey: "difficulty_beginner",
    durationKey: "duration_5_15",
    tagKeys: ["game_expose_tags_1", "game_expose_tags_2"],
    featured: false,
  },
  {
    id: 15,
    gameId: "expose?theme=public-speaking",
    titleKey: "game_expose_publicspeaking_title",
    descriptionKey: "game_expose_publicspeaking_description",
    categoryKey: "game_expose_category",
    image: "/image/art30.png",
    difficultyKey: "difficulty_beginner",
    durationKey: "duration_5_15",
    tagKeys: ["game_expose_tags_1", "game_expose_tags_2"],
    featured: false,
  },
  {
    id: 16,
    gameId: "expose?theme=rejection",
    titleKey: "game_expose_rejection_title",
    descriptionKey: "game_expose_rejection_description",
    categoryKey: "game_expose_category",
    image: "/image/art30.png",
    difficultyKey: "difficulty_beginner",
    durationKey: "duration_5_15",
    tagKeys: ["game_expose_tags_1", "game_expose_tags_2"],
    featured: false,
  },
  {
    id: 17,
    gameId: "expose?theme=judgment",
    titleKey: "game_expose_judgment_title",
    descriptionKey: "game_expose_judgment_description",
    categoryKey: "game_expose_category",
    image: "/image/art30.png",
    difficultyKey: "difficulty_beginner",
    durationKey: "duration_5_15",
    tagKeys: ["game_expose_tags_1", "game_expose_tags_2"],
    featured: false,
  },
  // {
  //   id: 8,
  //   gameId: "logic", // URL: /games/logic
  //   titleKey: "game_logic_title",
  //   descriptionKey: "game_logic_description",
  //   categoryKey: "game_logic_category",
  //   image: "/image/art38.png",
  //   difficultyKey: "difficulty_beginner",
  //   durationKey: "duration_3_10",
  //   tagKeys: ["game_logic_tags_1", "game_logic_tags_2", "game_logic_tags_3"],
  //   featured: false,
  // },
  // {
  //   id: 9,
  //   gameId: "clicker", // URL: /games/clicker
  //   titleKey: "game_clicker_title",
  //   descriptionKey: "game_clicker_description",
  //   categoryKey: "game_clicker_category",
  //   image: "/image/art41.png",
  //   difficultyKey: "difficulty_beginner",
  //   durationKey: "duration_1_2",
  //   tagKeys: ["game_clicker_tags_1", "game_clicker_tags_2", "game_clicker_tags_3"],
  //   featured: false,
  // },
]

// 記事データ（ゲーム一覧の下に表示）
const articleData = [
  {
    id: 3,
    gameId: "art/gallery", // URL: /games/art/gallery
    titleKey: "article_art_title",
    descriptionKey: "article_art_description",
    categoryKey: "article_art_category",
    image: "/image/art1.png",
    difficultyKey: "difficulty_beginner",
    durationKey: "duration_2_5",
    tagKeys: ["article_art_tags_1", "article_art_tags_2", "article_art_tags_3", "article_art_tags_4"],
    featured: false,
  },
  {
    id: 4,
    gameId: "art2/gallery", // URL: /games/art2/gallery
    titleKey: "article_art2_title",
    descriptionKey: "article_art2_description",
    categoryKey: "article_art2_category",
    image: "/image/art21.png",
    difficultyKey: "difficulty_beginner",
    durationKey: "duration_2_5",
    tagKeys: ["article_art_tags_1", "article_art_tags_2", "article_art_tags_3", "article_art_tags_4"],
    featured: false,
  },
  {
    id: 10,
    gameId: "cat/gallery", // URL: /games/cat/gallery
    titleKey: "article_cat_title",
    descriptionKey: "article_cat_description",
    categoryKey: "article_cat_category",
    image: "/image/cat1/fat_cat_--chaos_100_--ar_916_--stylize_0_--weird_157_--v_7_126edbbf-93a7-4a24-a693-135b5e584192_1.png",
    difficultyKey: "difficulty_beginner",
    durationKey: "duration_2_5",
    tagKeys: ["article_cat_tags_1", "article_cat_tags_2", "article_cat_tags_3"],
    featured: false,
  },
]

// 背景装飾円の固定データ（Hydrationエラー回避のため）
const DECORATION_CIRCLES = [
  { width: 95, height: 72, left: 12, top: 8, delay: 0.3, duration: 3.5 },
  { width: 68, height: 88, left: 85, top: 15, delay: 1.2, duration: 4.2 },
  { width: 112, height: 65, left: 45, top: 75, delay: 0.8, duration: 3.8 },
  { width: 78, height: 102, left: 8, top: 55, delay: 1.5, duration: 2.9 },
  { width: 55, height: 55, left: 72, top: 42, delay: 0.1, duration: 4.5 },
  { width: 88, height: 78, left: 28, top: 22, delay: 1.8, duration: 3.2 },
  { width: 62, height: 92, left: 92, top: 68, delay: 0.6, duration: 4.0 },
  { width: 105, height: 58, left: 55, top: 5, delay: 1.1, duration: 3.6 },
  { width: 72, height: 85, left: 18, top: 88, delay: 0.4, duration: 4.3 },
  { width: 48, height: 68, left: 65, top: 92, delay: 1.9, duration: 2.8 },
]

// ローディングコンポーネント（黄緑色基調）
const LoadingScreen = () => {
  const [progress, setProgress] = useState(0)
  const [dots, setDots] = useState('')

  useEffect(() => {
    // プログレスバーアニメーション
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + Math.random() * 12 + 3
      })
    }, 200)

    // ドットアニメーション
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'))
    }, 400)

    return () => {
      clearInterval(progressInterval)
      clearInterval(dotsInterval)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-lime-400 via-green-400 to-emerald-500 flex flex-col items-center justify-center z-50">
      {/* 背景の装飾円 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {DECORATION_CIRCLES.map((circle, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/20 animate-pulse"
            style={{
              width: circle.width,
              height: circle.height,
              left: `${circle.left}%`,
              top: `${circle.top}%`,
              animationDelay: `${circle.delay}s`,
              animationDuration: `${circle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 flex flex-col items-center">
        {/* アイコン */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center animate-bounce">
              <span className="text-3xl">🌿</span>
            </div>
          </div>
        </div>

        {/* タイトル */}
        <h1 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
          心の回復ゲーム
        </h1>
        <p className="text-white/80 mb-6 text-base">読み込み中{dots}</p>

        {/* プログレスバー */}
        <div className="w-56 h-2.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
          <div
            className="h-full bg-white rounded-full transition-all duration-200 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* パーセンテージ */}
        <p className="mt-3 text-white font-bold text-lg drop-shadow">
          {Math.min(Math.round(progress), 100)}%
        </p>

        {/* スピナー */}
        <div className="mt-4">
          <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const { language } = useLanguage()
  const t = (key: HomeTranslationKey) => homeTranslations[language][key]
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // ローディング完了処理
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // 2秒後にローディング終了

    return () => clearTimeout(timer)
  }, [])

  // 翻訳されたクイズデータ
  const translatedQuizData = quizData.map(quiz => ({
    ...quiz,
    title: t(quiz.titleKey as HomeTranslationKey),
    description: t(quiz.descriptionKey as HomeTranslationKey),
    category: t(quiz.categoryKey as HomeTranslationKey),
    difficulty: t(quiz.difficultyKey as HomeTranslationKey),
    duration: t(quiz.durationKey as HomeTranslationKey),
    tags: quiz.tagKeys?.map(key => t(key as HomeTranslationKey)) || []
  }))

  // 翻訳された記事データ
  const translatedArticleData = articleData.map(article => ({
    ...article,
    title: t(article.titleKey as HomeTranslationKey),
    description: t(article.descriptionKey as HomeTranslationKey),
    category: t(article.categoryKey as HomeTranslationKey),
    difficulty: t(article.difficultyKey as HomeTranslationKey),
    duration: t(article.durationKey as HomeTranslationKey),
    tags: article.tagKeys?.map(key => t(key as HomeTranslationKey)) || []
  }))

  const filteredQuizzes = translatedQuizData.filter((quiz) => quiz.title.toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredArticles = translatedArticleData.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // ローディング中はローディング画面を表示
  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-forest-50 text-forest-900">
      {/* ヘッダーから注目のゲームまでの背景画像エリア */}
      <div className="relative">
        {/* 背景画像レイヤー */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="hidden md:block w-full h-full">
            <Image
              src="/image/ladywhoclever.png"
              alt=""
              fill
              className="object-cover opacity-30"
              priority
            />
          </div>
          <div className="block md:hidden w-full h-full">
            <Image
              src="/image/ladywhocleverphone.png"
              alt=""
              fill
              className="object-cover opacity-30"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-forest-50/50 via-transparent to-forest-50" />
        </div>

        {/* コンテンツ */}
        <div className="relative z-10">
          <Header />

          <div className="container mx-auto py-8 px-4">
            {/* 初めての方へガイドライン */}
            <div className="mb-6 p-4 border-2 border-red-500 bg-red-50 rounded-lg max-w-md">
              <p className="text-red-700 font-bold text-sm">
                初めての方へ。自分の欲求が知りたい人は「自分の欲しいものを見つけるゲーム」を、不快感を減らしたい人は「不安を明確化することで変に恐れなくする」ゲームを遊んでみてね
              </p>
            </div>

            {/* ポジティブを覚醒させるゲームたち + ブックマーク */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-forest-700" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>{t("hero_title")}</h2>
              <p className="text-lg font-bold text-forest-700">ブックマーク忘れずに</p>
            </div>

            {/* 注目のゲーム（FeaturedQuiz） */}
            <section className="mb-12 py-8 px-6">
              <h2 className="text-2xl font-bold mb-6 text-forest-700">{t("featured_games")}</h2>
              <FeaturedQuiz />
            </section>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4">

        <section className="mb-12">
          <div className="text-center mb-8">
            <p className="text-forest-600 max-w-2xl mx-auto mb-8 font-bold">
              {t("hero_description")}
            </p>
            <Search onSearch={setSearchQuery} />
          </div>
        </section>

        <div className="mb-8">
          <PainMeter />
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-forest-700">{t("games_list")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
          {filteredQuizzes.length === 0 && (
            <p className="text-center text-forest-500 mt-8">
              {t("no_quiz_found")}
            </p>
          )}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-forest-700">{t("articles_list")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArticles.map((article) => (
              <QuizCard key={article.id} quiz={article} />
            ))}
          </div>
          {filteredArticles.length === 0 && (
            <p className="text-center text-forest-500 mt-8">
              {t("no_article_found")}
            </p>
          )}
        </section>
      </main>

      <footer className="bg-forest-200 py-8 border-t border-forest-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-2xl mb-4 text-forest-700">{t("footer_title")}</h3>
              <p className="text-forest-600 mb-4">
                {t("footer_description")}
              </p>
              <p className="text-forest-600">{t("footer_privacy")}

              </p>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-4 text-forest-700">{t("footer_about_title")}</h4>
              <p className="text-forest-600 mb-4">
                {t("footer_about_description")}
              </p>
              <p className="text-forest-600 mb-4">
                {t("footer_about_thanks")}
              </p>

              {/* SNSリンク */}
              <div className="mt-6">
                <h5 className="font-semibold text-lg mb-3 text-forest-700">{t("footer_sns_title")}</h5>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://www.tiktok.com/@yumegeimu?is_from_webapp=1&sender_device=pc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-forest-600 hover:text-forest-800 transition-colors bg-forest-100 px-3 py-2 rounded-lg"
                  >
                    <Music size={20} />
                    <span>TikTok</span>
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UC03UIqgV__nUC4s6VNOQFDw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-forest-600 hover:text-forest-800 transition-colors bg-forest-100 px-3 py-2 rounded-lg"
                  >
                    <Play size={20} />
                    <span>YouTube</span>
                  </a>
                  <a
                    href="https://x.com/@KY15161637"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-forest-600 hover:text-forest-800 transition-colors bg-forest-100 px-3 py-2 rounded-lg"
                  >
                    <Twitter size={20} />
                    <span>X (Twitter)</span>
                  </a>
                  <a
                    href="https://note.com/cozy_pansy9521"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-forest-600 hover:text-forest-800 transition-colors bg-forest-100 px-3 py-2 rounded-lg"
                  >
                    <PenLine size={20} />
                    <span>note</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-forest-300 text-center text-forest-600">
            <p className="text-red-600 font-bold mb-4">
              重度のトラウマなどお持ちの方は私のゲームではなく、精神科医にかかる事を推奨いたします
            </p>
            <p>{t("footer_copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

