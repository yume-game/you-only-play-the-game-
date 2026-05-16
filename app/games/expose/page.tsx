import { Suspense } from "react"
import ExposeGame from "@/components/games/expose/expose"

function LoadingFallback() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-lime-400 via-green-400 to-emerald-500 flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      <p className="mt-4 text-white font-bold">読み込み中...</p>
    </div>
  )
}

export default function ExposePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ExposeGame />
    </Suspense>
  )
}
