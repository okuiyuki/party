import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { glassButtonClass } from '../styles/glassButton'

type SettingsScreenProps = {
  initialHour: number
  initialMinute: number
  onBack: () => void
  onSet: (hour: number, minute: number) => void
}

function padTime(value: number) {
  return String(value).padStart(2, '0')
}

function toTimeInputValue(hour: number, minute: number) {
  return `${padTime(hour)}:${padTime(minute)}`
}

type NativeTimePickerProps = {
  hour: number
  minute: number
  onChange: (hour: number, minute: number) => void
}

function NativeTimePicker({ hour, minute, onChange }: NativeTimePickerProps) {
  const handleChange = (rawValue: string) => {
    if (!rawValue) return
    const [nextHour, nextMinute] = rawValue.split(':').map(Number)
    if (Number.isNaN(nextHour) || Number.isNaN(nextMinute)) return
    onChange(nextHour, nextMinute)
  }

  return (
    <label className="relative block cursor-pointer touch-manipulation">
      <div
        aria-hidden="true"
        className="pointer-events-none rounded-2xl border border-white/30 bg-white/50 px-8 py-4 shadow-[0_4px_20px_rgba(184,142,125,0.15)] backdrop-blur-sm"
      >
        <div className="flex items-center justify-center gap-3">
          <span className="w-[4.75rem] text-center font-sans text-xs uppercase tracking-widest text-rose-gold/80">
            Hour
          </span>
          <span className="w-4" aria-hidden="true" />
          <span className="w-[4.75rem] text-center font-sans text-xs uppercase tracking-widest text-rose-gold/80">
            Min
          </span>
        </div>
        <div className="mt-2 flex items-center justify-center gap-3 font-serif text-4xl tabular-nums text-rose-gold">
          <span className="w-[4.75rem] text-center">{padTime(hour)}</span>
          <span className="w-4 text-center leading-none">:</span>
          <span className="w-[4.75rem] text-center">{padTime(minute)}</span>
        </div>
      </div>
      <input
        type="time"
        step={60}
        value={toTimeInputValue(hour, minute)}
        onChange={(event) => handleChange(event.target.value)}
        className="time-picker-input"
        aria-label="Set target time"
      />
    </label>
  )
}

function SettingsScreen({ initialHour, initialMinute, onBack, onSet }: SettingsScreenProps) {
  const [hour, setHour] = useState(initialHour)
  const [minute, setMinute] = useState(initialMinute)

  const handleTimeChange = (nextHour: number, nextMinute: number) => {
    setHour(nextHour)
    setMinute(nextMinute)
  }

  const handleSet = () => {
    onSet(hour, minute)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <header className="flex shrink-0 justify-start pt-2">
        <button
          type="button"
          onClick={onBack}
          className={`${glassButtonClass} flex touch-manipulation items-center gap-1 px-4 py-3`}
        >
          <ChevronLeft className="size-4 text-rose-gold" strokeWidth={1.5} />
          <span className="font-sans text-xs uppercase tracking-widest text-rose-gold">
            Back
          </span>
        </button>
      </header>

      <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-1 py-6 text-center">
        <p className="font-sans text-sm uppercase tracking-[0.25em] text-rose-gold/80">
          Set Time
        </p>

        <div className="mt-8">
          <NativeTimePicker hour={hour} minute={minute} onChange={handleTimeChange} />
        </div>

        <p className="mt-6 font-sans text-xs text-text-dark/60">
          Tap to open time picker
        </p>
      </main>

      <section className="sticky bottom-0 flex shrink-0 flex-col items-center gap-3 pb-[max(0px,env(safe-area-inset-bottom))] pt-2">
        <button
          type="button"
          onClick={handleSet}
          className={`w-full touch-manipulation ${glassButtonClass} px-8 py-5`}
        >
          <span className="font-sans text-lg uppercase tracking-[0.3em] text-text-dark">
            Set
          </span>
        </button>
      </section>
    </div>
  )
}

export default SettingsScreen
