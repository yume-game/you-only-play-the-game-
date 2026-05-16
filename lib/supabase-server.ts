import { createClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL_SELFWORTH ?? ""
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_SELFWORTH ?? ""

export const supabaseServer = url && key ? createClient(url, key) : null
