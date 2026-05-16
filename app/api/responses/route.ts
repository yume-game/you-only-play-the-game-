import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { checkRateLimit } from "@/lib/rate-limit"

type AllowedTable = "quiz_responses_v2" | "quiz_responses_v3" | "thanks_responses"

const ALLOWED_TABLES: AllowedTable[] = ["quiz_responses_v2", "quiz_responses_v3", "thanks_responses"]
const ALLOWED_GENDERS = ["男性", "女性", "その他", "male", "female", "other", null, undefined]
const ALLOWED_AGE_GROUPS = ["10代", "20代", "30代", "40代", "50代", "60代以上", null, undefined]

function isRating(v: unknown): boolean {
  return v === null || v === undefined || (typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 10)
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"

  if (!checkRateLimit(`responses:${ip}`, 10, 10 * 60 * 1000)) {
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

  if (!ALLOWED_TABLES.includes(b.table as AllowedTable)) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 })
  }

  const userId = b.user_id ?? null
  const sessionId = b.session_id ?? null
  const totalPoints = b.total_points
  const selectedValues = b.selected_values
  const actionPlans = b.action_plans
  const gender = b.gender ?? null
  const ageGroup = b.age_group ?? null

  if (
    (userId !== null && (typeof userId !== "string" || userId.length > 100)) ||
    (sessionId !== null && (typeof sessionId !== "string" || sessionId.length > 100)) ||
    typeof totalPoints !== "number" || !Number.isInteger(totalPoints) || totalPoints < 0 || totalPoints > 1_000_000 ||
    !Array.isArray(selectedValues) || selectedValues.length > 500 ||
    !Array.isArray(actionPlans) || actionPlans.length > 50 ||
    (actionPlans as unknown[]).some(p => typeof p !== "string" || p.length > 1000) ||
    !ALLOWED_GENDERS.includes(gender as string | null) ||
    !ALLOWED_AGE_GROUPS.includes(ageGroup as string | null) ||
    !isRating(b.enjoyment_rating) ||
    !isRating(b.improvement_rating)
  ) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 })
  }

  if (!supabaseServer) {
    return NextResponse.json({ ok: true })
  }

  const { error } = await supabaseServer.from(b.table as AllowedTable).insert({
    user_id: userId,
    session_id: sessionId,
    total_points: totalPoints,
    selected_values: selectedValues,
    action_plans: actionPlans,
    gender,
    age_group: ageGroup,
    enjoyment_rating: (b.enjoyment_rating as number | null | undefined) ?? null,
    improvement_rating: (b.improvement_rating as number | null | undefined) ?? null,
  })

  if (error) {
    console.error("Supabase insert error:", error.message)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
