// components/header.tsx
"use client"

import Link from "next/link"
import { useState } from "react"
import { Play, Music, Twitter } from "lucide-react"

interface HeaderProps {
  onPopularQuizzes?: () => void
}

export function Header({ onPopularQuizzes }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-forest-200 border-b border-forest-300">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-forest-700">yumeのメンタルゲーム</h1>
        
        {/* デスクトップナビゲーション */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-forest-600 hover:text-forest-800 transition-colors">
            ホーム
          </Link>
          {onPopularQuizzes && (
            <button
              type="button"
              onClick={onPopularQuizzes}
              className="text-forest-600 hover:text-forest-800 transition-colors"
            >
              人気クイズ
            </button>
          )}
        </nav>
        
        {/* モバイルメニューボタン */}
        <button 
          type="button"
          className="md:hidden text-forest-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
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
            className="lucide lucide-menu"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
        
        {/* モバイルメニュー（オプション） */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-forest-200 p-4 md:hidden border-b border-forest-300">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-forest-600 hover:text-forest-800 transition-colors">
                ホーム
              </Link>
              {onPopularQuizzes && (
                <button
                  type="button"
                  onClick={onPopularQuizzes}
                  className="text-forest-600 hover:text-forest-800 transition-colors text-left"
                >
                  人気クイズ
                </button>
              )}

              {/* SNSリンク */}
              <div className="pt-2 border-t border-forest-300">
                <h4 className="text-sm font-semibold text-forest-700 mb-3">SNS</h4>
                <div className="flex flex-col space-y-3">
                  <a
                    href="https://www.tiktok.com/@yumegeimu?is_from_webapp=1&sender_device=pc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-forest-600 hover:text-forest-800 transition-colors"
                  >
                    <Music size={18} />
                    <span>TikTok</span>
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UC03UIqgV__nUC4s6VNOQFDw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-forest-600 hover:text-forest-800 transition-colors"
                  >
                    <Play size={18} />
                    <span>YouTube</span>
                  </a>
                  <a
                    href="https://x.com/@KY15161637"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-forest-600 hover:text-forest-800 transition-colors"
                  >
                    <Twitter size={18} />
                    <span>X (Twitter)</span>
                  </a>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}