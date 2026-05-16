import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { checkRateLimit } from "@/lib/rate-limit"

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"

  if (!checkRateLimit(`logic:${ip}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const b = body as Record<string, unknown>
  const score = b.score
  const actionSets = b.action_sets
  const enjoymentRating = b.enjoyment_rating
  const improvementRating = b.improvement_rating

  if (
    typeof score !== "number" || !Number.isInteger(score) || score < 0 || score > 1_000_000 ||
    !Array.isArray(actionSets) || actionSets.length > 20 ||
    (actionSets as unknown[]).some(s => typeof s !== "string" || s.length > 1000) ||
    typeof enjoymentRating !== "number" || !Number.isInteger(enjoymentRating) || enjoymentRating < 1 || enjoymentRating > 10 ||
    typeof improvementRating !== "number" || !Number.isInteger(improvementRating) || improvementRating < 1 || improvementRating > 10
  ) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 })
  }

  if (!supabaseServer) {
    return NextResponse.json({ ok: true })
  }

  const { error } = await supabaseServer.from("logic_game_responses_v2").insert({
    score,
    action_sets: actionSets,
    enjoyment_rating: enjoymentRating,
    improvement_rating: improvementRating,
  })

  if (error) {
    console.error("Supabase insert error:", error.message)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
