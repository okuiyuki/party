import { useState } from 'react'
import AppLayout from './components/AppLayout'
import MainScreen from './components/MainScreen'
import SettingsScreen from './components/SettingsScreen'
import HistoryScreen from './components/HistoryScreen'
import TopScreen from './components/TopScreen'
import {
  getInitialHourMinute,
  loadPartyTargetTime,
  savePartyTargetTime,
  toTargetDate,
  type PartyTargetTime,
} from './settings/partyTargetTime'

type Screen = 'top' | 'main' | 'settings' | 'history'

function App() {
  const [screen, setScreen] = useState<Screen>('top')
  const [targetTime, setTargetTime] = useState<PartyTargetTime | null>(() => loadPartyTargetTime())
  const initialHourMinute = getInitialHourMinute(targetTime)

  const handleSet = (hour: number, minute: number) => {
    const saved = savePartyTargetTime(hour, minute)
    setTargetTime(saved)
    setScreen('top')
  }

  return (
    <AppLayout>
      {screen === 'top' ? (
        <TopScreen
          onStart={() => setScreen('main')}
          onSettings={() => setScreen('settings')}
          onHistory={() => setScreen('history')}
          targetDate={targetTime ? toTargetDate(targetTime) : null}
        />
      ) : screen === 'main' ? (
        <MainScreen targetTime={targetTime} onBack={() => setScreen('top')} />
      ) : screen === 'settings' ? (
        <SettingsScreen
          initialHour={initialHourMinute.hour}
          initialMinute={initialHourMinute.minute}
          onBack={() => setScreen('top')}
          onSet={handleSet}
        />
      ) : screen === 'history' ? (
        <HistoryScreen onBack={() => setScreen('top')}/>
      ) : null}
    </AppLayout>
  )
}

export default App
