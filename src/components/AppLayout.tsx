import type { ReactNode } from 'react'
import backgroundImage from '../assets/background.png'

type AppLayoutProps = {
  children: ReactNode
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <div
      className="mx-auto flex h-svh w-full max-w-md flex-col overflow-hidden bg-cover bg-center bg-no-repeat px-6 py-10"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {children}
    </div>
  )
}

export default AppLayout
