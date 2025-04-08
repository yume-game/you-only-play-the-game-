// components/quiz-card.tsx
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link" // Linkコンポーネントをインポート

interface QuizCardProps {
  quiz: {
    id: number
    title: string
    description: string
    category: string
    image: string
  }
}

export function QuizCard({ quiz }: QuizCardProps) {
  // クイズページへのパスを生成
  const quizPath = "/pervasiveness";
  
  return (
    // カード全体をリンクで包む
    <Link href={quizPath} className="block transition-transform duration-200 hover:scale-105">
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md h-full">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={quiz.image || "/placeholder.svg"}
            alt={quiz.title}
            className="object-cover w-full h-full"
          />
        </div>
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="outline" className="text-xs">
              {quiz.category}
            </Badge>
          </div>
          <h3 className="font-bold text-lg line-clamp-1">{quiz.title}</h3>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-muted-foreground text-sm line-clamp-2">{quiz.description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}