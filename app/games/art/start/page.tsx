import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/image/art2.png')" }}
    >
      <div className="max-w-2xl mx-auto text-center space-y-8 bg-background/80 backdrop-blur-sm p-8 rounded-2xl">
        <h1 className="text-5xl md:text-7xl font-bold text-balance">
          心を癒す
          <span className="block text-primary mt-2">アートの旅</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
          アートには心を癒し、希望を与える力があります。
          <span className="block mt-2">20作品のアートを通じて、あなたの心に静けさと安らぎを。</span>
        </p>
        <div className="pt-4">
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/gallery">ギャラリーを見る</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
