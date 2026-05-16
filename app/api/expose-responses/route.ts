import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { checkRateLimit } from "@/lib/rate-limit"

const ALLOWED_GENDERS = ["男性", "女性", "その他", "male", "female", "other", null, undefined]
const ALLOWED_AGE_GROUPS = ["10代", "20代", "30代", "40代", "50代", "60代以上", null, undefined]

function isOptStr(v: unknown, max: number): boolean {
  return v == null || (typeof v === "string" && v.length <= max)
}

function isFearLevel(v: unknown): boolean {
  return v == null || (typeof v === "number" && v >= 0 && v <= 10)
}

function isRating(v: unknown): boolean {
  return typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 10
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"

  if (!checkRateLimit(`expose:${ip}`, 10, 10 * 60 * 1000)) {
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

  if (
    !isOptStr(b.user_id, 100) ||
    !isOptStr(b.session_id, 100) ||
    !ALLOWED_GENDERS.includes(b.gender as string | null) ||
    !ALLOWED_AGE_GROUPS.includes(b.age_group as string | null) ||
    !isOptStr(b.self_care_answer, 2000) ||
    !isOptStr(b.valuable_things, 2000) ||
    !Array.isArray(b.why_answers) || b.why_answers.length > 10 ||
    (b.why_answers as unknown[]).some(w => typeof w !== "string" || w.length > 2000) ||
    (b.strongest_desire_index != null && (typeof b.strongest_desire_index !== "number" || b.strongest_desire_index < 1 || b.strongest_desire_index > 5)) ||
    !isOptStr(b.strongest_desire_text, 2000) ||
    !isOptStr(b.discomfort_origin, 2000) ||
    !isOptStr(b.fear_description, 2000) ||
    !isFearLevel(b.pre_fear_level) ||
    !isFearLevel(b.post_fear_level) ||
    typeof b.total_points !== "number" || b.total_points < 0 || b.total_points > 1_000_000 ||
    !Array.isArray(b.action_plans) || b.action_plans.length > 20 ||
    (b.action_plans as unknown[]).some(p => typeof p !== "string" || p.length > 1000) ||
    !isRating(b.enjoyment_rating) ||
    !isRating(b.improvement_rating)
  ) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 })
  }

  if (!supabaseServer) {
    return NextResponse.json({ ok: true })
  }

  const pre = b.pre_fear_level as number | null ?? null
  const post = b.post_fear_level as number | null ?? null
  const fearChange = pre != null && post != null ? Number((pre - post).toFixed(1)) : null
  const recoveryRate = pre != null && pre > 0 && fearChange != null ? Math.round((fearChange / pre) * 100) : null

  const { error } = await supabaseServer.from("expose_responses").insert({
    user_id: b.user_id ?? null,
    session_id: b.session_id ?? null,
    gender: b.gender ?? null,
    age_group: b.age_group ?? null,
    self_care_answer: b.self_care_answer ?? null,
    valuable_things: b.valuable_things ?? null,
    why_answers: b.why_answers,
    strongest_desire_index: b.strongest_desire_index ?? null,
    strongest_desire_text: b.strongest_desire_text ?? null,
    discomfort_origin: b.discomfort_origin ?? null,
    fear_description: b.fear_description ?? null,
    pre_fear_level: pre,
    post_fear_level: post,
    fear_change: fearChange,
    recovery_rate: recoveryRate,
    total_points: b.total_points,
    action_plans: b.action_plans,
    enjoyment_rating: b.enjoyment_rating as number,
    improvement_rating: b.improvement_rating as number,
  })

  if (error) {
    console.error("Supabase insert error:", error.message)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
