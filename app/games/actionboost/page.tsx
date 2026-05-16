"use client"
import dynamic from "next/dynamic"

// クライアントサイドのみでレンダリング
const ActionBoostGame = dynamic(
  () => import("@/components/games/actionboost/actionboost").then((mod) => mod.ActionBoostGame),
  { ssr: false }
)

export default function ActionBoostPage() {
  return <ActionBoostGame />
}
