import type { Metadata } from "next";
import { Geist, Geist_Mono } from 'next/font/google';
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

// Geistフォントの設定（現在のコード）
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// メタデータ（森テーマのタイトルと説明に変更）
export const metadata: Metadata = {
  title: "クイズマスター - 楽しく学べるクイズポータル",
  description:
    "様々なジャンルのクイズに挑戦し、知識を広げましょう。友達と競争したり、ランキングに参加したりして楽しめます。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
      <body>
        {children}
        {/* 2. Analyticsコンポーネントを追加（bodyの閉じタグの直前） */}
        <Analytics />
      </body>
    </html>
  );
}

