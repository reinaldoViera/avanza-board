'use client'

import { useTheme } from 'next-themes'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
    >
      <span className="sr-only">Toggle theme</span>
      {theme === 'dark' ? (
        <SunIcon className="h-6 w-6" aria-hidden="true" />
      ) : (
        <MoonIcon className="h-6 w-6" aria-hidden="true" />
      )}
    </button>
  )
}
