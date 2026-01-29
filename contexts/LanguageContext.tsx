"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type Language = "ja" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

interface LanguageProviderProps {
  children: React.ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("ja")

  // ローカルストレージから言語設定を読み込む
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // 言語が変更されたらローカルストレージに保存
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  // 翻訳関数（仮実装、後で各コンポーネントで使う）
  const t = (key: string) => {
    return key // 各コンポーネントで独自の翻訳辞書を使用
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
