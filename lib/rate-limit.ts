// IPベースのスライディングウィンドウ・レートリミッター（サーバーインスタンスごと）
const store = new Map<string, number[]>()

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const recent = (store.get(key) ?? []).filter(t => t > now - windowMs)
  if (recent.length >= limit) return false
  recent.push(now)
  store.set(key, recent)
  return true
}
