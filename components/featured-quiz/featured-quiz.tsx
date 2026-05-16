"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link" // Linkコンポーネントをインポート
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/LanguageContext"
import { homeTranslations, type HomeTranslationKey } from "@/locales/home-translations"

export function FeaturedQuiz() {
  const { language } = useLanguage()
  const t = (key: HomeTranslationKey) => homeTranslations[language][key]
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const router = useRouter()
  // クイズページへのパスを定義
  const quizPath = "/games/expose";

  const handleStartGame = () => {
    setIsLoading(true)
    setLoadingProgress(0)
    
    const loadingDuration = Math.random() * 2000 + 2000 // 2-4秒のランダム
    const interval = 50 // 50msごとに更新
    const increment = (100 * interval) / loadingDuration
    
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + increment
        if (newProgress >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            router.push(quizPath)
          }, 100)
          return 100
        }
        return newProgress
      })
    }, interval)
  }
  
  return (
    <div className="golden-shimmer-border">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-forest-500 to-forest-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
        <div className="flex flex-col justify-center">
          <Badge variant="outline" className="w-fit mb-4 text-white border-white hover:bg-white/20">
            {t("featured_badge")}
          </Badge>
          <h3 className="text-2xl md:text-3xl font-extrabold mb-2" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>{t("featured_title")}</h3>
          <p className="text-white/80 mb-4">
            {t("featured_description")}
          </p>
          
          {/* <CHANGE> ロード状態に応じてボタンを変更 */}
          <div className="flex flex-wrap gap-3">
            {isLoading ? (
              <div className="w-full">
                <div className="bg-white/20 rounded-lg p-4 mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{t("featured_loading")}</span>
                    <span className="text-sm font-bold">{Math.round(loadingProgress)}%</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-3">
                    <div 
                      className="bg-white h-3 rounded-full transition-all duration-100 ease-out"
                      style={{ width: `${loadingProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <Button
                onClick={handleStartGame}
                className="bg-white text-forest-600 hover:bg-white/90"
              >
                {t("featured_play_button")}
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center">
          {/* 画像と再生ボタン全体をリンクで包む */}
          <div 
            onClick={isLoading ? undefined : handleStartGame}
            className={`relative w-full max-w-md aspect-[4/3] rounded-lg overflow-hidden group ${!isLoading ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <Image
              src="/image/yumedesigndreamtrue_the_volunteer_man_nostalgic_cinematic_atm_0d2f3e1d-6ee2-4378-b131-762e30c4edb6_0.png"
              alt="不安を明確化することで、変に恐れなくなるゲーム"
              width={320} // 適切なサイズを指定
              height={180} // 適切なサイズを指定
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="rounded-full w-16 h-16 bg-white/20 backdrop-blur-sm border border-white text-white flex items-center justify-center group-hover:bg-white/30 transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-play"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

