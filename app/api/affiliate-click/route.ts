import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { checkRateLimit } from "@/lib/rate-limit"

const ALLOWED_GAMES = ["thanks", "selfworth", "selfworthrelative", "valuediscovery", "desirediscovery", "pervasiveness", "expose", "logic"]
const ALLOWED_GENDERS = ["男性", "女性", "その他", "male", "female", "other", null, undefined]
const ALLOWED_AGE_GROUPS = ["10代", "20代", "30代", "40代", "50代", "60代以上", null, undefined]

function isRating(v: unknown): boolean {
  return v === null || v === undefined || (typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 10)
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"

  if (!checkRateLimit(`affiliate:${ip}`, 30, 10 * 60 * 1000)) {
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
    !ALLOWED_GAMES.includes(b.game_name as string) ||
    (b.user_id != null && (typeof b.user_id !== "string" || b.user_id.length > 100)) ||
    (b.session_id != null && (typeof b.session_id !== "string" || b.session_id.length > 100)) ||
    !ALLOWED_GENDERS.includes(b.gender as string | null) ||
    !ALLOWED_AGE_GROUPS.includes(b.age_group as string | null) ||
    !isRating(b.enjoyment_rating) ||
    !isRating(b.improvement_rating) ||
    typeof b.affiliate_clicked !== "boolean" ||
    (b.affiliate_pattern_index != null && (typeof b.affiliate_pattern_index !== "number" || b.affiliate_pattern_index < 0 || b.affiliate_pattern_index > 100))
  ) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 })
  }

  if (!supabaseServer) {
    return NextResponse.json({ ok: true })
  }

  const { error } = await supabaseServer.from("affiliate_clicks").insert({
    game_name: b.game_name,
    user_id: b.user_id ?? null,
    session_id: b.session_id ?? null,
    gender: b.gender ?? null,
    age_group: b.age_group ?? null,
    enjoyment_rating: (b.enjoyment_rating as number | null | undefined) ?? null,
    improvement_rating: (b.improvement_rating as number | null | undefined) ?? null,
    affiliate_clicked: b.affiliate_clicked,
    affiliate_pattern_index: (b.affiliate_pattern_index as number | null | undefined) ?? null,
  })

  if (error) {
    console.error("Supabase insert error:", error.message)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
