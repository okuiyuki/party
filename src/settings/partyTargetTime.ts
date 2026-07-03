export const PARTY_TIME_ZONE = 'Asia/Tokyo'

const STORAGE_KEY = 'party-target-time'

export type PartyTargetTime = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: 0
  millisecond: 0
  timeZone: typeof PARTY_TIME_ZONE
}

function getJapanDateParts(date: Date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: PARTY_TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date)

  return {
    year: Number(parts.find((part) => part.type === 'year')?.value ?? 0),
    month: Number(parts.find((part) => part.type === 'month')?.value ?? 0),
    day: Number(parts.find((part) => part.type === 'day')?.value ?? 0),
  }
}

function clampHour(hour: number) {
  return Math.min(23, Math.max(0, hour))
}

function clampMinute(minute: number) {
  return Math.min(59, Math.max(0, minute))
}

export function getJapanTime() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: PARTY_TIME_ZONE,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(new Date())

  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0)

  return { hour, minute }
}

export function createPartyTargetTime(hour: number, minute: number): PartyTargetTime {
  const { year, month, day } = getJapanDateParts()
  return {
    year,
    month,
    day,
    hour: clampHour(hour),
    minute: clampMinute(minute),
    second: 0,
    millisecond: 0,
    timeZone: PARTY_TIME_ZONE,
  }
}

export function toTargetDate(targetTime: PartyTargetTime): Date {
  const iso = `${targetTime.year}-${String(targetTime.month).padStart(2, '0')}-${String(targetTime.day).padStart(2, '0')}T${String(targetTime.hour).padStart(2, '0')}:${String(targetTime.minute).padStart(2, '0')}:00.000+09:00`
  return new Date(iso)
}

export function savePartyTargetTime(hour: number, minute: number): PartyTargetTime {
  const value = createPartyTargetTime(hour, minute)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  return value
}

export function loadPartyTargetTime(): PartyTargetTime | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<PartyTargetTime>
    if (typeof parsed.hour !== 'number' || typeof parsed.minute !== 'number') {
      return null
    }

    return createPartyTargetTime(parsed.hour, parsed.minute)
  } catch {
    return null
  }
}

export function getInitialHourMinute(stored: PartyTargetTime | null) {
  if (stored) {
    return { hour: stored.hour, minute: stored.minute }
  }
  return getJapanTime()
}

export function getJapanNow(): Date {
  return new Date()
}

function getJapanTimeParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: PARTY_TIME_ZONE,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    ...(supportsFractionalSeconds()
      ? { fractionalSecondDigits: 3 as const }
      : {}),
  }).formatToParts(date)

  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0)
  const second = Number(parts.find((part) => part.type === 'second')?.value ?? 0)
  const fractionalSecond = parts.find((part) => part.type === 'fractionalSecond')?.value

  const centiseconds =
    fractionalSecond !== undefined
      ? Math.floor(Number(`0.${fractionalSecond}`) * 100)
      : Math.floor(date.getMilliseconds() / 10)

  return { hour, minute, second, centiseconds }
}

function supportsFractionalSeconds() {
  try {
    new Intl.DateTimeFormat('en-US', {
      fractionalSecondDigits: 1,
    }).format(new Date())
    return true
  } catch {
    return false
  }
}

export function formatJapanTime(date: Date, withCentiseconds = true): string {
  const { hour, minute, second, centiseconds } = getJapanTimeParts(date)
  const base = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`
  if (!withCentiseconds) return base
  return `${base}.${String(centiseconds).padStart(2, '0')}`
}

export function calcDiffMs(stoppedAt: Date, targetTime: PartyTargetTime | null): number | null {
  if (!targetTime) return null
  const effectiveTarget = createPartyTargetTime(targetTime.hour, targetTime.minute)
  return stoppedAt.getTime() - toTargetDate(effectiveTarget).getTime()
}

export function formatDiffSecondsValue(diffMs: number): string {
  const seconds = Math.abs(diffMs) / 1000
  return seconds.toFixed(2)
}

export function formatDiffSeconds(diffMs: number): string {
  return `${formatDiffSecondsValue(diffMs)}s`
}
