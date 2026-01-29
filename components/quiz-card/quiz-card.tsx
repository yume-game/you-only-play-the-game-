"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Star, Tag } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"
import { homeTranslations, type HomeTranslationKey } from "@/locales/home-translations"

interface Quiz {
  id: number
  gameId?: string
  title: string
  description: string
  category: string
  image: string
  difficulty?: string
  duration?: string
  tags?: string[]
  featured?: boolean
}

interface QuizCardProps {
  quiz: Quiz
}

export function QuizCard({ quiz }: QuizCardProps) {
  const { language } = useLanguage()
  const t = (key: HomeTranslationKey) => homeTranslations[language][key]
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (loadingProgress >= 100 && isLoading && quiz.gameId) {
      const timer = setTimeout(() => {
        // artゲームの場合はstartページに遷移
        const path = quiz.gameId === "art" ? `/games/${quiz.gameId}/start` : `/games/${quiz.gameId}`
        router.push(path)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [loadingProgress, isLoading, quiz.gameId, router])

  const handleGameStart = async () => {
    if (!quiz.gameId) return

    setIsLoading(true)
    setLoadingProgress(0)

    const loadingInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(loadingInterval)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 200)
  }

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-forest-200 bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-forest-100 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-forest-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div>
              <h3 className="font-semibold text-forest-700 mb-2">{quiz.title}</h3>
              <p className="text-sm text-forest-600 mb-4">{t("quiz_card_loading")}</p>
              <Progress value={loadingProgress} className="w-full mb-2" />
              <p className="text-xs text-forest-500">{Math.round(loadingProgress)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className="overflow-hidden border-forest-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
      onClick={quiz.gameId ? handleGameStart : undefined}
    >
      <div className="relative h-48">
        <Image src={quiz.image || "/placeholder.svg"} alt={quiz.title} fill className="object-cover" />
        {quiz.featured && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
              <Star className="w-3 h-3 mr-1" />
              {t("quiz_card_new")}
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold text-forest-700 line-clamp-2">{quiz.title}</CardTitle>
          <Badge variant="outline" className="text-xs border-forest-300 text-forest-600 shrink-0">
            {quiz.category}
          </Badge>
        </div>
        <CardDescription className="text-forest-600 line-clamp-3">{quiz.description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-sm text-forest-500 mb-4">
          {quiz.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {quiz.duration}
            </div>
          )}
          {quiz.difficulty && (
            <Badge variant="secondary" className="text-xs bg-forest-100 text-forest-700">
              {quiz.difficulty}
            </Badge>
          )}
        </div>

        {quiz.tags && quiz.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {quiz.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs border-forest-200 text-forest-600">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {quiz.tags.length > 2 && (
              <Badge variant="outline" className="text-xs border-forest-200 text-forest-600">
                +{quiz.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
