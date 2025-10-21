"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"

export function PainMeter() {
  const [painLevel, setPainLevel] = useState(5)

  const handleSliderChange = (value: number[]) => {
    setPainLevel(value[0])
  }

  // 温度計の液体の高さを計算（0-10のスケールを0-100%に変換）
  const liquidHeight = `${painLevel * 10}%`

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-green-50 rounded-3xl shadow-md border border-green-200">
      <h1 className="text-2xl font-bold text-center mb-6 text-green-800">苦しさメーター</h1>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
        {/* 温度計 */}
        <div className="relative w-24 h-64 flex flex-col items-center">
          <div className="text-lg font-semibold mb-2 text-green-700">温度計</div>
          <div className="relative w-16 h-48">
            <div className="absolute inset-0 bg-green-100 rounded-full rounded-t-none overflow-hidden border-2 border-green-400">
              <div
                className="absolute bottom-0 w-full bg-red-500 transition-all duration-500 ease-in-out"
                style={{ height: liquidHeight }}
              />
            </div>
            <div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-8 h-8 rounded-full bg-green-200 border-2 border-green-400 cursor-pointer hover:bg-green-300 transition-colors flex items-center justify-center"
              onClick={(e) => {
                // クリック位置を取得
                const rect = e.currentTarget.getBoundingClientRect()
                const clickX = e.clientX - rect.left
                const centerX = rect.width / 2

                // 左側クリックで減少、右側クリックで増加
                if (clickX < centerX) {
                  // 左側クリック
                  setPainLevel((prev) => Math.max(0, prev - 0.1))
                } else {
                  // 右側クリック
                  setPainLevel((prev) => Math.min(10, prev + 0.1))
                }
              }}
            >
              <div className="w-full h-full flex">
                <div className="w-1/2 h-full hover:bg-green-400/20 rounded-l-full"></div>
                <div className="w-1/2 h-full hover:bg-green-400/20 rounded-r-full"></div>
              </div>
            </div>

            {/* 目盛り */}
            <div className="absolute -left-6 top-0 h-full flex flex-col justify-between py-1">
              {[10, 8, 6, 4, 2, 0].map((mark) => (
                <div key={mark} className="flex items-center">
                  <span className="w-2 h-0.5 bg-green-500"></span>
                  <span className="text-xs ml-1 text-green-700">{mark}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* スコアバー */}
        <div className="w-full md:w-64 flex flex-col items-center">
          <div className="text-lg font-semibold mb-2 text-green-700">現在の苦しさのレベル</div>
          <div className="w-full h-12 flex items-center justify-center text-3xl font-bold mb-4 text-green-800">
            {painLevel.toFixed(1)}
          </div>
          <div className="w-full px-2">
            <div className="py-4">
              <Slider
                defaultValue={[5]}
                max={10}
                step={0.1}
                value={[painLevel]}
                onValueChange={handleSliderChange}
                className="w-full [&>.relative]:h-8 [&_[role=slider]]:h-8 [&_[role=slider]]:w-8 [&_[data-orientation=horizontal]]:h-8"
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-green-600">
              <span>0</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>
          <div className="flex justify-between w-full mt-4 text-sm">
            <div className="text-center">
              <span className="block font-medium text-green-700">苦しくない</span>
            </div>
            <div className="text-center">
              <span className="block font-medium text-green-700">非常に苦しい</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
