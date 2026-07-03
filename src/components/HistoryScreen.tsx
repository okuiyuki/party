import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import {
  clearStopHistory,
  getStopHistoryNewestFirst,
  type StopHistoryEntry,
} from '../settings/partyStopHistory'
import { formatDiffSecondsValue } from '../settings/partyTargetTime'
import { glassButtonClass } from '../styles/glassButton'

type HistoryScreenProps = {
  onBack: () => void
}

type HistoryEntryCardProps = {
  index: number
  entry: StopHistoryEntry
}

function HistoryEntryCard({ index, entry }: HistoryEntryCardProps) {
  return (
    <li
      className={`${glassButtonClass} flex w-full flex-col gap-3 px-6 py-4 text-center`}
    >
      <p className="font-sans text-xs uppercase tracking-widest text-rose-gold/70">
        #{index}
      </p>

      <div className="flex flex-col items-center gap-2">
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-rose-gold/80">
          Stopped At
        </p>
        <p className="result-number text-3xl leading-none text-rose-gold">
          {entry.stoppedTimeLabel}
        </p>
      </div>

      {entry.diffMs !== null && (
        <div className="flex flex-col items-center gap-2">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-rose-gold/80">
            Difference
          </p>
          <p className="flex items-baseline justify-center gap-2">
            <span className="result-number text-2xl leading-none text-text-dark">
              {formatDiffSecondsValue(entry.diffMs)}
            </span>
            <span className="pb-0.5 font-sans text-xs tracking-[0.25em] text-text-dark/65">
              Seconds
            </span>
          </p>
        </div>
      )}
    </li>
  )
}

function HistoryScreen({ onBack }: HistoryScreenProps) {
  const [history, setHistory] = useState(() => getStopHistoryNewestFirst())

  const handleClearAll = () => {
    if (!window.confirm('Clear all history?')) return
    clearStopHistory()
    setHistory([])
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex shrink-0 justify-start pt-2">
        <button
          type="button"
          onClick={onBack}
          className={`${glassButtonClass} flex items-center gap-1 px-4 py-3`}
        >
          <ChevronLeft className="size-4 text-rose-gold" strokeWidth={1.5} />
          <span className="font-sans text-xs uppercase tracking-widest text-rose-gold">
            Back
          </span>
        </button>
      </header>

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-1 pt-6">
        <p className="shrink-0 text-center font-sans text-sm uppercase tracking-[0.25em] text-rose-gold/80">
          History
        </p>

        {history.length === 0 ? (
          <p className="mt-12 text-center font-sans text-sm text-text-dark/60">
            No history yet
          </p>
        ) : (
          <ul className="mt-6 flex flex-col gap-3 pb-4">
            {history.map((entry, index) => (
              <HistoryEntryCard
                key={`${entry.stoppedAt}-${index}`}
                index={index + 1}
                entry={entry}
              />
            ))}
          </ul>
        )}
      </main>

      {history.length > 0 && (
        <section className="sticky bottom-0 flex shrink-0 flex-col items-center gap-3 pb-[max(0px,env(safe-area-inset-bottom))] pt-2">
          <button
            type="button"
            onClick={handleClearAll}
            className={`w-full touch-manipulation ${glassButtonClass} px-8 py-5`}
          >
            <span className="font-sans text-lg uppercase tracking-[0.3em] text-text-dark">
              Clear All
            </span>
          </button>
        </section>
      )}
    </div>
  )
}

export default HistoryScreen
