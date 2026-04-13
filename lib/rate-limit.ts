import 'server-only'

interface Record {
  count: number
  firstAttempt: number
  blockedUntil?: number
}

const store = new Map<string, Record>()

// Pour la page publique de feedback : 10 avis max par heure par IP
const MAX = 10
const WINDOW_MS = 60 * 60 * 1000  // 1 heure
const BLOCK_MS  = 60 * 60 * 1000  // bloqué 1 heure

export function checkRateLimit(key: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now()
  const rec = store.get(key)

  if (rec?.blockedUntil && now < rec.blockedUntil) {
    return { allowed: false, retryAfterMs: rec.blockedUntil - now }
  }

  if (!rec || now - rec.firstAttempt > WINDOW_MS) {
    store.set(key, { count: 1, firstAttempt: now })
    return { allowed: true }
  }

  const newCount = rec.count + 1

  if (newCount > MAX) {
    store.set(key, { count: newCount, firstAttempt: rec.firstAttempt, blockedUntil: now + BLOCK_MS })
    return { allowed: false, retryAfterMs: BLOCK_MS }
  }

  store.set(key, { ...rec, count: newCount })
  return { allowed: true }
}
