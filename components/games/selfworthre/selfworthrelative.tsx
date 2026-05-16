"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import ConfettiCanvas from "@/components/animations/ConfettiCanvas"
import DarkAnimationCanvas from "@/components/animations/DarkAnimationCanvas"
import ButtonAnimationCanvas from "@/components/animations/ButtonAnimationCanvas"
import TransitionCanvas from "@/components/animations/TransitionCanvas"
import { TermsOfService } from "@/components/terms-of-service/terms-of-service"

// デバイス判定のカスタムフック
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)

    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  return isMobile
}

type Quiz = {
  question: string
  画像: {
    PC: string[] // PC用の背景画像
    スマホ: string[] // スマホ用の背景画像
  }
}

// 行動プランの型定義（expose.tsx形式に変更）
type ActionPlan = {
  when: string        // いつ
  where: string       // どこで
  what: string        // 何をする
}

// 行動プランのステップ
type ActionStep = 'when' | 'where' | 'what' | 'confirmation'

// 動画ファイルリスト
const CAT_VIDEOS = [
  '/movie_output/second_half_animecat.mp4',
  '/movie_output/second_half_bangocat.mp4',
  '/movie_output/second_half_fatcat.mp4',
]

// 効果音再生用のカスタムフック
const useInteractionSounds = (isMuted: boolean) => {
  const typingAudioRef = useRef<HTMLAudioElement | null>(null)
  const hoverAudioRef = useRef<HTMLAudioElement | null>(null)

  const playTyping = useCallback(() => {
    if (isMuted) return
    if (!typingAudioRef.current) {
      typingAudioRef.current = new Audio('/sound/typing.mp3')
      typingAudioRef.current.volume = 0.3
    }
    typingAudioRef.current.currentTime = 0
    typingAudioRef.current.play().catch(() => {})
  }, [isMuted])

  const playClick = useCallback(() => {
    if (isMuted) return
    const audio = new Audio('/sound/typing.mp3')
    audio.volume = 0.4
    audio.play().catch(() => {})
  }, [isMuted])

  const playHover = useCallback(() => {
    if (isMuted) return
    if (!hoverAudioRef.current) {
      hoverAudioRef.current = new Audio('/sound/typing.mp3')
      hoverAudioRef.current.volume = 0.15
    }
    hoverAudioRef.current.currentTime = 0
    hoverAudioRef.current.play().catch(() => {})
  }, [isMuted])

  return { playTyping, playClick, playHover }
}

const quizzes: Quiz[] = [
  {
    question: "あなたが望む結果がすべて手に入ったとしたらどんな風にほかのひととかかわっているでしょうか。",
    画像: {
      PC: ["/image/worthho1 (2).png"],
      スマホ: ["/image/worth1"],
    },
  },
  {
    question: "死を迎えるときパートナーにどんな人だったと語ってほしいですか？",
    画像: {
      PC: ["/image/worthho2.png"],
      スマホ: ["/image/worth52"],
    },
  },
  {
    question: "あなたと関わったことによってどんな気持ちを相手に与えたいですか？",
    画像: {
      PC: ["/image/worthho3.png"],
      スマホ: ["/image/worth31"],
    },
  },
  {
    question: "今まで、どんな自分でいたときに自分らしいと思いましたか？",
    画像: {
      PC: ["/image/worthho4.png"],
      スマホ: ["/image/worth41"],
    },
  },
  {
    question: "居酒屋にいるときに、あなたのことをどんな風に思いながら話してほしいですか？",
    画像: {
      PC: ["/image/worthho5.png"],
      スマホ: ["/image/worth51"],
    },
  },
  {
    question: "確かに成功できるかもしれないけど、やって嫌だなと思うことは何ですか？",
    画像: {
      PC: ["/image/worthho6.png"],
      スマホ: ["/image/worth6"],
    },
  },
  {
    question: "成功に近づく知識の中で自分らしいや好きだなと思えることは何ですか？",
    画像: {
      PC: ["/image/worthho7.png"],
      スマホ: ["/image/worth7"],
    },
  },
  {
    question: "相手とどんな関わり方を相手としたら自分を好きになりますか？",
    画像: {
      PC: ["/image/worthho8.png"],
      スマホ: ["/image/worth8"],
    },
  },
  {
    question: "あなたが幼少期から好きなものはなんですか？",
    画像: {
      PC: ["/image/worthho9.png"],
      スマホ: ["/image/worth9"],
    },
  },
  {
    question: "今までの人生で自分のことが嫌いになる瞬間はどんなときでしたか？",
    画像: {
      PC: ["/image/worthho10.png"],
      スマホ: ["/image/worth10"],
    },
  },
  {
    question: "あなたの良いところのどこを相手に見せたいと思いますか？",
    画像: {
      PC: ["/image/worthho11.png"],
      スマホ: ["/image/worth11"],
    },
  },
  {
    question: "お金がもらえなくてもやり続けられることは何ですか？",
    画像: {
      PC: ["/image/worthho12.png"],
      スマホ: ["/image/worth12"],
    },
  },
  {
    question: "もし経済的に安定していたら、欲しいものがすべて手に入っていたら自分の時間を何に使いますか？",
    画像: {
      PC: ["/image/worthho13.png"],
      スマホ: ["/image/worth13"],
    },
  },
  {
    question: "他人に合わせて手に入れたけど、自分らしくないと思ったものは何ですか？",
    画像: {
      PC: ["/image/worthho14.png"],
      スマホ: ["/image/worth14"],
    },
  },
  {
    question: "あなたにとって自然なスキルや才能は何ですか？",
    画像: {
      PC: ["/image/worthho15.png"],
      スマホ: ["/image/worth15"],
    },
  },
  {
    question: "あなたはなにに美しさを感じますか？",
    画像: {
      PC: ["/image/worthho16.png"],
      スマホ: ["/image/worth16"],
    },
  },
  {
    question: "あなたにとって「愛」とはどういうことですか？",
    画像: {
      PC: ["/image/worthho17.png"],
      スマホ: ["/image/worth17"],
    },
  },
  {
    question: "あなたにとって「平穏を見つける」とはどういうことですか？",
    画像: {
      PC: ["/image/worthho18.png"],
      スマホ: ["/image/worth18"],
    },
  },
  {
    question: "あなたにとって「注目される」どういうことですか？",
    画像: {
      PC: ["/image/worthho19.png"],
      スマホ: ["/image/worth19"],
    },
  },
  {
    question: "あなたにとって「信頼」とはどういうことですか？",
    画像: {
      PC: ["/image/worthho20.png"],
      スマホ: ["/image/worth20"],
    },
  },
]


// 3の倍数かどうかを判定する関数
const isGoldenQuestion = (questionNumber: number) => {
  return (questionNumber + 1) % 3 === 0
}

// アフィリエイト用のテキストパターン
const affiliateTextPatterns = [
  {
    headline: "「大切な人を心配させないために、あなたは回復する必要がある 」",
    description:
      "家のソファーで受けられるカウンセリングです。やさしくする重視のクリニックが多い中、心理学のマスター（公認心理士（国家資格））のみが在籍しているので、学問的な知識であなたを元気にします。",
  },
  {
    headline: "誰にも言えない話を聞いてもらってかつ科学によって回復できる",
    description:
      "やさしいだけカウンセリングではなく、心理学の国家資格公認心理士が100％のこのクリニックを予約してください。さらにオンラインなので家のソファーで受けられますよ。",
  },
  {
    headline:
      "あなたが心理学を利用したこのゲームで一瞬で変われたように 、心理学で助けてくれるクリニックです！",
    description:
      "カウンセリングは優しくしてくれるだけのところではありません。心理学という学問を学ぶ場でもあります。心理学のマスターしか在籍していない、クリニックがあります。オンラインなので家のソファーで受けられますよ。",
  },
]

// 初期読み込み用画像URLを取得する関数 - 最初の5個のみ
const getInitialImageUrls = (isMobile: boolean): string[] => {
  const imageUrls: string[] = []

  if (isMobile) {
    // スマホ用背景画像（1-5）のみ初期読み込み
    for (let i = 1; i <= 5; i++) {
      imageUrls.push(`/image/mobile/background-${i}.png`)
    }
  } else {
    // PC用背景画像（1-5）のみ初期読み込み
    for (let i = 1; i <= 5; i++) {
      imageUrls.push(`/image/pc/background-${i}.png`)
    }
  }

  return imageUrls
}

// 画像プリロード用のコンポーネント
const ImagePreloader = ({ images, onComplete }: { images: string[]; onComplete: () => void }) => {
  const [loadedCount, setLoadedCount] = useState(0)
  const [totalCount] = useState(images.length)

  useEffect(() => {
    let loadedImages = 0
    const imagePromises = images.map((src) => {
      return new Promise<void>((resolve) => {
        const img = new window.Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          loadedImages++
          setLoadedCount(loadedImages)
          resolve()
        }
        img.onerror = () => {
          loadedImages++
          setLoadedCount(loadedImages)
          resolve() // エラーでも続行
        }
        img.src = src
      })
    })

    Promise.all(imagePromises).then(() => {
      onComplete()
    })
  }, [images, onComplete])

  return (
    <div className="text-center space-y-4">
      <div className="text-white text-lg">ゲームを読み込み中...</div>
      <div className="w-64 bg-green-800 rounded-full h-4 mx-auto">
        <div
          className="bg-green-400 h-4 rounded-full transition-all duration-300"
          style={{ width: `${(loadedCount / totalCount) * 100}%` }}
        />
      </div>
      <div className="text-white text-sm">
        {loadedCount} / {totalCount}
      </div>
    </div>
  )
}

// ローディングページ（黄緑色基調）- BGMプリロード機能付き
const LoadingPage = ({ onLoadComplete }: { onLoadComplete: () => void }) => {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('準備中...')
  const [audioLoaded, setAudioLoaded] = useState(false)

  const loadingMessages = [
    '準備中...',
    'BGMを読み込んでいます...',
    '効果音を準備中...',
    '完了間近です...',
  ]

  // プリロードする音声ファイル
  const audioFiles = [
    '/sound/gamebgmchild.mp3',  // メインBGM
    '/sound/nextpage.mp3',      // ページ遷移音
    '/sound/typing.mp3',        // タイピング音
    '/sound/100pt.mp3',         // ポイント音
    '/sound/point.mp3',         // 結果音
    '/sound/timeup.mp3',        // タイムアップ音
  ]

  useEffect(() => {
    let loadedCount = 0
    const totalFiles = audioFiles.length

    // 音声ファイルをプリロード
    const preloadAudio = () => {
      audioFiles.forEach((src) => {
        const audio = new Audio()
        audio.preload = 'auto'
        audio.src = src
        audio.addEventListener('canplaythrough', () => {
          loadedCount++
          setProgress((prev) => Math.min(prev + (70 / totalFiles), 70))
          if (loadedCount >= totalFiles) {
            setAudioLoaded(true)
          }
        }, { once: true })
        audio.addEventListener('error', () => {
          loadedCount++
          if (loadedCount >= totalFiles) {
            setAudioLoaded(true)
          }
        }, { once: true })
        // 読み込み開始
        audio.load()
      })
    }

    preloadAudio()

    // ローディングメッセージの切り替え
    const messageInterval = setInterval(() => {
      setLoadingText((prev) => {
        const currentIndex = loadingMessages.indexOf(prev)
        const nextIndex = (currentIndex + 1) % loadingMessages.length
        return loadingMessages[nextIndex]
      })
    }, 800)

    return () => {
      clearInterval(messageInterval)
    }
  }, [])

  // 音声ファイルがすべて読み込まれたらローディング完了
  useEffect(() => {
    if (audioLoaded) {
      setProgress(100)
      const timer = setTimeout(() => {
        onLoadComplete()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [audioLoaded, onLoadComplete])

  // フォールバック: 5秒経っても完了しない場合は強制的に完了
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!audioLoaded) {
        setProgress(100)
        setTimeout(() => {
          onLoadComplete()
        }, 500)
      }
    }, 5000)

    return () => clearTimeout(fallbackTimer)
  }, [audioLoaded, onLoadComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-lime-400 via-green-400 to-emerald-500 flex flex-col items-center justify-center z-50">
      {/* 背景の装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/20 animate-pulse"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 flex flex-col items-center">
        {/* ロゴ/アイコン */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center animate-bounce">
              <span className="text-4xl">💎</span>
            </div>
          </div>
        </div>

        {/* タイトル */}
        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
          自分らしさ発見
        </h1>
        <p className="text-white/80 mb-8 text-lg">心の回復ゲーム</p>

        {/* プログレスバー */}
        <div className="w-64 h-3 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
          <div
            className="h-full bg-white rounded-full transition-all duration-300 ease-out shadow-md"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* パーセンテージ */}
        <p className="mt-4 text-white font-bold text-xl drop-shadow">
          {Math.min(Math.round(progress), 100)}%
        </p>

        {/* ローディングメッセージ */}
        <p className="mt-2 text-white/90 text-sm animate-pulse">
          {loadingText}
        </p>

        {/* スピナー */}
        <div className="mt-6">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      </div>
    </div>
  )
}

const AffiliateComponent = ({ className = "", affiliateTextPattern, onAffiliateClick }: { className?: string; affiliateTextPattern?: { headline: string; description: string }; onAffiliateClick?: () => void }) => {
  const affiliateHtml = `<a href="https://px.a8.net/svt/ejp?a8mat=45167E+679KMQ+5OI8+5ZEMP" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www27.a8.net/svt/bgt?aid=250317482375&wid=001&eno=01&mid=s00000026504001005000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=45167E+679KMQ+5OI8+5ZEMP" alt="">`

  // アフィリエイトリンクのクリックを検知
  const handleContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    // aタグまたはその子要素（img等）がクリックされた場合
    if (target.tagName === 'A' || target.closest('a')) {
      if (onAffiliateClick) {
        onAffiliateClick()
      }
    }
  }

  return (
    <div className={`w-full mx-auto mt-2 mb-2 ${className}`} onClick={handleContainerClick}>

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

        {/* 説明文 */}
        {affiliateTextPattern && (
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              lineHeight: "1.6",
              marginBottom: "25px",
              textAlign: "justify",
              color: "#166534",
              backgroundColor: "transparent",
              padding: "15px",
              borderRadius: "8px"
            }}
          >
            {affiliateTextPattern.description}
          </div>
        )}

        {/* ボタンコンテナ */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              padding: "15px 30px",

              backgroundColor: "#ff6b6b",
              borderRadius: "50px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              minWidth: "200px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#ff5252"
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ff6b6b"
              e.currentTarget.style.transform = "translateY(0px)"
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)"
            }}
            dangerouslySetInnerHTML={{
              __html: `<a href="https://px.a8.net/svt/ejp?a8mat=45167E+679KMQ+5OI8+BW8O2&a8ejpredirect=https%3A%2F%2Fkimochi-mental.com%2Fclient%2Fhome" rel="nofollow">今すぐ予約</a>
<img border="0" width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=45167E+679KMQ+5OI8+BW8O2" alt="">`
            }}
          />
        </div>
      </div>
    </div>
  )
}

const IntroPage = ({ onStart, isMuted, setIsMuted }: { onStart: () => void; isMuted: boolean; setIsMuted: (value: boolean) => void }) => {
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [allImages, setAllImages] = useState<string[]>([])
  const [isTermsOpen, setIsTermsOpen] = useState(false)

  // ページマウント時に上までスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // デバイス判定とそれに応じた画像URLの設定
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setAllImages(getInitialImageUrls(mobile))
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)

    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  const handleImagesLoaded = useCallback(() => {
    setImagesLoaded(true)
  }, [])

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center animate-fade-in">
      <TermsOfService isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/background-bright-forest-road.png"
          alt="心の状態"
          fill
          className="object-cover object-top"
          priority
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent && !parent.querySelector('.image-fallback')) {
              const fallback = document.createElement('div')
              fallback.className = 'image-fallback absolute inset-0 flex items-center justify-center'
              fallback.innerHTML = '<div class="w-32 h-32 rounded-full bg-green-400"></div>'
              parent.appendChild(fallback)
            }
          }}
        />
      </div>

      <div className="relative z-10 text-center space-y-6 bg-green-700 bg-opacity-70 p-8 rounded-lg max-w-2xl">
        <h1 className="text-4xl font-bold text-white">比較しない自分へ変わる！</h1>
        <p className="text-lg text-white">
          あなたが心の奥深くで求めているものを見つけることを目指します。その通りの行動をすることであなたは幸福度が高い人生を送れます。
          1問30秒です。直感で答えてみましょう！ではいってらっしゃい！（※完全無料です。）
        </p>
        <p className="text-base text-red-300 font-bold">
          ⚠️ 残り時間が過ぎると-50ptされます！
        </p>
        <p className="text-base text-yellow-200 font-semibold">
          あなたを守るため、個人情報は入力しないでください。　ex 　佐々木君がではなく　ｓ君がとしましょう。
        </p>

        {/* 消音モードボタン */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
              isMuted
                ? "bg-gray-500 hover:bg-gray-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white font-medium`}
          >
            <span className="text-xl">{isMuted ? "🔇" : "🔊"}</span>
            <span>{isMuted ? "消音モード中" : "消音モードを選択"}</span>
          </button>
        </div>

        {!imagesLoaded && allImages.length > 0 ? (
          <ImagePreloader images={allImages} onComplete={handleImagesLoaded} />
        ) : allImages.length === 0 ? (
          <div className="text-white text-lg">デバイスを確認中...</div>
        ) : (
          <>
            {/* 注意書き */}
            <p className="text-red-300 text-sm text-center mb-4">
              重度のトラウマなどお持ちの方は私のゲームではなく、精神科医にかかる事を推奨いたします
            </p>

            <div className="space-y-4">
              <p className="text-white/70 text-sm text-center">
                スタートボタンをおすと、<button type="button" onClick={() => setIsTermsOpen(true)} className="text-green-300 underline hover:text-green-200 font-medium">利用規約</button>に同意したことになります。
              </p>

              <Button
                onClick={onStart}
                className="bg-gradient-to-r from-green-500 to-green-700 hover:opacity-90 transition-opacity px-8 py-4 text-xl text-white"
              >
                スタート
              </Button>
            </div>
          </>
        )}
      </div>

      {/* 初期画像のみプリロード */}
      <div className="absolute -top-full opacity-0 pointer-events-none">
        {allImages.slice(0, 3).map((src, index) => (
          <Image key={src} src={src || "/placeholder.svg"} alt="" width={1} height={1} priority={index < 3} />
        ))}
      </div>
    </div>
  )
}

// はじめに画面：性別・年代入力
const PrestartPage = ({
  gender,
  setGender,
  ageGroup,
  setAgeGroup,
  onContinue,
}: {
  gender: string
  setGender: (value: string) => void
  ageGroup: string
  setAgeGroup: (value: string) => void
  onContinue: () => void
}) => {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-green-100 to-green-200" />

      <div className="relative z-10 max-w-md w-full bg-white rounded-xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">はじめに</h1>
        <p className="text-gray-600 mb-6 text-center">あなたについて教えてください</p>

        <div className="space-y-6">
          {/* 性別 */}
          <div>
            <label className="block text-lg font-bold text-gray-700 mb-2">性別</label>
            <div className="flex flex-wrap gap-2">
              {["男性", "女性", "その他", "回答しない"].map((option) => (
                <button
                  key={option}
                  onClick={() => setGender(option)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    gender === option
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-green-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* 年代 */}
          <div>
            <label className="block text-lg font-bold text-gray-700 mb-2">年代</label>
            <div className="flex flex-wrap gap-2">
              {["10代", "20代", "30代", "40代", "50代", "60代以上"].map((option) => (
                <button
                  key={option}
                  onClick={() => setAgeGroup(option)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    ageGroup === option
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-green-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* 次へボタン */}
          <div className="pt-4">
            <Button
              onClick={onContinue}
              disabled={!gender || !ageGroup}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              次へ
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const QuizPage = ({
  currentQuiz,
  userAnswers,
  totalPoints,
  allUserAnswers,
  onUpdateAnswer,
  onSubmit,
  onEndQuiz,
  onDirectToAffiliate,
  onTimeUp,
  userId,
  sessionId,
  gender,
  ageGroup,
  onSetHasSubmittedGameData,
  playSoundEffect,
}: {
  currentQuiz: number
  userAnswers: string[]
  totalPoints: number
  allUserAnswers: string[][]
  onUpdateAnswer: (index: number, value: string) => void
  onSubmit: () => void
  onEndQuiz: () => void
  onDirectToAffiliate: () => void
  onTimeUp: () => void
  userId: string
  sessionId: string
  gender: string
  ageGroup: string
  onSetHasSubmittedGameData: (value: boolean) => void
  playSoundEffect: (soundPath: string) => void
}) => {
  // デバイス判定フックを追加
  const isMobile = useIsMobile()

  // ページマウント時に上までスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // QuizPageコンポーネントの開始直後に追加
  useEffect(() => {
    // 新しいクイズが開始される際の初期化
    if (currentQuiz === 0 && userAnswers.length === 1 && userAnswers[0] === "") {
      // 初回開始時の状態確認
      console.log("クイズ初期化完了")
    }
  }, [currentQuiz, userAnswers])

  // 新しいステートを追加
  const [fieldAnimations, setFieldAnimations] = useState<{ [key: string]: boolean }>({})
  const [animationTimer, setAnimationTimer] = useState<NodeJS.Timeout | null>(null)
  const [isNextButtonAnimating, setIsNextButtonAnimating] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [showFlash, setShowFlash] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showContent, setShowContent] = useState(true)
  const [previousBackgroundSrc, setPreviousBackgroundSrc] = useState<string>("")
  const [timeUpCount, setTimeUpCount] = useState(0)
  const [showDarkAnimation, setShowDarkAnimation] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  // updateAnswerの処理を変更
  const updateAnswer = useCallback(
    (index: number, value: string) => {
      const previousValue = userAnswers[index] || ""

      onUpdateAnswer(index, value)

      // 入力が完了した時（空から文字が入力された時）にアニメーション
      if (previousValue === "" && value.trim() !== "") {
        playSoundEffect("/sound/typing.mp3")
        const animationKey = `answer-${index}`
        setFieldAnimations((prev) => ({ ...prev, [animationKey]: true }))

        // 既存のタイマーをクリア
        if (animationTimer) {
          clearTimeout(animationTimer)
        }

        // 新しいタイマーを設定 - 時間短縮
        const newTimer = setTimeout(() => {
          setFieldAnimations({}) // 全てのアニメーションをリセット
        }, 1000)
        setAnimationTimer(newTimer)
      }
    },
    [userAnswers, onUpdateAnswer, animationTimer],
  )

  // 境界チェックを追加
  if (currentQuiz >= quizzes.length || !quizzes[currentQuiz]) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">クイズ完了！</h2>
          <Button onClick={onEndQuiz} className="bg-green-500 hover:bg-green-600 text-white">
            結果を見る
          </Button>
        </div>
      </div>
    )
  }

  const currentAnswerIndex = userAnswers.length - 1
  const nextQuizIndex = currentQuiz + 1

  // 背景画像の取得を更新
  const getCurrentBackgroundSrc = (quizIndex: number) => {
    const quiz = quizzes[quizIndex]
    if (!quiz || !quiz.画像) return "/placeholder.svg"

    return isMobile ? quiz.画像.スマホ[0] : quiz.画像.PC[0]
  }

  const currentBackgroundSrc = getCurrentBackgroundSrc(currentQuiz)
  const nextBackgroundSrc = nextQuizIndex < quizzes.length ? getCurrentBackgroundSrc(nextQuizIndex) : null

  const getTimeColor = (timeLeft: number, timeUpCount: number) => {
    if (timeLeft <= 5) {
      // 通常の時間切れ警告（赤色）
      return "text-red-500 font-bold"
    }

    // タイムアップ回数に応じた色
    if (timeUpCount === 0) return "text-green-500"
    if (timeUpCount === 1) return "text-amber-800" // 焦げ茶色
    if (timeUpCount === 2) return "text-orange-700"
    if (timeUpCount === 3) return "text-red-700"
    if (timeUpCount === 4) return "text-red-600"
    if (timeUpCount >= 5) return "text-red-500" // 原色の赤

    return "text-green-500"
  }

  useEffect(() => {
    if (totalPoints <= -1000) {
      // ポイントが-1000以下になったら強制的に終了
      onEndQuiz()
    }
  }, [totalPoints, onEndQuiz])

  useEffect(() => {
    if (!showContent) return // コンテンツが非表示の時はタイマーを停止

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          // タイムアップ時の処理
          setTimeUpCount((prev) => prev + 1)
          setShowDarkAnimation(true)

          setTimeout(() => {
            onTimeUp()
          }, 0)

          // 暗いアニメーションを1秒後に非表示
          setTimeout(() => {
            setShowDarkAnimation(false)
          }, 1000)

          // 時間をリセット
          setTimeout(() => {
            setTimeLeft(30)
          }, 100)

          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentAnswerIndex, showContent, timeUpCount, onTimeUp])

  // コンポーネントのアンマウント時にタイマーをクリア
  useEffect(() => {
    return () => {
      if (animationTimer) {
        clearTimeout(animationTimer)
      }
    }
  }, [animationTimer])

  // 質問テキストを直接取得
  const currentQuestion = quizzes[currentQuiz]?.question || ""

  const handleSubmitLocal = () => {
    // 回答が空の場合はアニメーションを表示しない
    const hasValidAnswer = userAnswers.some((answer) => answer.trim() !== "")
    if (!hasValidAnswer) {
      onSubmit()
      return
    }

    // 現在の背景画像を安全に取得
    const currentQuizData = quizzes[currentQuiz]
    if (currentQuizData && currentQuizData.画像 && currentQuizData.画像.PC) {
      const currentBgSrc = isMobile ? currentQuizData?.画像?.スマホ?.[0] : currentQuizData?.画像?.PC?.[0]
      setPreviousBackgroundSrc(currentBgSrc || "")
    }
    // UI要素を非表示にしてトランジション開始
    setShowContent(false)
    setIsTransitioning(true)

    // フラッシュエフェクト
    setShowFlash(true)

    setTimeout(() => {
      setShowFlash(false)

      // 背景切り替えアニメーション後にクイズを更新
      onSubmit()
      setIsTransitioning(false)

      // 少し遅れてコンテンツを表示
      setTimeout(() => {
        setShowContent(true)
        setTimeLeft(30) // タイマーをリセット
      }, 150)
    }, 800)
  }

  // handleSubmitLocal関数の前に、回答が有効かどうかをチェックする関数を追加
  const hasValidAnswers = userAnswers.some((answer) => answer.trim() !== "")

  return (
    <div className="relative w-full h-screen flex flex-col">
      {/* Confetti Canvas Animation */}
      <ConfettiCanvas isActive={showFlash} duration={2000} particleCount={50} points={isGoldenQuestion(currentQuiz) ? 300 : 100} />

      {/* Dark Animation Canvas - タイムアップ時 */}
      <DarkAnimationCanvas isActive={showDarkAnimation} duration={1000} />
      {/* 9:16の背景画像 */}
      {/* 背景画像とトランジション */}
      <div className="absolute inset-0 z-0">
        {/* 前の背景画像（トランジション中のみ表示） */}
        {isTransitioning && previousBackgroundSrc && (
          <Image
            src={previousBackgroundSrc || "/placeholder.svg"}
            alt="クイズ背景画像"
            fill
            className="object-cover object-top"
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent && !parent.querySelector('.image-fallback')) {
                const fallback = document.createElement('div')
                fallback.className = 'image-fallback absolute inset-0 flex items-center justify-center'
                fallback.innerHTML = '<div class="w-32 h-32 rounded-full bg-green-400"></div>'
                parent.appendChild(fallback)
              }
            }}
          />
        )}

        {/* 現在の背景画像 */}
        <div className="relative w-full h-full">
          <Image
            src={currentBackgroundSrc || "/placeholder.svg"}
            alt="クイズ背景画像"
            fill
            className="object-cover object-top"
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent && !parent.querySelector('.image-fallback')) {
                const fallback = document.createElement('div')
                fallback.className = 'image-fallback absolute inset-0 flex items-center justify-center'
                fallback.innerHTML = '<div class="w-32 h-32 rounded-full bg-green-400"></div>'
                parent.appendChild(fallback)
              }
            }}
          />

          {/* Canvas背景切り替えエフェクト */}
          <TransitionCanvas isActive={isTransitioning} duration={600} />

          {/* 簡素化された背景切り替え */}
          {isTransitioning && (
            <div className="absolute inset-0 z-10 animate-fade-in">
              <Image
                src={currentBackgroundSrc || "/placeholder.svg"}
                alt="クイズ背景画像"
                fill
                className="object-cover object-top"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent && !parent.querySelector('.image-fallback')) {
                    const fallback = document.createElement('div')
                    fallback.className = 'image-fallback absolute inset-0 flex items-center justify-center'
                    fallback.innerHTML = '<div class="w-32 h-32 rounded-full bg-green-400"></div>'
                    parent.appendChild(fallback)
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* アフィリエイト画像 - 右上 */}
      {/* <div className="absolute top-4 right-4 z-20">
        <AffiliateComponent />
      </div> */}

      {/* 次の画像をプリロード（非表示） */}
      {nextBackgroundSrc && (
        <div className="absolute -top-full opacity-0 pointer-events-none">
          <Image src={nextBackgroundSrc || "/placeholder.svg"} alt="プリロード画像" width={1} height={1} priority />
        </div>
      )}

      {/* コンテンツ */}
      {showContent && (
        <div className="relative z-10 flex flex-col h-full p-6">
          {/* 既存のコンテンツをここに配置 */}
          {/* 上部情報 */}
          <div className="bg-white bg-opacity-90 rounded-lg p-4 md:relative md:top-0 fixed top-0 left-0 right-0 z-20">
            {/* デスクトップレイアウト */}
            <div className="hidden md:flex flex-row justify-between items-center gap-2">
              <div className="text-green-600 text-sm font-medium">
                🍃問題 {currentQuiz + 1} / {quizzes.length}
              </div>
              <div
                className={`text-sm font-medium ${getTimeColor(timeLeft, timeUpCount)} ${isGoldenQuestion(currentQuiz) ? "text-yellow-600 font-bold" : ""}`}
              >
                ⏱️残り時間: {timeLeft}秒
              </div>
              <div className="text-green-600 text-xl font-bold">🏆{totalPoints}pt/目標700pt</div>
            </div>
            {/* モバイルレイアウト */}
            <div className="md:hidden space-y-2">
              <div className="flex flex-row justify-between items-center gap-2">
                <div className="text-green-600 text-sm font-medium">
                  🍃{currentQuiz + 1} / {quizzes.length}
                </div>
                <div
                  className={`text-sm font-medium ${getTimeColor(timeLeft, timeUpCount)} ${isGoldenQuestion(currentQuiz) ? "text-yellow-600 font-bold" : ""}`}
                >
                  ⏱️{timeLeft}秒
                </div>
              </div>
              <div className="text-green-600 text-4xl font-bold text-center">🏆{totalPoints}pt/目標700pt</div>
            </div>
          </div>

          {/* クイズ質問 */}
          <div className="bg-white bg-opacity-90 rounded-lg p-8 mb-4 mt-32 md:mt-0">
            <div className="flex items-center justify-center gap-3">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center leading-tight">
                {currentQuestion}
              </h2>
              {/* デスクトップのみヘルプボタンを表示 */}
              <button
                onClick={() => setIsHelpOpen(true)}
                className="hidden md:block flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors shadow-lg"
              >
                ヘルプ
              </button>
            </div>
            {/* 回答例 */}
            <div className="mt-4 text-gray-500 text-sm md:text-base text-center">
              {currentQuiz === 0 && "例：笑顔で接している、優しく話している、相手の話をよく聞いている"}
              {currentQuiz === 1 && "例：優しい人、強い人、誠実な人、楽しい人"}
              {currentQuiz === 2 && "例：安心感、温かさ、楽しさ、元気"}
              {currentQuiz === 3 && "例：誰かを助けているとき、好きなことに没頭しているとき、自分の意見を伝えたとき"}
              {currentQuiz === 4 && "例：面白い人、信頼できる人、一緒にいて楽な人"}
              {currentQuiz === 5 && "例：嘘をつくこと、人を傷つけること、自分を偽ること"}
              {currentQuiz === 6 && "例：人の話を聞くこと、新しいことを学ぶこと、問題を解決すること"}
              {currentQuiz === 7 && "例：相手を尊重する、正直に話す、相手の気持ちを考える"}
              {currentQuiz === 8 && "例：絵を描くこと、音楽、スポーツ、読書"}
              {currentQuiz === 9 && "例：嘘をついたとき、人を傷つけたとき、自分に正直でなかったとき"}
              {currentQuiz === 10 && "例：優しさ、誠実さ、強さ、明るさ"}
              {currentQuiz === 11 && "例：人を助けること、創作活動、学ぶこと、運動"}
              {currentQuiz === 12 && "例：家族と過ごす、趣味に没頭する、旅行する、学び続ける"}
              {currentQuiz === 13 && "例：周りに合わせた仕事、見栄のための買い物、無理な人間関係"}
              {currentQuiz === 14 && "例：人の話を聞くこと、共感する力、問題解決力、創造力"}
              {currentQuiz === 15 && "例：自然、人の優しさ、芸術作品、誠実な行動"}
              {currentQuiz === 16 && "例：相手を大切にすること、無条件に受け入れること、支え合うこと"}
              {currentQuiz === 17 && "例：自分を受け入れること、心が落ち着くこと、ありのままでいられること"}
              {currentQuiz === 18 && "例：自分の価値を認められること、人の役に立つこと、自分らしさを表現すること"}
              {currentQuiz === 19 && "例：約束を守ること、正直であること、相手を裏切らないこと"}
            </div>
          </div>

          {/* 回答欄と回答ボタン */}
          <div className="flex-1 flex flex-col">
            <div className="space-y-2 mb-2">
              {userAnswers.map((answer, index) => (
                <div key={index} className="flex gap-3">
                  <div
                    className={`flex-1 relative transition-all duration-500 ${fieldAnimations[`answer-${index}`] ? "bg-green-50 rounded-lg p-1" : ""}`}
                  >
                    {/* 草エフェクトを上側に固定表示 */}
                    {fieldAnimations[`answer-${index}`] && (
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-green-500 text-xl z-10 animate-bounce">
                        🌿
                      </span>
                    )}
                    <Input
                      type="text"
                      placeholder="回答"
                      value={answer}
                      onChange={(e) => updateAnswer(index, e.target.value)}
                      className={`w-full bg-white bg-opacity-90 text-gray-800 placeholder-gray-500 transition-all duration-300 ${
                        isGoldenQuestion(currentQuiz) ? "border-yellow-400 focus:border-yellow-500" : ""
                      } ${fieldAnimations[`answer-${index}`] ? "border-green-400 shadow-lg" : ""}`}
                    />
                  </div>
                  {/* 「回答する」ボタンの部分を以下に置き換え */}
                  <Button
                    onClick={handleSubmitLocal}
                    disabled={!hasValidAnswers}
                    className={`w-20 h-20 rounded-full ${
                      !hasValidAnswers
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : (currentQuiz + 1) % 3 === 0
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 border-yellow-300 animate-pulse hover:animate-none shadow-yellow-400/50"
                          : isGoldenQuestion(currentQuiz)
                            ? "bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 border-yellow-400 animate-pulse hover:animate-none"
                            : "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 border-green-400 animate-pulse hover:animate-none"
                    } text-white font-bold shadow-2xl transform transition-all duration-300 ${
                      hasValidAnswers
                        ? (currentQuiz + 1) % 3 === 0
                          ? "hover:scale-110 hover:shadow-yellow-400/70"
                          : "hover:scale-110 hover:shadow-green-400/50"
                        : ""
                    } border-4 ${(currentQuiz + 1) % 3 === 0 ? "hover:border-yellow-200" : "hover:border-green-200"}`}
                  >
                    <span className="text-sm leading-tight">
                      回答
                      <br />
                      する{" "}
                      {isGoldenQuestion(currentQuiz) && (
                        <>
                          <br />
                          (+300pt)
                        </>
                      )}
                    </span>
                  </Button>
                </div>
              ))}
            </div>

            {/* 終えるボタンと次へボタンを最下部に配置 */}
            <div className="mt-auto pt-16">
              <div className="space-y-8">
                {/* モバイルのみヘルプボタンを表示 */}
                <div className="md:hidden">
                  <button
                    onClick={() => setIsHelpOpen(true)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg"
                  >
                    ヘルプ
                  </button>
                </div>

                <div className={isNextButtonAnimating ? "animate-pulse" : ""}>
                  <Button
                    onClick={() => {
                      // アニメーション開始
                      setIsNextButtonAnimating(true)

                      // パーティクルエフェクトを表示
                      setTimeout(() => {
                        setIsNextButtonAnimating(false)
                        // 現在の回答を保存してからサマリーページへ
                        onEndQuiz()
                      }, 500)
                    }}
                    disabled={isNextButtonAnimating}
                    className={`w-full relative overflow-hidden ${
                      isGoldenQuestion(currentQuiz)
                        ? "bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-700 hover:from-yellow-700 hover:via-yellow-600 hover:to-yellow-800 border-yellow-400/30 hover:border-yellow-300/50"
                        : "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 border-blue-400/30 hover:border-blue-300/50"
                    } text-white font-bold py-4 px-8 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl border-2`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                      <svg
                        className={`w-6 h-6 ${isNextButtonAnimating ? "animate-spin" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      {isNextButtonAnimating ? "移動中..." : "欲求が見つかった。（次のステージへ）"}
                      <svg
                        className={`w-5 h-5 ${isNextButtonAnimating ? "animate-bounce" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>

                    {/* 光る効果 - CSS Animation */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 ${isNextButtonAnimating ? "animate-pulse" : ""}`} />
                  </Button>
                </div>

                {/* アフィリエイト画像 */}
                <div
                  className="flex justify-center"
                  onClick={(e) => {
                    const target = e.target as HTMLElement
                    // aタグまたはその子要素（img等）がクリックされた場合
                    if (target.tagName === 'A' || target.closest('a')) {
                      console.log("QuizPage: アフィリエイト画像がクリックされました")
                      // アフィリエイトクリックを新テーブルに記録
                        fetch("/api/affiliate-click", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            game_name: "selfworthrelative",
                            user_id: userId,
                            session_id: sessionId,
                            gender: gender || null,
                            age_group: ageGroup || null,
                            enjoyment_rating: null,
                            improvement_rating: null,
                            affiliate_clicked: true,
                            affiliate_pattern_index: null,
                          }),
                        }).catch(() => {})
                    }
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<a href="https://px.a8.net/svt/ejp?a8mat=45167E+679KMQ+5OI8+5ZEMP" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www27.a8.net/svt/bgt?aid=250317482375&wid=001&eno=01&mid=s00000026504001005000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=45167E+679KMQ+5OI8+5ZEMP" alt="">`
                    }}
                  />
                </div>

                <div className="pt-4">
                  <Button
                    onClick={async () => {
                      console.log("QuizPage: 終えるボタンがクリックされました")
                      // ゲームデータをquiz_responses_v2に送信（完了を待ってから遷移）
                      try {
                        const currentAnswers = userAnswers.filter((answer) => answer.trim() !== "")
                        const allAnswers = [...allUserAnswers, currentAnswers].flat()
                        await fetch("/api/responses", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            table: "quiz_responses_v2",
                            user_id: userId,
                            session_id: sessionId,
                            total_points: totalPoints,
                            selected_values: allAnswers,
                            action_plans: [],
                            gender: gender,
                            age_group: ageGroup,
                            enjoyment_rating: null,
                            improvement_rating: null,
                          }),
                        })
                        onSetHasSubmittedGameData(true)
                      } catch {
                        console.error("データの保存に失敗")
                      }
                      onDirectToAffiliate()
                    }}
                    className="w-full text-green-600 bg-transparent hover:text-green-700 hover:bg-green-50 font-bold border-0"
                  >
                    終える
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* トランジション中の中央ローディング表示を削除 */}

      {/* ヘルプポップアップ */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
            {/* ヘッダー */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">ヘルプ</h2>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors text-3xl font-bold"
                aria-label="閉じる"
              >
                ×
              </button>
            </div>

            {/* コンテンツ */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4 text-gray-700">
                {isGoldenQuestion(currentQuiz) ? (
                  <>
                    <p className="text-lg font-semibold text-yellow-600">
                      🌟 ゴールド問題！ 300pt獲得のチャンス！
                    </p>
                    <p>
                      「回答する」ボタンをあなたが求めているものの深い目的が探し出せるまで押してください。
                    </p>
                    <p>
                      よくわからなくなったら、どんな理由でそれが大事なの？、それがしたいの？、それがほしいの？、それがあなたにとって重要なの？と解いてみてください。
                    </p>
                    <p>
                      見つかったら「欲求が見つかった（次のステージへ）」ボタンを押してください。
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      他人から影響受けたものをできるだけ除くように書いてください。
                    </p>
                    <p>
                      「回答する」ボタンをあなたが求めているものの深い目的が探し出せるまで押してください。
                    </p>
                    <p>
                      よくわからなくなったら、どんな理由でそれが大事なの？、それがしたいの？、それがほしいの？、それがあなたにとって重要なの？と解いてみてください。
                    </p>
                    <p>
                      見つかったら「欲求が見つかった（次のステージへ）」ボタンを押してください。
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* フッター */}
            <div className="p-6 border-t">
              <button
                onClick={() => setIsHelpOpen(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const ResultPage = ({
  totalPoints,
  selectedAnswers,
  actionPlans,
  onRestart,
  onExit,
  gender,
  setGender,
  ageGroup,
  setAgeGroup,
  enjoymentRating,
  setEnjoymentRating,
  improvementRating,
  setImprovementRating,
  userId,
  sessionId,
  hasSubmittedGameData,
  onSetHasSubmittedGameData,
}: {
  totalPoints: number
  selectedAnswers: string[]
  actionPlans: ActionPlan[]
  onRestart: () => void
  onExit: () => void
  gender: string
  setGender: (value: string) => void
  ageGroup: string
  setAgeGroup: (value: string) => void
  enjoymentRating: number
  setEnjoymentRating: (value: number) => void
  improvementRating: number
  setImprovementRating: (value: number) => void
  userId: string
  sessionId: string
  hasSubmittedGameData: boolean
  onSetHasSubmittedGameData: (value: boolean) => void
}) => {
  // ページマウント時に上までスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [affiliateTextPattern, setAffiliateTextPattern] = useState(affiliateTextPatterns[0])
  const [affiliatePatternIndex, setAffiliatePatternIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  // コンポーネントがマウントされた時にランダムなテキストパターンを選択
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * affiliateTextPatterns.length)
    setAffiliateTextPattern(affiliateTextPatterns[randomIndex])
    setAffiliatePatternIndex(randomIndex)
  }, [])

  // 結果ページ表示時にゲームデータを自動送信（終えるボタンで送信済みでない場合のみ）
  useEffect(() => {
    if (hasSubmittedGameData) return

    const saveGameData = async () => {
      try {
        await fetch("/api/responses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table: "quiz_responses_v2",
            user_id: userId,
            session_id: sessionId,
            total_points: totalPoints,
            selected_values: selectedAnswers,
            action_plans: actionPlans.map(plan => plan.what).filter(what => what.trim() !== ""),
            gender: gender,
            age_group: ageGroup,
            enjoyment_rating: null,
            improvement_rating: null,
          }),
        })
        onSetHasSubmittedGameData(true)
      } catch {
        console.error("ゲームデータの自動保存に失敗")
      }
    }

    saveGameData()
  }, [])

  // アンケート送信処理（affiliate_clicksのみ送信）
  const handleSurveySubmit = async () => {
    if (hasSubmitted || isSubmitting) return

    setIsSubmitting(true)

    try {
      await fetch("/api/affiliate-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game_name: "selfworthrelative",
          user_id: userId,
          session_id: sessionId,
          gender: gender || null,
          age_group: ageGroup || null,
          enjoyment_rating: enjoymentRating,
          improvement_rating: improvementRating,
          affiliate_clicked: false,
          affiliate_pattern_index: affiliatePatternIndex,
        }),
      })
    } catch {
      console.error("アンケートデータの保存に失敗")
    }

    setHasSubmitted(true)
    setIsSubmitting(false)
  }

  // アフィリエイトリンクがクリックされた時の処理
  // handleAffiliateClick関数をuseCallbackでメモ化
  const handleAffiliateClick = useCallback(
    (clickData?: { url?: string; clickType?: string }) => {
      if (isSubmitting || hasSubmitted) {
        // すでに処理中または完了済みの場合でも、遷移は実行
        if (clickData?.url) {
          setTimeout(() => {
            window.open(clickData.url, "_blank")
          }, 100)
        }
        return
      }

      setIsSubmitting(true)
      const shouldRedirect = true
      const redirectUrl = clickData?.url

      fetch("/api/affiliate-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game_name: "selfworthrelative",
          user_id: userId,
          session_id: sessionId,
          gender: gender || null,
          age_group: ageGroup || null,
          enjoyment_rating: enjoymentRating,
          improvement_rating: improvementRating,
          affiliate_clicked: true,
          affiliate_pattern_index: affiliatePatternIndex,
        }),
      }).catch(() => {}).finally(() => {
        setHasSubmitted(true)
        setIsSubmitting(false)

        if (shouldRedirect && redirectUrl) {
          setTimeout(() => {
            window.open(redirectUrl, "_blank")
          }, 200)
        }
      })
    },
    [isSubmitting, hasSubmitted, userId, sessionId, gender, ageGroup, enjoymentRating, improvementRating, affiliatePatternIndex],
  )

  // iframeからのメッセージを受信するリスナーを修正
  // iframeからのメッセージを受信するリスナーを修正
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // オリジンチェック（セキュリティ向上）
      if (event.origin !== window.location.origin) {
        return
      }

      if (event.data && event.data.type === "affiliate-click") {
        // クリックデータを含めてhandleAffiliateClickを呼び出し
        handleAffiliateClick({
          url: event.data.url,
          clickType: event.data.clickType || "iframe",
        })
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [handleAffiliateClick])

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/background-bright-forest-road.png"
          alt="結果画面背景"
          fill
          className="object-cover object-top"
          priority
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent && !parent.querySelector('.image-fallback')) {
              const fallback = document.createElement('div')
              fallback.className = 'image-fallback absolute inset-0 flex items-center justify-center'
              fallback.innerHTML = '<div class="w-32 h-32 rounded-full bg-green-400"></div>'
              parent.appendChild(fallback)
            }
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* 統合された診断結果とアフィリエイトセクション */}
        <div className="text-center bg-white bg-opacity-95 rounded-xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-green-800 mb-6">あなたの価値観診断結果</h1>

          <div className="text-5xl font-bold text-green-700 mb-3">🏆合計ポイント {totalPoints}pt</div>
          <div className="text-xl font-bold text-green-300 mb-6">🏆1200pt/全国平均</div>

          <div className="text-2xl font-bold text-purple-600 mb-6">★yumeのゲーム　　スクショしてSNSに投稿しよう！★</div>


          {/* 選択した価値観と行動プラン */}
          <div className="space-y-6 mt-8">
            {/* 選択した価値観 */}
            {selectedAnswers.length > 0 && (
              <div className="bg-green-50 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
                  💎 あなたが選んだ価値観
                </h2>
                <div className="space-y-3">
                  {selectedAnswers.map((answer, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-md shadow-sm">
                      <span className="bg-green-500 text-white font-bold min-w-[32px] h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-green-900 font-medium text-lg">{answer}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 行動プラン */}
            {actionPlans.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                  🎯 あなたの行動プラン
                </h2>
                <div className="space-y-3">
                  {actionPlans.map((plan, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <span className="bg-blue-500 text-white font-bold min-w-[32px] h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-gray-700 mb-1">
                            <span className="font-bold text-blue-700">いつ:</span> {plan.when || "未入力"}
                          </p>
                          <p className="text-gray-700 mb-1">
                            <span className="font-bold text-blue-700">どこで:</span> {plan.where || "未入力"}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-bold text-blue-700">何を:</span> {plan.what || "未入力"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* アンケートセクション */}
          {!hasSubmitted ? (
            <div className="mt-8 pt-8 border-t-2 border-gray-200">
              <h2 className="text-2xl font-bold text-purple-600 mb-6">📝 アンケートにご協力ください</h2>

              <div className="space-y-6 text-left">
                {/* 楽しさ */}
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2">
                    このゲームは楽しかったですか？ ({enjoymentRating}/10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={enjoymentRating}
                    onChange={(e) => setEnjoymentRating(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>つまらない</span>
                    <span>とても楽しい</span>
                  </div>
                </div>

                {/* 改善度 */}
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2">
                    自分を見つめ直すきっかけになりましたか？ ({improvementRating}/10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={improvementRating}
                    onChange={(e) => setImprovementRating(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>全くならなかった</span>
                    <span>とてもなった</span>
                  </div>
                </div>

                {/* 送信ボタン */}
                <div className="text-center pt-4">
                  <Button
                    onClick={handleSurveySubmit}
                    disabled={isSubmitting}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 text-lg"
                  >
                    {isSubmitting ? "送信中..." : "アンケートを送信"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 pt-8 border-t-2 border-gray-200 text-center">
              <p className="text-xl text-green-600 font-bold">✓ アンケートにご協力ありがとうございました！</p>
            </div>
          )}

          {/* アフィリエイト部分を同じカード内に統合 */}
          <div className="mt-8 pt-8 border-t-2 border-gray-200">
            <h2 className="text-2xl font-bold text-orange-600 mt-8">{affiliateTextPattern.headline}</h2>

            <div className="text-center">
              <AffiliateComponent
                className="mx-auto"
                affiliateTextPattern={affiliateTextPattern}
                onAffiliateClick={() => {
                  fetch("/api/affiliate-click", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      game_name: "selfworthrelative",
                      user_id: userId,
                      session_id: sessionId,
                      gender: gender || null,
                      age_group: ageGroup || null,
                      enjoyment_rating: enjoymentRating,
                      improvement_rating: improvementRating,
                      affiliate_clicked: true,
                      affiliate_pattern_index: affiliatePatternIndex,
                    }),
                  }).catch(() => {})
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={onRestart} className="bg-green-500 hover:bg-green-600 text-white px-8 py-3">
            もう一度診断する
          </Button>
          <Button onClick={onExit} className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3">
            終了
          </Button>
        </div>
      </div>
    </div>
  )
}

// 価値観選択ページ（SummaryPage）
const SummaryPage = ({
  allUserAnswers,
  selectedAnswers,
  onAnswerSelect,
  onContinue,
  onExit,
}: {
  allUserAnswers: string[][]
  selectedAnswers: string[]
  onAnswerSelect: (answer: string) => void
  onContinue: () => void
  onExit: () => void
}) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // 全ての回答を平坦化して重複を除去
  const allAnswers = Array.from(new Set(allUserAnswers.flat().filter((answer) => answer.trim() !== "")))
  const [showConfetti, setShowConfetti] = useState(false)

  const handleContinue = () => {
    if (selectedAnswers.length === 0) return
    setShowConfetti(true)
    setTimeout(() => {
      setShowConfetti(false)
      onContinue()
    }, 1000)
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/background-bright-forest-road.png"
          alt="価値観選択背景"
          fill
          className="object-cover object-top"
          priority
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent && !parent.querySelector('.image-fallback')) {
              const fallback = document.createElement('div')
              fallback.className = 'image-fallback absolute inset-0 flex items-center justify-center'
              fallback.innerHTML = '<div class="w-32 h-32 rounded-full bg-green-400"></div>'
              parent.appendChild(fallback)
            }
          }}
        />
      </div>

      {/* Confetti Canvas Animation */}
      <ConfettiCanvas isActive={showConfetti} duration={1000} particleCount={30} points={300} />

      <div className="relative z-10 max-w-3xl w-full space-y-6">
        <div className="text-center bg-white bg-opacity-95 rounded-xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-green-800 mb-4">価値観を選択してください</h1>
          <p className="text-lg text-gray-700 mb-2">
            あなたの回答の中から最大3つまで選んでください
          </p>
          <p className="text-sm text-gray-600 mb-6">選択済み: {selectedAnswers.length}/3</p>

          {/* 回答リスト */}
          <div className="space-y-3 mb-8">
            {allAnswers.map((answer, index) => {
              const isSelected = selectedAnswers.includes(answer)
              const canSelect = selectedAnswers.length < 3 || isSelected

              return (
                <button
                  key={index}
                  onClick={() => canSelect && onAnswerSelect(answer)}
                  disabled={!canSelect}
                  className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                    isSelected
                      ? "bg-green-500 text-white shadow-lg transform scale-105"
                      : canSelect
                        ? "bg-white text-gray-800 hover:bg-gray-50 hover:shadow-md border-2 border-gray-200"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? "border-white bg-white" : "border-gray-400"
                      }`}
                    >
                      {isSelected && <div className="w-3 h-3 bg-green-500 rounded-full" />}
                    </div>
                    <span className="font-medium">{answer}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* ボタン */}
          <div className="space-y-4">
            <Button
              onClick={handleContinue}
              disabled={selectedAnswers.length === 0}
              className={`w-full py-4 text-lg font-bold ${
                selectedAnswers.length > 0
                  ? "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            >
              次へ進む ({selectedAnswers.length}個選択済み)
            </Button>

            <Button
              onClick={onExit}
              className="w-full text-green-600 bg-transparent hover:text-green-700 hover:bg-green-50 border-0"
            >
              終了
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 行動プランページ（Duolingoライクな新UI - expose.tsx形式）
const ActionPlanPage = ({
  selectedAnswers,
  actionPlans,
  totalPoints,
  setTotalPoints,
  onActionPlanAdd,
  onComplete,
  onExit,
  onFieldComplete,
  isMuted,
}: {
  selectedAnswers: string[]
  actionPlans: ActionPlan[]
  totalPoints: number
  setTotalPoints: (value: number | ((prev: number) => number)) => void
  onActionPlanAdd: (when: string, where: string, what: string) => void
  onComplete: () => void
  onExit: () => void
  onFieldComplete: () => void
  isMuted: boolean
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // ランダムな動画を選択（コンポーネントマウント時に一度だけ）
  const [selectedVideo] = useState(() => CAT_VIDEOS[Math.floor(Math.random() * CAT_VIDEOS.length)])
  // 動画再生状態
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // 説明ページ表示状態
  const [showIntro, setShowIntro] = useState(true)

  // ステップ管理
  const [currentStep, setCurrentStep] = useState<ActionStep>('when')
  const [currentLevel, setCurrentLevel] = useState(actionPlans.length + 1)

  // 回答管理
  const [customInput, setCustomInput] = useState('')

  // 現在の行動プラン
  const [currentPlan, setCurrentPlan] = useState<ActionPlan>({ when: '', where: '', what: '' })

  // アニメーション
  const [showConfetti, setShowConfetti] = useState(false)
  const [currentPoints, setCurrentPoints] = useState(0)

  // 効果音フック
  const { playTyping, playClick } = useInteractionSounds(isMuted)

  // 効果音再生
  const playSound = useCallback((soundFile: string) => {
    if (isMuted) return
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    audioRef.current = new Audio(soundFile)
    audioRef.current.volume = 0.5
    audioRef.current.play().catch(() => {})
  }, [isMuted])

  // プログレス計算（3ステップ）
  const getProgress = () => {
    if (currentStep === 'when') return 33
    if (currentStep === 'where') return 66
    if (currentStep === 'what') return 100
    return 100
  }

  // 回答を送信
  const handleSubmit = () => {
    const answer = customInput
    if (!answer.trim()) return

    // ポイント計算（すべて記述式なので300pt）
    let points = 300

    // ポイント追加
    setTotalPoints((prev) => prev + points)
    setCurrentPoints(points)
    onFieldComplete()

    // サウンド再生
    playSound('/sound/100pt.mp3')

    // アニメーション表示
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 1500)

    // 動画再生を開始
    const playVideo = () => {
      setIsVideoPlaying(true)
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.play().catch(() => {})
      }
    }

    // 現在のプランを更新
    if (currentStep === 'when') {
      setCurrentPlan((prev) => ({ ...prev, when: answer }))
      setTimeout(() => {
        playVideo()
        setCurrentStep('where')
        setCustomInput('')
      }, 1000)
    } else if (currentStep === 'where') {
      setCurrentPlan((prev) => ({ ...prev, where: answer }))
      setTimeout(() => {
        playVideo()
        setCurrentStep('what')
        setCustomInput('')
      }, 1000)
    } else if (currentStep === 'what') {
      const finalPlan = { ...currentPlan, what: answer }
      setCurrentPlan(finalPlan)
      setTimeout(() => {
        playVideo()
        setCurrentStep('confirmation')
      }, 1000)
    }
  }

  // レベルを追加してリセット
  const handleAddLevel = () => {
    // 現在のプランを保存
    onActionPlanAdd(currentPlan.when, currentPlan.where, currentPlan.what)

    // 状態をリセット
    setCurrentLevel((prev) => prev + 1)
    setCurrentStep('when')
    setCurrentPlan({ when: '', where: '', what: '' })
    setCustomInput('')
  }

  // 完了して次へ進む
  const handleProceedToComplete = () => {
    // まだ保存していないプランがあれば保存
    if (currentPlan.when || currentPlan.where || currentPlan.what) {
      onActionPlanAdd(currentPlan.when, currentPlan.where, currentPlan.what)
    }
    onComplete()
  }

  // 終了してアフィリエイトページへ
  const handleExitToAffiliate = () => {
    window.open('https://px.a8.net/svt/ejp?a8mat=45167E+679KMQ+5OI8+BW8O2&a8ejpredirect=https%3A%2F%2Fkimochi-mental.com%2Fclient%2Fhome', '_blank')
    onExit()
  }

  // 吹き出しテキストを取得
  const getBubbleText = () => {
    if (currentStep === 'when') return 'いつする行動？'
    if (currentStep === 'where') return 'どこでする行動？'
    if (currentStep === 'what') return '何をする？'
    return ''
  }

  // プレースホルダーを取得
  const getPlaceholder = () => {
    if (currentStep === 'when') return '例：朝起きたとき、仕事終わりに、週末に...'
    if (currentStep === 'where') return '例：自宅で、カフェで、公園で...'
    if (currentStep === 'what') return '例：感謝の気持ちを書く、瞑想する...'
    return ''
  }

  // 完了したレベル数
  const completedLevels = actionPlans.length

  // 説明ページ（行動リスト開始前）
  if (showIntro) {
    return (
      <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in overflow-y-auto"
        style={{ background: "#f5f7f2" }}>
        <div className="w-full max-w-2xl space-y-6 pb-20">
          {/* タイトル */}
          <div className="text-center py-4">
            <p className="text-xs tracking-widest text-green-600 uppercase mb-2 opacity-80">Action List</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
              🎯 行動リストの作成
            </h1>
          </div>

          {/* 目的の説明カード */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-green-400 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-green-400" />
            <h2 className="text-green-600 font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
              <span>📝</span> これからやること
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 bg-green-50 p-4 rounded-xl">
                <span className="text-3xl">🎯</span>
                <div>
                  <p className="font-bold text-base text-gray-800 mb-2">価値観に沿った行動をリストアップ</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    あなたが選んだ価値観に基づいて、<span className="text-green-600 font-semibold">具体的な行動プラン</span>を作成します。
                    レベル1から順番に、簡単なものから始めていきましょう。
                  </p>
                </div>
              </div>
              <div className="flex gap-4 bg-green-50 p-4 rounded-xl">
                <span className="text-3xl">⏰</span>
                <div>
                  <p className="font-bold text-base text-gray-800 mb-2">いつ・どこで・何をするか</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    各レベルの行動について、<span className="text-green-600 font-semibold">「いつ」「どこで」「何をするか」</span>を具体的に書きます。
                    具体的であるほど、実行しやすくなります。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* あなたが選んだ価値観カード */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-blue-400 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-blue-400" />
            <h2 className="text-blue-600 font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
              <span>💎</span> あなたが選んだ価値観
            </h2>
            <div className="space-y-2">
              {selectedAnswers.map((answer, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <span className="bg-blue-500 text-white font-bold min-w-[28px] h-7 rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  <span className="text-blue-900 font-medium">{answer}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 開始ボタン */}
          <div className="text-center py-6">
            <button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                setShowIntro(false)
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-gray-900 font-black px-12 py-4 rounded-full text-base tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              行動リストを作成する →
            </button>
          </div>

          {/* 終了ボタン */}
          <div className="text-center">
            <button
              onClick={() => {
                playSound('/sound/nextpage.mp3')
                onExit()
              }}
              className="text-gray-500 hover:text-gray-700 underline text-sm"
            >
              終了する
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 確認画面
  if (currentStep === 'confirmation') {
    return (
      <div className="relative w-full min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-green-100 overflow-y-auto">
        {/* Confetti Animation */}
        <ConfettiCanvas isActive={showConfetti} duration={1500} particleCount={50} points={currentPoints} />

        {/* メインコンテンツ */}
        <div className="flex-1 flex flex-col items-center justify-start p-4">
          {/* プログレスゲージ */}
          <div className="w-full max-w-md mb-2">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 transition-all duration-500" style={{ width: '100%' }} />
            </div>
          </div>

          {/* 6つの丸インジケーター */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <div
                key={level}
                className={`w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center ${
                  level <= completedLevels + 1
                    ? 'bg-green-500 shadow-lg shadow-green-500/50'
                    : 'bg-gray-300'
                }`}
              >
                <span className="text-xs font-semibold text-gray-400">Lv{level}</span>
              </div>
            ))}
          </div>

          {/* ポイント表示 */}
          <div className="text-green-600 text-2xl font-extrabold mb-4">🏆 {totalPoints}pt</div>

          {/* 完了メッセージ */}
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md mb-4">
            <h2 className="text-xl font-bold text-green-800 mb-4 text-center">
              レベル{currentLevel}の行動プランが完成しました！
            </h2>
            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700"><span className="font-bold text-blue-700">いつ：</span>{currentPlan.when}</p>
              <p className="text-gray-700"><span className="font-bold text-blue-700">どこで：</span>{currentPlan.where}</p>
              <p className="text-gray-700"><span className="font-bold text-blue-700">何を：</span>{currentPlan.what}</p>
            </div>

            {/* 猫動画 */}
            <div className="rounded-lg overflow-hidden mb-4">
              <video
                ref={videoRef}
                src={selectedVideo}
                className="w-full"
                muted={isMuted}
                playsInline
                onEnded={() => setIsVideoPlaying(false)}
              />
            </div>

            {/* ボタン */}
            <div className="space-y-3">
              {currentLevel < 6 && (
                <button
                  onClick={handleAddLevel}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  次のレベルを作成する（Lv{currentLevel + 1}）
                </button>
              )}
              <button
                onClick={handleProceedToComplete}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                行動プラン作成を終了する
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // メインの入力画面
  return (
    <div className="relative w-full min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-green-100 overflow-y-auto">
      {/* Confetti Animation */}
      <ConfettiCanvas isActive={showConfetti} duration={1500} particleCount={50} points={currentPoints} />

      {/* 猫動画オーバーレイ */}
      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setIsVideoPlaying(false)}
          >
            <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-sm w-full mx-4">
              <video
                ref={videoRef}
                src={selectedVideo}
                className="w-full rounded-lg"
                muted={isMuted}
                playsInline
                autoPlay
                onEnded={() => setIsVideoPlaying(false)}
              />
              <p className="text-center text-green-600 font-bold mt-2">+{currentPoints}pt 獲得！</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col items-center justify-start p-4">
        {/* プログレスゲージ */}
        <div className="w-full max-w-md mb-2">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        </div>

        {/* 6つの丸インジケーター */}
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <div
              key={level}
              className={`w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center ${
                level < currentLevel
                  ? 'bg-green-500 shadow-lg shadow-green-500/50'
                  : level === currentLevel
                    ? 'bg-green-400 shadow-md animate-pulse'
                    : 'bg-gray-300'
              }`}
            >
              <span className={`text-xs font-semibold ${level <= currentLevel ? 'text-white' : 'text-gray-400'}`}>
                Lv{level}
              </span>
            </div>
          ))}
        </div>

        {/* ポイント表示 */}
        <div className="text-green-600 text-2xl font-extrabold mb-4">🏆 {totalPoints}pt</div>

        {/* 質問カード */}
        <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-md mb-4">
          {/* 吹き出し */}
          <div className="bg-green-100 rounded-xl p-4 mb-4 relative">
            <div className="absolute -top-2 left-6 w-4 h-4 bg-green-100 transform rotate-45" />
            <p className="text-green-800 font-bold text-lg">{getBubbleText()}</p>
          </div>

          {/* 選択された価値観の表示 */}
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-600 font-medium">あなたの価値観：</p>
            <p className="text-blue-800 font-bold">{selectedAnswers[0]}</p>
          </div>

          {/* テキスト入力フィールド */}
          <div className="space-y-4">
            <Input
              type="text"
              value={customInput}
              onChange={(e) => {
                setCustomInput(e.target.value)
                playTyping()
              }}
              placeholder={getPlaceholder()}
              className="w-full p-4 text-lg border-2 border-green-300 rounded-xl focus:border-green-500 focus:ring-green-500"
            />

            {/* 送信ボタン */}
            <button
              onClick={() => {
                playClick()
                handleSubmit()
              }}
              disabled={!customInput.trim()}
              className={`w-full py-4 rounded-full font-bold text-lg transition-all ${
                customInput.trim()
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              回答する（+300pt）
            </button>
          </div>

          {/* 進行状況 */}
          <div className="mt-4 text-center text-sm text-gray-500">
            {currentStep === 'when' && 'ステップ 1/3'}
            {currentStep === 'where' && 'ステップ 2/3'}
            {currentStep === 'what' && 'ステップ 3/3'}
          </div>
        </div>

        {/* 終了ボタン */}
        <button
          onClick={handleExitToAffiliate}
          className="text-gray-500 hover:text-gray-700 underline text-sm"
        >
          終了する
        </button>
      </div>
    </div>
  )
}

const QuizGame = () => {
  const router = useRouter()
  const [gameState, setGameState] = useState<"loading" | "intro" | "prestart" | "quiz" | "summary" | "action" | "result">("loading")
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>([""])
  const [allUserAnswers, setAllUserAnswers] = useState<string[][]>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [enjoymentRating, setEnjoymentRating] = useState(5)
  const [improvementRating, setImprovementRating] = useState(5)
  const [gender, setGender] = useState<string>("")
  const [ageGroup, setAgeGroup] = useState<string>("")
  const [userId, setUserId] = useState<string>("")
  const [sessionId, setSessionId] = useState<string>("")
  const [hasSubmittedGameData, setHasSubmittedGameData] = useState(false)
  // 新しいステート：価値観選択と行動プラン
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([])
  const [isMuted, setIsMuted] = useState(false)
  const bgmRef = useRef<HTMLAudioElement | null>(null)

  // 効果音再生ヘルパー関数
  const playSoundEffect = useCallback((soundPath: string) => {
    if (!isMuted) {
      const audio = new Audio(soundPath)
      audio.volume = 0.5
      audio.play().catch(console.error)
    }
  }, [isMuted])

  // BGM再生管理
  useEffect(() => {
    const shouldPlayBgm = gameState !== "loading" && gameState !== "intro" && gameState !== "result"

    if (shouldPlayBgm && !isMuted) {
      if (!bgmRef.current) {
        bgmRef.current = new Audio("/sound/gamebgmchild.mp3")
        bgmRef.current.loop = true
        bgmRef.current.volume = 0.3
      }
      bgmRef.current.play().catch(console.error)
    } else {
      if (bgmRef.current) {
        bgmRef.current.pause()
      }
    }

    // タブの可視性変更時にBGMを制御
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (bgmRef.current) {
          bgmRef.current.pause()
        }
      } else {
        if (shouldPlayBgm && !isMuted && bgmRef.current) {
          bgmRef.current.play().catch(console.error)
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      if (bgmRef.current) {
        bgmRef.current.pause()
      }
    }
  }, [gameState, isMuted])

  // user_idとsession_idの初期化
  useEffect(() => {
    // user_id: localStorageから取得、なければ生成して保存
    let storedUserId = localStorage.getItem("quiz_user_id")
    if (!storedUserId) {
      storedUserId = crypto.randomUUID()
      localStorage.setItem("quiz_user_id", storedUserId)
    }
    setUserId(storedUserId)

    // session_id: 毎回新規生成
    setSessionId(crypto.randomUUID())
  }, [])

  const handleUpdateAnswer = (index: number, value: string) => {
    const newAnswers = [...userAnswers]
    while (newAnswers.length <= index) {
      newAnswers.push("")
    }
    newAnswers[index] = value
    setUserAnswers(newAnswers)
  }

  const handleSubmit = () => {
    const currentAnswers = userAnswers.filter((answer) => answer.trim() !== "")
    if (currentAnswers.length === 0) return

    setAllUserAnswers((prev) => [...prev, currentAnswers])

    if (currentQuiz < quizzes.length - 1) {
      setCurrentQuiz((prev) => prev + 1)
      setUserAnswers([""])
      // ゴールド問題の場合は300pt、通常は100pt
      const pointsToAdd = isGoldenQuestion(currentQuiz) ? 300 : 100
      if (pointsToAdd === 300) {
        playSoundEffect("/sound/300ptnextpage.mp3")
      } else {
        playSoundEffect("/sound/100pt.mp3")
      }
      setTotalPoints((prev) => prev + pointsToAdd)
    } else {
      playSoundEffect("/sound/gamefinish.mp3")
      setGameState("result")
    }
  }

  const handleEndQuiz = () => {
    // 現在の回答を保存してからサマリーページ（価値観選択）へ移行
    playSoundEffect("/sound/gamefinish.mp3")
    const currentAnswers = userAnswers.filter((answer) => answer.trim() !== "")
    if (currentAnswers.length > 0) {
      setAllUserAnswers((prev) => [...prev, currentAnswers])
    }
    setGameState("summary")
  }

  const handleDirectToAffiliate = () => {
    setGameState("result")
  }

  const handleTimeUp = () => {
    playSoundEffect("/sound/timeup.mp3")
    setTotalPoints((prev) => prev - 50)
  }


  // 価値観選択のハンドラー
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers((prev) => {
      if (prev.includes(answer)) {
        // 既に選択されていれば削除
        return prev.filter((a) => a !== answer)
      } else if (prev.length < 3) {
        // 最大3つまで選択可能
        return [...prev, answer]
      }
      return prev
    })
  }

  // 価値観選択から行動プランページへ進む
  const handleContinueToAction = () => {
    playSoundEffect("/sound/300ptnextpage.mp3")
    setGameState("action")
  }

  // 行動プランの追加ハンドラー（新形式：when, where, what）
  const handleActionPlanAdd = (when: string, where: string, what: string) => {
    playSoundEffect("/sound/100pt.mp3")
    setActionPlans((prev) => [...prev, { when, where, what }])
  }

  // 行動プランから最終ページへ
  const handleActionComplete = () => {
    playSoundEffect("/sound/gamefinish.mp3")
    setGameState("result")
  }

  const handleRestart = () => {
    playSoundEffect("/sound/replay.mp3")
    setGameState("intro")
    setCurrentQuiz(0)
    setUserAnswers([""])
    setAllUserAnswers([])
    setTotalPoints(0)
    setEnjoymentRating(5)
    setImprovementRating(5)
    setSelectedAnswers([])
    setActionPlans([])
  }

  const handleExit = () => {
    router.push("/")
  }

  const handleStart = () => {
    playSoundEffect("/sound/gamestart.mp3")
    setGameState("prestart")
  }

  return (
    <AnimatePresence mode="wait">
      {gameState === "loading" && <LoadingPage key="loading" onLoadComplete={() => setGameState("intro")} />}
      {gameState === "intro" && <IntroPage key="intro" onStart={handleStart} isMuted={isMuted} setIsMuted={setIsMuted} />}
      {gameState === "prestart" && (
        <PrestartPage
          key="prestart"
          gender={gender}
          setGender={setGender}
          ageGroup={ageGroup}
          setAgeGroup={setAgeGroup}
          onContinue={() => setGameState("quiz")}
        />
      )}
      {gameState === "quiz" && (
        <QuizPage
          key="quiz"
          currentQuiz={currentQuiz}
          userAnswers={userAnswers}
          totalPoints={totalPoints}
          allUserAnswers={allUserAnswers}
          onUpdateAnswer={handleUpdateAnswer}
          onSubmit={handleSubmit}
          onEndQuiz={handleEndQuiz}
          onDirectToAffiliate={handleDirectToAffiliate}
          onTimeUp={handleTimeUp}
          userId={userId}
          sessionId={sessionId}
          gender={gender}
          ageGroup={ageGroup}
          onSetHasSubmittedGameData={setHasSubmittedGameData}
          playSoundEffect={playSoundEffect}
        />
      )}
      {gameState === "summary" && (
        <SummaryPage
          key="summary"
          allUserAnswers={allUserAnswers}
          selectedAnswers={selectedAnswers}
          onAnswerSelect={handleAnswerSelect}
          onContinue={handleContinueToAction}
          onExit={handleDirectToAffiliate}
        />
      )}
      {gameState === "action" && (
        <ActionPlanPage
          key="action"
          selectedAnswers={selectedAnswers}
          actionPlans={actionPlans}
          totalPoints={totalPoints}
          setTotalPoints={setTotalPoints}
          onActionPlanAdd={handleActionPlanAdd}
          onComplete={handleActionComplete}
          onExit={handleDirectToAffiliate}
          onFieldComplete={() => setTotalPoints((prev) => prev + 100)}
          isMuted={isMuted}
        />
      )}
      {gameState === "result" && (
        <ResultPage
          key="result"
          totalPoints={totalPoints}
          selectedAnswers={selectedAnswers}
          actionPlans={actionPlans}
          onRestart={handleRestart}
          onExit={handleExit}
          gender={gender}
          setGender={setGender}
          ageGroup={ageGroup}
          setAgeGroup={setAgeGroup}
          enjoymentRating={enjoymentRating}
          setEnjoymentRating={setEnjoymentRating}
          improvementRating={improvementRating}
          setImprovementRating={setImprovementRating}
          userId={userId}
          sessionId={sessionId}
          hasSubmittedGameData={hasSubmittedGameData}
          onSetHasSubmittedGameData={setHasSubmittedGameData}
        />
      )}
    </AnimatePresence>
  )
}

export default QuizGame
