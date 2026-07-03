const STORAGE_KEY = 'party-stop-history'

export type StopHistoryEntry = {
  stoppedAt: string
  stoppedTimeLabel: string
  diffMs: number | null
  diffLabel: string | null
}

export function loadStopHistory(): StopHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter(
      (entry): entry is StopHistoryEntry =>
        typeof entry === 'object' &&
        entry !== null &&
        typeof entry.stoppedAt === 'string' &&
        typeof entry.stoppedTimeLabel === 'string' &&
        (entry.diffMs === null || typeof entry.diffMs === 'number') &&
        (entry.diffLabel === null || typeof entry.diffLabel === 'string'),
    )
  } catch {
    return []
  }
}

export function appendStopHistory(entry: StopHistoryEntry): void {
  const history = loadStopHistory()
  history.unshift(entry)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export function getStopHistoryNewestFirst(): StopHistoryEntry[] {
  return loadStopHistory().sort(
    (a, b) => new Date(b.stoppedAt).getTime() - new Date(a.stoppedAt).getTime(),
  )
}

export function clearStopHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}
