import type { Metadata } from "next";
import { Geist, Geist_Mono } from 'next/font/google';
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { LanguageProvider } from '@/contexts/LanguageContext';

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
  title: "メンタルゲーム",
  description:
    "ドーパミンの知識とメンタルヘルスの知識の融合で、遊んでるだけで気持ちが楽になる。",
  icons: '/image/girlbackgroud.png',
  openGraph: {
    title: "メンタルゲーム",
    description: "ドーパミンの知識とメンタルヘルスの知識の融合で、遊んでるだけで気持ちが楽になる。",
    images: [
      {
        url: '/image/girlbackgroud.png',
        width: 1200,
        height: 630,
        alt: 'メンタルゲーム',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "メンタルゲーム",
    description: "ドーパミンの知識とメンタルヘルスの知識の融合で、遊んでるだけで気持ちが楽になる。",
    images: ['/image/girlbackgroud.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // メンテナンスモードのチェック
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
  
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {isMaintenanceMode ? (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
            <div className="bg-white bg-opacity-95 rounded-xl p-8 shadow-2xl text-center max-w-2xl mx-4">
              <div className="text-6xl mb-6">🔧</div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">メンテナンス中</h1>
              <p className="text-xl text-gray-600 mb-6">
                現在サービスの改善作業を行っています。<br />
                しばらくお待ちください。
              </p>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        ) : (
          <LanguageProvider>
            {children}
            {/* Analyticsコンポーネント */}
            <Analytics mode="production" />
            <SpeedInsights />
          </LanguageProvider>
        )}
      </body>
    </html>
  );
}


