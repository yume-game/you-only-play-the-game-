"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

type TermsOfServiceProps = {
  isOpen: boolean
  onClose: () => void
}

export function TermsOfService({ isOpen, onClose }: TermsOfServiceProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[80vh] flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">利用規約</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="閉じる"
          >
            <X size={24} />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6 text-gray-700">
            <section>
              <h3 className="text-lg font-bold mb-2">第1条 本規約の目的と同意</h3>
              <p className="mb-2">
                本規約は、本ゲームサービス（以下「本サービス」といいます。）の利用に関する当社と利用者との間の権利義務関係を定めることを目的とします。
              </p>
              <p className="mb-2">利用者は、本サービスを利用した利用データを以下の目的のために利用します。</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>本サービスの円滑な運営および改善のため。</li>
                <li>
                  アフィリエイト広告とコピーライティングの組み合わせの中で、最も高いクリック率を持つパターンを特定し、広告効果の最適化を図るため。
                </li>
                <li>
                  利用者一人ひとりの興味や傾向に合わせたコンテンツやアフィリエイト広告を提示し、より良いサービス体験を提供するため。
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-2">第4条 サービス提供に関する免責事項</h3>
              <p className="mb-2">
                本サービスは、利用者の心の状態の「気づき」や「内省」を促すことを目的としたセルフケア支援ツールであり、いかなる病気や症状の「治療」「治癒」「改善」を保証するものではありません。
              </p>
              <p className="mb-2">
                本サービスが提供する情報は、専門的な医療アドバイスに代わるものではありません。利用者の健康や精神状態に問題がある場合、または悪化した場合の事前の書面による承諾を得ることなく、私的利用の範囲を超えて使用することはできません。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-2">第7条 損害賠償</h3>
              <p>
                利用者が本規約に違反し、当社に損害を与えた場合、当社は利用者に対し、その損害の賠償を請求できるものとします。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-2">第8条 サービスの変更・終了</h3>
              <p>
                当社は、利用者に事前に通知することなく、本サービスの内容をいつでも変更、中断、または終了できるものとします。これにより利用者に生じた損害について、当社は一切の責任を負いません。
              </p>
            </section>
          </div>
        </div>

        {/* フッター */}
        <div className="p-6 border-t">
          <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700 text-white">
            閉じる
          </Button>
        </div>
      </div>
    </div>
  )
}
