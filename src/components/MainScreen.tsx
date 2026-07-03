import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { appendStopHistory } from '../settings/partyStopHistory'
import {
  calcDiffMs,
  formatDiffSeconds,
  formatDiffSecondsValue,
  formatJapanTime,
  getJapanNow,
  type PartyTargetTime,
} from '../settings/partyTargetTime'
import { glassButtonClass } from '../styles/glassButton'

type MainScreenProps = {
  targetTime: PartyTargetTime | null
  onBack: () => void
}

type Phase = 'ready' | 'stopped'

type StopResult = {
  stoppedTimeLabel: string
  diffMs: number | null
  diffLabel: string | null
}

function MainScreen({ targetTime, onBack }: MainScreenProps) {
  const [phase, setPhase] = useState<Phase>('ready')
  const [result, setResult] = useState<StopResult | null>(null)

  const handleStop = () => {
    const stoppedAt = getJapanNow()
    const stoppedTimeLabel = formatJapanTime(stoppedAt)
    const diffMs = calcDiffMs(stoppedAt, targetTime)
    const diffLabel = diffMs !== null ? formatDiffSeconds(diffMs) : null

    setResult({ stoppedTimeLabel, diffMs, diffLabel })
    appendStopHistory({
      stoppedAt: stoppedAt.toISOString(),
      stoppedTimeLabel,
      diffMs,
      diffLabel,
    })
    setPhase('stopped')
  }

  const handleRestart = () => {
    setResult(null)
    setPhase('ready')
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

      <main className="flex min-h-0 flex-1 flex-col items-center justify-center gap-8 text-center">
        {phase === 'stopped' && result && (
          <div className="flex w-full flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <p className="font-sans text-sm uppercase tracking-[0.25em] text-rose-gold/80">
                Stopped At
              </p>
              <p className="result-number text-5xl leading-none text-rose-gold">
                {result.stoppedTimeLabel}
              </p>
            </div>

            {result.diffMs !== null && (
              <>
                <div className="flex w-full max-w-[200px] items-center gap-3">
                  <div className="h-px flex-1 bg-rose-gold/40" />
                  <span className="font-sans text-xs uppercase tracking-widest text-rose-gold/70">
                    Diff
                  </span>
                  <div className="h-px flex-1 bg-rose-gold/40" />
                </div>

                <div className="flex flex-col items-center gap-2">
                  <p className="font-sans text-sm uppercase tracking-[0.25em] text-rose-gold/80">
                    Difference
                  </p>
                  <p className="flex items-baseline justify-center gap-2">
                    <span className="result-number text-4xl leading-none text-text-dark">
                      {formatDiffSecondsValue(result.diffMs)}
                    </span>
                    <span className="pb-0.5 font-sans text-sm tracking-[0.25em] text-text-dark/65">
                      Seconds
                    </span>
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={phase === 'ready' ? handleStop : handleRestart}
          className={`w-full max-w-[200px] ${glassButtonClass} px-8 py-5`}
        >
          <span className="font-sans text-lg uppercase tracking-[0.3em] text-text-dark">
            {phase === 'ready' ? 'Stop' : 'Restart'}
          </span>
        </button>
      </main>
    </div>
  )
}

export default MainScreen
