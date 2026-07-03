import { Heart, History, Settings, Sparkles, Wine } from 'lucide-react'
import { glassButtonClass } from '../styles/glassButton'

type TopScreenProps = {
  onStart: () => void
  onSettings: () => void
  onHistory: () => void
  targetDate: Date | null
}

function TopScreen({ onStart, onSettings, onHistory, targetDate: _targetDate }: TopScreenProps) {

  return (
    <>
      <header className="flex justify-center pt-2">
        <div className="relative flex items-end gap-1 text-rose-gold">
          <Sparkles className="absolute -left-4 -top-1 size-3 opacity-70" strokeWidth={1.5} />
          <Sparkles className="absolute -right-4 top-0 size-2 opacity-60" strokeWidth={1.5} />
          <Heart className="absolute -top-3 left-1/2 size-3 -translate-x-1/2" strokeWidth={1.5} />
          <Wine className="size-5 -rotate-12" strokeWidth={1.5} />
          <Wine className="size-5 rotate-12 scale-x-[-1]" strokeWidth={1.5} />
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-start pt-16 text-center">
        <p className="font-serif text-[120px] leading-none text-rose-gold">30</p>
        <p className="mt-2 font-sans text-sm uppercase tracking-[0.25em] text-rose-gold/80">
          Second Challenge
        </p>

        <div className="mt-6 flex w-full max-w-[200px] items-center gap-3">
          <div className="h-px flex-1 bg-rose-gold/40" />
          <Heart className="size-3 text-rose-gold" strokeWidth={1.5} fill="none" />
          <div className="h-px flex-1 bg-rose-gold/40" />
        </div>

        <p className="mt-6 font-serif text-base leading-relaxed text-text-dark">
          Try to stop
          <br />
          at exactly 30.00.
        </p>
      </main>

      <section className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onStart}
          className={`w-full ${glassButtonClass} px-8 py-5`}
        >
          <span className="font-sans text-lg uppercase tracking-[0.3em] text-text-dark">
            Start
          </span>
        </button>
        <p className="text-xs text-text-dark/60">※ Start with MC signal</p>
      </section>

      <footer className="mt-8 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={onHistory}
          className={`${glassButtonClass} flex items-center justify-center gap-2 px-4 py-4`}
        >
          <History className="size-4 text-rose-gold" strokeWidth={1.5} />
          <span className="font-sans text-xs uppercase tracking-widest text-rose-gold">
            History
          </span>
        </button>
        <button
          type="button"
          onClick={onSettings}
          className={`${glassButtonClass} flex items-center justify-center gap-2 px-4 py-4`}
        >
          <Settings className="size-4 text-rose-gold" strokeWidth={1.5} />
          <span className="font-sans text-xs uppercase tracking-widest text-rose-gold">
            Settings
          </span>
        </button>
      </footer>
    </>
  )
}

export default TopScreen
