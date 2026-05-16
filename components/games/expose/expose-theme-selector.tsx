"use client"

import { exposeThemes } from "./expose-themes"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export default function ExposeThemeSelector() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            エクスポージャーゲーム
          </h1>
          <p className="text-gray-600 text-lg">
            向き合いたいテーマを選んでください
          </p>
        </div>

        {/* テーマカード一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exposeThemes.map((theme, index) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/games/expose?theme=${theme.id}`}>
                <div className={`
                  bg-white rounded-2xl shadow-lg hover:shadow-xl
                  transition-all duration-300 hover:-translate-y-1
                  border-4 border-transparent hover:border-green-400
                  overflow-hidden cursor-pointer
                `}>
                  {/* カードヘッダー */}
                  <div className={`bg-gradient-to-r ${theme.color} p-4`}>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{theme.icon}</span>
                      <div>
                        <h2 className="text-xl font-bold text-white">
                          {theme.name}
                        </h2>
                        <p className="text-white/80 text-sm">
                          {theme.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* カード本文 */}
                  <div className="p-4">
                    <p className="text-gray-600 text-sm mb-3">
                      {theme.introText}
                    </p>

                    {/* 不快感の例（2つだけ表示） */}
                    <div className="space-y-2 mb-4">
                      <p className="text-xs text-gray-500 font-semibold">例：</p>
                      {theme.discomfortExamples.slice(0, 2).map((example, idx) => (
                        <div
                          key={idx}
                          className="text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg"
                        >
                          • {example}
                        </div>
                      ))}
                    </div>

                    {/* スタートボタン */}
                    <div className="text-center">
                      <span className={`
                        inline-block bg-gradient-to-r ${theme.color}
                        text-white font-bold px-6 py-2 rounded-full
                        text-sm shadow-md
                      `}>
                        このテーマで始める →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* 汎用テーマカード */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: exposeThemes.length * 0.1 }}
          >
            <Link href="/games/expose">
              <div className={`
                bg-white rounded-2xl shadow-lg hover:shadow-xl
                transition-all duration-300 hover:-translate-y-1
                border-4 border-dashed border-gray-300 hover:border-green-400
                overflow-hidden cursor-pointer
              `}>
                {/* カードヘッダー */}
                <div className="bg-gradient-to-r from-gray-400 to-gray-500 p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">🌿</span>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        その他・自由に設定
                      </h2>
                      <p className="text-white/80 text-sm">
                        上記以外の不安や恐怖に向き合いたい方
                      </p>
                    </div>
                  </div>
                </div>

                {/* カード本文 */}
                <div className="p-4">
                  <p className="text-gray-600 text-sm mb-3">
                    特定のテーマに当てはまらない不安や恐怖がある方は、こちらから自由に設定してゲームを始められます。
                  </p>

                  {/* スタートボタン */}
                  <div className="text-center">
                    <span className="inline-block bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold px-6 py-2 rounded-full text-sm shadow-md">
                      自由に始める →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* 説明文 */}
        <div className="mt-8 bg-white/80 rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>💡</span> エクスポージャーとは？
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            エクスポージャー（暴露療法）は、不安や恐怖を感じる状況に段階的に向き合うことで、
            脳に「これは危険ではない」と再学習させる心理療法です。
            レベル1の簡単なことから始めて、少しずつ難しいことに挑戦していきます。
          </p>
        </div>
      </div>
    </div>
  )
}
