"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

// cat1フォルダの画像
const cat1Images = [
  "/image/cat1/fat_cat_--chaos_100_--ar_916_--stylize_0_--weird_157_--v_7_126edbbf-93a7-4a24-a693-135b5e584192_1.png",
  "/image/cat1/fat_cat_--chaos_100_--ar_916_--stylize_0_--weird_157_--v_7_126edbbf-93a7-4a24-a693-135b5e584192_2.png",
  "/image/cat1/fat_cat_--chaos_100_--ar_916_--stylize_0_--weird_157_--v_7_c45b3755-f5bc-4413-917d-73830d804674_3.png",
  "/image/cat1/too_fat_cat_--chaos_100_--ar_916_--stylize_0_--weird_157_--v__44a37ae5-73f6-4d36-bbf0-eed29ebadca5_0.png",
  "/image/cat1/too_fat_cat_--chaos_100_--ar_916_--stylize_0_--weird_157_--v__44a37ae5-73f6-4d36-bbf0-eed29ebadca5_2.png",
]

// cat2フォルダの画像
const cat2Images = [
  "/image/cat2/fat_cat_--ar_12_--stylize_0_--v_7_d27cca65-eea8-410d-8c67-22d5df39c0bb_1.png",
  "/image/cat2/fat_cat_--ar_12_--stylize_0_--v_7_d27cca65-eea8-410d-8c67-22d5df39c0bb_2.png",
  "/image/cat2/fat_cat_--ar_12_--stylize_0_--v_7_d27cca65-eea8-410d-8c67-22d5df39c0bb_3.png",
  "/image/cat2/fat_cat_--ar_916_--niji_7_f4c3e5b4-57ce-40b8-884a-c549934e1090_1.png",
  "/image/cat2/fat_cat_--ar_916_--v_6_6f3783b8-1ad6-4d1c-a5c7-59e3719d98c2_0.png",
]

// cat3フォルダの画像
const cat3Images = [
  "/image/cat3/_--ar_916_--stylize_0_--v_7_3005286d-f4f2-455e-a07d-8410e243c1c4_0.png",
  "/image/cat3/_--ar_916_--stylize_0_--v_7_3005286d-f4f2-455e-a07d-8410e243c1c4_3.png",
  "/image/cat3/_--ar_916_--stylize_0_--v_7_30492c23-c11c-4435-ade0-f8ae69e70e9c_0.png",
  "/image/cat3/_--ar_916_--stylize_0_--v_7_30492c23-c11c-4435-ade0-f8ae69e70e9c_1.png",
  "/image/cat3/_--chaos_100_--ar_916_--stylize_0_--weird_157_--v_7_e569b507-6f1d-4aee-9c7a-de2795c1bbf2_2.png",
]

// cat4フォルダの画像
const cat4Images = [
  "/image/cat4/_--ar_916_--stylize_0_--v_7_3005286d-f4f2-455e-a07d-8410e243c1c4_0.png",
  "/image/cat4/_--ar_916_--stylize_0_--v_7_3005286d-f4f2-455e-a07d-8410e243c1c4_3.png",
  "/image/cat4/_--ar_916_--stylize_0_--v_7_30492c23-c11c-4435-ade0-f8ae69e70e9c_0.png",
  "/image/cat4/_--ar_916_--stylize_0_--v_7_30492c23-c11c-4435-ade0-f8ae69e70e9c_1.png",
  "/image/cat4/_--chaos_100_--ar_916_--stylize_0_--weird_157_--v_7_e569b507-6f1d-4aee-9c7a-de2795c1bbf2_2.png",
  "/image/cat4/fat_cat_--ar_916_--stylize_0_--v_7_72dfba5c-f3a6-4d75-b1a2-34b9cb3fff0a_0.png",
  "/image/cat4/fat_cat_--ar_916_--stylize_0_--v_7_72dfba5c-f3a6-4d75-b1a2-34b9cb3fff0a_1.png",
  "/image/cat4/fat_cat_--ar_916_--stylize_0_--weird_57_--v_7_fc0e46e7-50c9-4153-8e3b-2454438bba33_1.png",
  "/image/cat4/fat_cat_--ar_916_--stylize_0_--weird_57_--v_7_fc0e46e7-50c9-4153-8e3b-2454438bba33_3.png",
  "/image/cat4/fat_cat_--ar_916_--stylize_1000_--weird_57_--v_7_2eb6d5c8-7684-4d26-a52d-31bae0db75df_1.png",
  "/image/cat4/fat_cat_--ar_916_--stylize_300_--weird_654_--v_7_7aca2cb9-a52a-4898-9281-4aef8f2801fa_0.png",
  "/image/cat4/fat_cat_--ar_916_--stylize_300_--weird_654_--v_7_7aca2cb9-a52a-4898-9281-4aef8f2801fa_1.png",
  "/image/cat4/fat_cat_--ar_916_--stylize_300_--weird_654_--v_7_7aca2cb9-a52a-4898-9281-4aef8f2801fa_2.png",
  "/image/cat4/fat_cat_--ar_916_--stylize_300_--weird_654_--v_7_7aca2cb9-a52a-4898-9281-4aef8f2801fa_3.png",
  "/image/cat4/fat_cat_--chaos_50_--ar_916_--stylize_0_--v_7_0c68291a-ea81-43ab-b001-2ddd390c30cb_1.png",
  "/image/cat4/fat_cat_--chaos_70_--ar_916_--stylize_0_--v_7_fe139354-fd9f-4312-ad6a-fef854f1d71a_2.png",
]

// 全ての猫画像を結合
const allCatImages = [...cat1Images, ...cat2Images, ...cat3Images, ...cat4Images]

// 猫画像データ
const catPhotos = allCatImages.map((image, index) => ({
  id: index + 1,
  title: `ぽっちゃり猫 ${index + 1}`,
  image: image,
  description: "かわいいぽっちゃり猫",
}))

// アフィリエイトコンポーネント（CLAUDE.md準拠：絶対変更禁止）
const AffiliateComponent = ({ className = "" }: { className?: string }) => {
  const affiliateHtml = `<a href="https://px.a8.net/svt/ejp?a8mat=45167E+679KMQ+5OI8+5ZEMP" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www27.a8.net/svt/bgt?aid=250317482375&wid=001&eno=01&mid=s00000026504001005000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=45167E+679KMQ+5OI8+5ZEMP" alt="">`

  return (
    <div className={`w-full mx-auto mt-2 mb-2 ${className}`}>
      <div
        style={{
          fontFamily: "'Hiragino Sans', 'Yu Gothic', sans-serif",
          margin: 0,
          padding: "10px",
          backgroundColor: "#ffffffff",
          color: "#333",
          maxWidth: "600px",
          marginLeft: "auto",
          marginRight: "auto"
        }}
      >
        {/* アフィリエイトHTMLをそのまま挿入 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px"
          }}
          dangerouslySetInnerHTML={{ __html: affiliateHtml }}
        />
      </div>
    </div>
  )
}

export default function CatGalleryPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-balance">ぽっちゃりな猫を見るだけのサイト</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        {/* Introduction */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
            ぽっちゃりな猫を見るだけで癒されます。
            <span className="block mt-2">ゆっくりと時間をかけて、かわいい猫たちを眺めてください。</span>
            <span className="block mt-2 text-forest-600 font-medium">科学的根拠はあるかわかりませんが、私の私利私欲です。</span>
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="space-y-24">
          {catPhotos.map((photo, index) => (
            <div key={photo.id}>
              {/* Cat Photo Card */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-card rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={photo.image || "/placeholder.svg"}
                    alt={photo.title}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* 5枚ごとにアフィリエイトを表示 */}
              {(index + 1) % 5 === 0 && index < catPhotos.length - 1 && (
                <div className="max-w-4xl mx-auto mt-12">
                  <AffiliateComponent />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Closing Message */}
        <div className="max-w-3xl mx-auto mt-24 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">猫に癒されましたか？</h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              ぽっちゃり猫を見るだけで、少しでも心が軽くなることを願っています。
              <span className="block mt-2">また見に来てくださいね。</span>
            </p>
          </div>

          {/* Affiliate before finish */}
          <AffiliateComponent />

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
