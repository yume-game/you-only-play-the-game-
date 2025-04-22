import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link" // Linkコンポーネントをインポート
import Image from "next/image"

export function FeaturedQuiz() {
  // クイズページへのパスを定義
  const quizPath = "/pervasiveness";
  
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-forest-500 to-forest-600 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
        <div className="flex flex-col justify-center">
          <Badge variant="outline" className="w-fit mb-4 text-white border-white hover:bg-white/20">
            今週のピックアップ
          </Badge>
          <h3 className="text-2xl md:text-3xl font-bold mb-2">視野を広げてつらさ軽減させるゲーム</h3>
          <p className="text-white/80 mb-4">
            人生全部うまくいかないと思ったあなたへおすすめのゲームです。視野を広げることでつらい思いを軽減させます。
          </p>
          <div className="flex flex-wrap gap-3">
            {/* 「今すぐプレイ」ボタンをリンクで包む */}
            <Link href={quizPath}>
              <Button className="bg-white text-forest-600 hover:bg-white/90">今すぐプレイ</Button>
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center">
          {/* 画像と再生ボタン全体をリンクで包む */}
          <Link 
            href={quizPath}
            className="relative w-full max-w-md aspect-[4/3] rounded-lg overflow-hidden group cursor-pointer"
          >
            <Image
              src="/image/pervasiveness-top-image.png"
              alt="視野を広げてつらさ軽減させるゲーム"
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
          </Link>
        </div>
      </div>
    </div>
  )
}

