"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const artworks = [
  {
    id: 1,
    title: "静寂の朝",
    image: "/image/art1.png",
    description: "新しい一日の始まりに感じる静けさと希望",
  },
  {
    id: 2,
    title: "心の庭",
    image: "/image/art2.png",
    description: "内なる平和を見つける場所",
  },
  {
    id: 3,
    title: "優しい波",
    image: "/image/art3.png",
    description: "心を洗い流す穏やかな波の音",
  },
  {
    id: 4,
    title: "森の呼吸",
    image: "/image/art4.png",
    description: "自然の中で感じる生命の息吹",
  },
  {
    id: 5,
    title: "希望の光",
    image: "/image/art5.png",
    description: "暗闇の中にも必ず光は差し込む",
  },
  {
    id: 6,
    title: "静かな湖",
    image: "/image/art6.png",
    description: "心を映す鏡のような静けさ",
  },
  {
    id: 7,
    title: "花の微笑み",
    image: "/image/art7.png",
    description: "小さな美しさに気づく喜び",
  },
  {
    id: 8,
    title: "夕暮れの空",
    image: "/image/art8.png",
    description: "一日の終わりに感じる安らぎ",
  },
  {
    id: 9,
    title: "雨上がり",
    image: "/image/art9.png",
    description: "困難の後に訪れる清々しさ",
  },
  {
    id: 10,
    title: "星空の約束",
    image: "/image/art10.png",
    description: "無限の可能性を秘めた夜空",
  },
  {
    id: 11,
    title: "春の目覚め",
    image: "/image/art11.png",
    description: "新しい始まりを告げる桜の花",
  },
  {
    id: 12,
    title: "心の橋",
    image: "/image/art12.png",
    description: "過去と未来をつなぐ架け橋",
  },
  {
    id: 13,
    title: "静寂の雪",
    image: "/image/art13.png",
    description: "全てを包み込む優しい静けさ",
  },
  {
    id: 14,
    title: "朝露の輝き",
    image: "/image/art14.png",
    description: "小さな奇跡に満ちた朝",
  },
  {
    id: 15,
    title: "風の歌",
    image: "/image/art15.png",
    description: "自然が奏でる癒しのメロディー",
  },
  {
    id: 16,
    title: "月の静けさ",
    image: "/image/art16.png",
    description: "夜の静寂がもたらす安らぎ",
  },
  {
    id: 17,
    title: "虹の希望",
    image: "/image/art17.png",
    description: "試練の後に現れる美しい約束",
  },
  {
    id: 18,
    title: "秋の調べ",
    image: "/image/art18.png",
    description: "変化の美しさを受け入れる心",
  },
  {
    id: 19,
    title: "心の灯火",
    image: "/image/art19.png",
    description: "小さな光が照らす希望の道",
  },
  {
    id: 20,
    title: "永遠の今",
    image: "/image/art20.png",
    description: "この瞬間に存在する全ての美しさ",
  },
]

export default function GalleryPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-balance">心を癒すアートギャラリー</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        {/* Introduction */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
            アートには心を癒し、希望を与える力があります。
            <span className="block mt-2">ゆっくりと時間をかけて、それぞれの作品と向き合ってください。</span>
            <span className="block mt-2 text-forest-600 font-medium">IQが高い人はアートなど芸術好きみたいですね</span>
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="space-y-24">
          {artworks.map((artwork) => (
            <div key={artwork.id}>
              {/* Artwork Card */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-card rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={artwork.image || "/placeholder.svg"}
                    alt={artwork.title}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Closing Message */}
        <div className="max-w-3xl mx-auto mt-24 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">あなたの心に届きますように</h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              アートを通じて、少しでも心が軽くなることを願っています。
              <span className="block mt-2">あなたの心の旅は、ここから始まります。</span>
            </p>
          </div>

          {/* Finish Button */}
          <Button size="lg" onClick={() => router.push("/")} className="text-lg px-10 py-6 mt-8">
            終える
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            心の健康を大切に。必要な時は専門家のサポートを受けてください。
          </p>
        </div>
      </footer>
    </div>
  )
}
