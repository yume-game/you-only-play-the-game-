"use client"

import { useState } from "react"
import { Search } from "@/components/search/search"
import { QuizCard } from "@/components/quiz-card/quiz-card"
import { FeaturedQuiz } from "@/components/featured-quiz/featured-quiz"
import { Header } from "@/components/header/header"
import { PainMeter } from "@/components/pain-meter"
import Image from "next/image"
import { Play, Music, Twitter } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { homeTranslations, type HomeTranslationKey } from "@/locales/home-translations"

// サンプルデータ
const quizData = [
  // {
  //   id: 1,
  //   gameId: "pervasiveness", // URL: /games/pervasiveness
  //   title: "視野を広げるゲーム",
  //   description: "人生なんにもうまくいかないと思ったとき、視野を広げることであなたをより楽にするゲームです。",
  //   category: "トラウマ",
  //   image: "/image/pervasiveness-top-image.png",
  //   difficulty: "初級",
  //   duration: "5-10分",
  //   tags: ["認知行動療法", "トラウマ"],
  //   featured: false,
  // },
  {
    id: 2,
    gameId: "selfworth", // URL: /games/anxiety-relief
    titleKey: "game_selfworth_title",
    descriptionKey: "game_selfworth_description",
    categoryKey: "game_selfworth_category",
    image: "/image/worthtop.png",
    difficultyKey: "difficulty_beginner",
    durationKey: "duration_3_10",
    tagKeys: ["game_selfworth_tags_1", "game_selfworth_tags_2"],
    featured: false,
  },
  {
    id: 5,
    gameId: "selfworthrelative", // URL: /games/selfworthrelative
    titleKey: "game_selfworthrelative_title",
    descriptionKey: "game_selfworthrelative_description",
    categoryKey: "game_selfworthrelative_category",
    image: "/image/worthho17.png",
    difficultyKey: "difficulty_beginner",
    durationKey: "duration_3_10",
    tagKeys: ["game_selfworthrelative_tags_1", "game_selfworthrelative_tags_2", "game_selfworthrelative_tags_3"],
    featured: true,
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
    id: 8,
    gameId: "logic", // URL: /games/logic
    titleKey: "game_logic_title",
    descriptionKey: "game_logic_description",
    categoryKey: "game_logic_category",
    image: "/image/art38.png",
    difficultyKey: "difficulty_beginner",
    durationKey: "duration_3_10",
    tagKeys: ["game_logic_tags_1", "game_logic_tags_2", "game_logic_tags_3"],
    featured: false,
  },
  // {
  //   id: 9,
  //   gameId: "clicker", // URL: /games/clicker
  //   title: "にこちゃんクリックゲーム",
  //   description: "落ちてくるにこちゃんをたくさんクリックすることで日常のポジティブに目が行くようになります。",
  //   category: "ミニゲーム",
  //   image: "/image/art41.png",
  //   difficulty: "初級",
  //   duration: "1-2分",
  //   tags: ["クリッカー", "ミニゲーム", "反射神経"],
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
]

export default function Home() {
  const { language } = useLanguage()
  const t = (key: HomeTranslationKey) => homeTranslations[language][key]
  const [searchQuery, setSearchQuery] = useState("")

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

  return (
    <div className="min-h-screen bg-forest-50 text-forest-900">
      <Header />

      <main className="container mx-auto py-8 px-4">
        <div className="text-center mb-6">
          <p className="text-xl font-extrabold text-forest-800">{t("free_now")}</p>
          <p className="text-lg font-bold text-forest-700 mt-2">ブックマーク忘れずに</p>
        </div>

        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-forest-700" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>{t("hero_title")}</h2>
            <p className="text-forest-600 max-w-2xl mx-auto mb-8 font-bold">
              {t("hero_description")}
            </p>
            <Search onSearch={setSearchQuery} />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-forest-700">{t("featured_games")}</h2>
          <FeaturedQuiz />
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
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-forest-300 text-center text-forest-600">
            <p>{t("footer_copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

