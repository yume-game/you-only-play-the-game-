"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"
import { homeTranslations, type HomeTranslationKey } from "@/locales/home-translations"

export default function HomePage() {
  const { language } = useLanguage()
  const t = (key: HomeTranslationKey) => homeTranslations[language][key]
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/image/art2.png')" }}
    >
      <div className="max-w-2xl mx-auto text-center space-y-8 bg-background/80 backdrop-blur-sm p-8 rounded-2xl">
        <h1 className="text-5xl md:text-7xl font-bold text-balance">
          {t("art_title_1")}
          <span className="block text-primary mt-2">{t("art_title_2")}</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
          {t("art_description_1")}
          <span className="block mt-2">{t("art_description_2")}</span>
        </p>
        <div className="pt-4">
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/games/art/gallery">{t("art_button")}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
