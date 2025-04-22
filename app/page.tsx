"use client"

import { useState } from "react"
import { Search } from "@/components/search/search"
import { QuizCard } from "@/components/quiz-card/quiz-card"
import { FeaturedQuiz } from "@/components/featured-quiz/featured-quiz"
import { Header } from "@/components/header/header"
import Image from "next/image"

// サンプルデータ
const quizData = [
  {
    id: 1,
    title: "視野を広げるゲーム",
    description:
      "視野を広げることであなたをより楽にするゲームです。",
    category: "トラウマ",
    image: "/image/pervasiveness-top-image.png",
  },
  // 必要に応じて他の一般知識クイズを追加
]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredQuizzes = quizData.filter((quiz) => quiz.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-forest-50 text-forest-900">
      <Header />

      <main className="container mx-auto py-8 px-4">
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-forest-700">ゲームやってるだけでメンタル勝手に治ってく(自信あり)</h2>
            <p className="text-forest-600 max-w-2xl mx-auto mb-8">
              実は、いろんなことに気付くとメンタルは治っていくんです。
            </p>
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
        
        {/* アフィリエイトリンクセクション - フッターの直前に配置 */}
        <section className="mb-0 py-3 bg-forest-100 rounded-lg">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-semibold mb-2 text-forest-700 text-center">スポンサーリンク</h2>
            <div className="flex justify-center">
              {/* 提供されたアフィリエイトリンクをそのまま使用 */}
              <div className="overflow-hidden rounded-md shadow-md hover:shadow-lg transition-shadow duration-300">
                <a 
                  href="https://t.afi-b.com/visit.php?a=X15505I-A503929m&p=L943732R" 
                  rel="nofollow noopener noreferrer"
                  target="_blank"
                  className="block"
                >
                  <Image
                    src="https://www.afi-b.com/upload_image/15505-1727687620-3.png" 
                    width={728} // 適切なサイズを指定
                    height={90} // 適切なサイズを指定
                    alt="ハロスキンクリニック" 
                    className="w-full h-auto"
                  />
                </a>
                <Image
                  src="https://t.afi-b.com/lead/X15505I/L943732R/A503929m" 
                  width={1} // 適切なサイズを指定
                  height={1} // 適切なサイズを指定 
                  alt="" 
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-forest-200 py-8 border-t border-forest-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-2xl mb-4 text-forest-700">yumeのゲーム</h3>
              <p className="text-forest-600 mb-4">
                ゲームしてたら、いつの間にか、「あれ？めっちゃ楽じゃね？」となるを目指しています。
              </p>
              <p className="text-forest-600">ゲーム内でのご回答していただいた内容は機密資料としての保管を徹底いたします。
            
              </p>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-4 text-forest-700">制作者について</h4>
              <p className="text-forest-600 mb-4">
                こんにちは、yumeです！科学的な文献をもとに培ったメンタルの知識をもとに、ゲームを作ることであなたが楽しく楽になることを目指して日々を過ごしてます。
              </p>
              <p className="text-forest-600">
                よろしくお願いいたします。
              </p>
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

