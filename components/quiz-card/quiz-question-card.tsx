"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface QuizQuestion {
  q: string
  options: string[]
  correct: number
  fb_correct: string
  fb_wrong: string
}

interface QuizQuestionCardProps {
  question: QuizQuestion
  questionNumber: number
  totalQuestions: number
  totalPoints: number
  consecutiveCorrect: number
  isMuted?: boolean
  catVideoSrc?: string
  onAnswer: (isCorrect: boolean, selectedIndex: number) => void
  onNext: () => void
  answered: boolean
  selectedAnswer: number | null
  showPointAnimation?: boolean
}

export function QuizQuestionCard({
  question,
  questionNumber,
  totalQuestions,
  totalPoints,
  consecutiveCorrect,
  isMuted = false,
  catVideoSrc,
  onAnswer,
  onNext,
  answered,
  selectedAnswer,
  showPointAnimation = false,
}: QuizQuestionCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [showCatVideo, setShowCatVideo] = useState(false)

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

  const handleSelectAnswer = (idx: number) => {
    if (answered) return
    const isCorrect = idx === question.correct

    if (isCorrect && catVideoSrc) {
      setShowCatVideo(true)
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.play().catch(() => {})
      }
      setTimeout(() => setShowCatVideo(false), 1500)
    }

    onAnswer(isCorrect, idx)
  }

  const progress = ((questionNumber - 1) / totalQuestions) * 100

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center p-6 animate-fade-in"
      style={{ background: "#f5f7f2" }}>

      {/* Cat video on correct answer */}
      <AnimatePresence>
        {showCatVideo && catVideoSrc && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="w-48 h-48 rounded-full overflow-hidden shadow-2xl border-4 border-green-400">
              <video
                ref={videoRef}
                src={catVideoSrc}
                className="w-full h-full object-cover"
                muted
                playsInline
                autoPlay
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-2xl space-y-6">
        {/* Points and streak */}
        <div className="flex justify-between items-center">
          {consecutiveCorrect >= 2 && (
            <div className="text-orange-500 text-sm font-bold animate-pulse">
              {consecutiveCorrect}
            </div>
          )}
          <div className="text-green-600 text-xl font-extrabold ml-auto">{totalPoints}pt</div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-400"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap">{questionNumber} / {totalQuestions}</span>
        </div>

        {/* Question with cat avatar */}
        <div className="flex items-start gap-4">
          {catVideoSrc && (
            <div className={`w-20 h-20 rounded-full overflow-hidden border-4 border-green-400 shadow-lg flex-shrink-0 ${showCatVideo ? 'animate-bounce' : ''}`}>
              <video
                ref={videoRef}
                src={catVideoSrc}
                className="w-full h-full object-cover"
                muted
                playsInline
                preload="metadata"
                autoPlay={showCatVideo}
              />
            </div>
          )}
          <div className="relative flex-1 bg-white rounded-2xl p-4 shadow-md border-2 border-green-300">
            {catVideoSrc && (
              <div className="absolute left-0 top-6 transform -translate-x-2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-green-300 border-b-8 border-b-transparent" />
            )}
            <p className="text-xs tracking-widest text-green-600 mb-2 opacity-70">
              QUESTION {String(questionNumber).padStart(2, "0")}
            </p>
            <p className="text-base font-bold leading-relaxed" style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>{question.q}</p>
          </div>
        </div>

        {/* Quiz card */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-green-100">
          {/* Options */}
          <div className="space-y-3">
            {question.options.map((opt, i) => {
              let optionClass = "bg-gray-50 border-green-100 hover:border-green-500 hover:bg-green-50 hover:translate-x-1"
              if (answered) {
                if (i === question.correct) {
                  optionClass = "bg-green-50 border-green-500"
                } else if (i === selectedAnswer && i !== question.correct) {
                  optionClass = "bg-red-50 border-red-400"
                } else {
                  optionClass = "bg-gray-50 border-gray-200 opacity-60"
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelectAnswer(i)}
                  disabled={answered}
                  className={`w-full text-left border-2 rounded-xl p-4 text-sm flex items-center gap-3 transition-all ${optionClass} ${answered ? "cursor-default" : "cursor-pointer"}`}
                >
                  <span className={`w-6 h-6 min-w-[24px] rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    answered && i === question.correct ? "border-green-500 text-green-600 bg-green-100" :
                    answered && i === selectedAnswer && i !== question.correct ? "border-red-400 text-red-500 bg-red-100" :
                    "border-gray-400 text-gray-500"
                  }`}>
                    {answered ? (i === question.correct ? "✓" : (i === selectedAnswer ? "✗" : String.fromCharCode(65 + i))) : String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>

          {/* Feedback */}
          {answered && (
            <div className={`mt-5 p-4 rounded-lg text-sm leading-relaxed ${
              selectedAnswer === question.correct
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-600"
            }`}>
              {selectedAnswer === question.correct ? question.fb_correct : question.fb_wrong}
            </div>
          )}

          {/* Next button */}
          {answered && (
            <div className="mt-5 text-center">
              <button
                onClick={() => {
                  playSound('/sound/nextpage.mp3')
                  onNext()
                }}
                className="border-2 border-green-500 text-green-600 font-bold px-8 py-3 rounded-full hover:bg-green-500 hover:text-white transition-all"
              >
                {questionNumber < totalQuestions ? "次の問題へ →" : "結果を見る →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
