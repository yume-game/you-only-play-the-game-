"use client"

import { useState } from "react"
import { Search } from "@/components/search/search"
import { QuizCard } from "@/components/quiz-card/quiz-card"
import { FeaturedQuiz } from "@/components/featured-quiz/featured-quiz"
import { Header } from "@/components/header/header"
import { PainMeter } from "@/components/pain-meter"
import Image from "next/image"
import { Play, Music, Twitter } from "lucide-react"

// サンプルデータ
const quizData = [
  {
    id: 1,
    gameId: "pervasiveness", // URL: /games/pervasiveness
    title: "視野を広げるゲーム",
    description: "人生なんにもうまくいかないと思ったとき、視野を広げることであなたをより楽にするゲームです。",
    category: "トラウマ",
    image: "/image/pervasiveness-top-image.png",
    difficulty: "初級",
    duration: "5-10分",
    tags: ["認知行動療法", "トラウマ"],
    featured: true,
  },
  {
    id: 2,
    gameId: "selfworth", // URL: /games/anxiety-relief
    title: "自分の欲しい物を見つけるゲーム",
    description: "ＳＮＳなどで他人の人生をみることが原因で起こる自分の価値観を見直すことで自分の幸福とは何か知ることを目指します。",
    category: "価値観",
    image: "/image/worthtop.png",
    difficulty: "初級",
    duration: "3-10分",
    tags: ["価値観", "人生の意味"],
    featured: false,
  },
]

// 記事データ（ゲーム一覧の下に表示）
const articleData = [
  {
    id: 3,
    gameId: "art", // URL: /games/art/start
    title: "メンタル改善に効果がある見るだけアート",
    description: "見るだけでアートは、ストレスホルモンコルチゾールの値を下げます。",
    category: "アート",
    image: "/image/art1.png",
    difficulty: "初級",
    duration: "2-5分",
    tags: ["アート", "鬱", "つらい"],
    featured: false,
  },
]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredQuizzes = quizData.filter((quiz) => quiz.title.toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredArticles = articleData.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-forest-50 text-forest-900">
      <Header />

      <main className="container mx-auto py-8 px-4">
        <div className="text-center mb-6">
          <p className="text-xl font-extrabold text-forest-800">！！無料なのは今だけ！！</p>
        </div>

        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-forest-700" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>ポジティブを覚醒させるゲームたち</h2>
            <p className="text-forest-600 max-w-2xl mx-auto mb-8 font-bold">
              実は、いろんなことに気付くとメンタルは治っていくんです。
            </p>
            <div className="mb-8">
              <PainMeter />
            </div>
            <Search onSearch={setSearchQuery} />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-forest-700">注目のゲーム</h2>
          <FeaturedQuiz />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-forest-700">ゲーム一覧</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
          {filteredQuizzes.length === 0 && (
            <p className="text-center text-forest-500 mt-8">
              該当するクイズが見つかりませんでした。検索条件を変更してお試しください。
            </p>
          )}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-forest-700">記事一覧</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArticles.map((article) => (
              <QuizCard key={article.id} quiz={article} />
            ))}
          </div>
          {filteredArticles.length === 0 && (
            <p className="text-center text-forest-500 mt-8">
              該当する記事が見つかりませんでした。
            </p>
          )}
        </section>
        
        
      </main>

      <div className="flex justify-center bg-forest-50 py-8">
        <iframe
          width="400"
          height="400"
          srcDoc={`
            <!DOCTYPE html>
              <html lang="ja">
                  <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                          margin: 0;
                          padding: 0;
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          min-height: 100vh;
                          background-color: transparent;
                        }
                        .afi {
                          display: flex;
                          justify-content: center;
                          align-items: center;
                        }
                        .afi a img {
                          width: 380px !important;
                          height: 380px !important;
                          border-radius: 12px;
                          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                        }
                    </style>
                  </head>
                  <body>
                      <div className="afi">
                       <a href="https://px.a8.net/svt/ejp?a8mat=45167E+679KMQ+5OI8+5ZU29" rel="nofollow"><img border="0" width="100" height="100" alt="" src="https://www27.a8.net/svt/bgt?aid=250317482375&wid=001&eno=01&mid=s00000026504001007000&mc=1"></a><img border="0" width="1" height="1" src="https://www11.a8.net/0.gif?a8mat=45167E+679KMQ+5OI8+5ZU29" alt="">
                       </div>
                   </body>
               </html>
           `}
        />
      </div>

      
      

      <footer className="bg-forest-200 py-8 border-t border-forest-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-2xl mb-4 text-forest-700">yumeのメンタルゲーム</h3>
              <p className="text-forest-600 mb-4">
                ゲームしてたら、いつの間にか、「あれ？めっちゃ楽じゃね？」となるを目指しています。
              </p>
              <p className="text-forest-600">ゲーム内でのご回答していただいた内容は機密資料としての保管を徹底いたします。
                このサイトはアフィリエイトを含みます
            
              </p>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-4 text-forest-700">制作者について</h4>
              <p className="text-forest-600 mb-4">
                こんにちは、yumeです！科学的な文献をもとに培ったメンタルの知識をもとに、ゲームを作ることであなたが楽しく楽になることを目指して日々を過ごしてます。最近はこれといった趣味がなく、模索中です(笑)
              </p>
              <p className="text-forest-600 mb-4">
                よろしくお願いいたします。
              </p>

              {/* SNSリンク */}
              <div className="mt-6">
                <h5 className="font-semibold text-lg mb-3 text-forest-700">SNSでも情報発信中</h5>
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
            <p>© 2025 yumeのゲーム. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

