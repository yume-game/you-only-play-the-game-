import { Suspense } from "react"
import NoRegretGame from "@/components/games/noregret/noregret"
import styles from "./page.module.css"

function LoadingFallback() {
  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center ${styles.loadingBg}`}>
      <div className="w-16 h-16 border-4 border-purple-300/30 border-t-purple-300 rounded-full animate-spin" />
      <p className="mt-4 text-purple-200 font-bold">読み込み中...</p>
    </div>
  )
}

export default function NoRegretPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NoRegretGame />
    </Suspense>
  )
}
