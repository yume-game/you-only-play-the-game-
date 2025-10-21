"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

// アート画像のリスト（後で画像パスを追加する）
const artworks = [
  {
    id: 1,
    src: "/image/art-gallery-1.png",
    title: "作品1",
    description: "心を落ち着かせる作品",
  },
  {
    id: 2,
    src: "/image/art-gallery-2.png",
    title: "作品2",
    description: "ストレスを軽減する作品",
  },
  {
    id: 3,
    src: "/image/art-gallery-3.png",
    title: "作品3",
    description: "リラックスできる作品",
  },
  {
    id: 4,
    src: "/image/art-gallery-4.png",
    title: "作品4",
    description: "穏やかな気持ちになる作品",
  },
  {
    id: 5,
    src: "/image/art-gallery-5.png",
    title: "作品5",
    description: "心を癒す作品",
  },
]

const ArtGalleryPage = () => {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection
      if (newIndex < 0) newIndex = artworks.length - 1
      if (newIndex >= artworks.length) newIndex = 0
      return newIndex
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center text-green-800 mb-8">アートギャラリー</h1>

        <div className="relative w-full h-[500px] bg-white rounded-lg shadow-2xl overflow-hidden mb-8">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x)

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1)
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1)
                }
              }}
              className="absolute w-full h-full"
            >
              <Image
                src={artworks[currentIndex].src}
                alt={artworks[currentIndex].title}
                fill
                className="object-contain"
                priority={currentIndex === 0}
              />
            </motion.div>
          </AnimatePresence>

          {/* 左矢印ボタン */}
          <button
            onClick={() => paginate(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-green-700" />
          </button>

          {/* 右矢印ボタン */}
          <button
            onClick={() => paginate(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all"
          >
            <ChevronRight className="w-6 h-6 text-green-700" />
          </button>
        </div>

        {/* 作品情報 */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-green-800 mb-2">{artworks[currentIndex].title}</h2>
          <p className="text-green-600">{artworks[currentIndex].description}</p>
          <p className="text-sm text-green-500 mt-2">
            {currentIndex + 1} / {artworks.length}
          </p>
        </div>

        {/* インジケーター */}
        <div className="flex justify-center gap-2 mb-8">
          {artworks.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? "bg-green-600 w-8" : "bg-green-300"
              }`}
            />
          ))}
        </div>

        {/* 終了ボタン */}
        <div className="flex justify-center">
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-green-500 to-green-700 hover:opacity-90 transition-opacity px-8 py-3 text-lg text-white"
          >
            終える
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ArtGalleryPage
