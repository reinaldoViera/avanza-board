'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTeams } from '@/features/teams/hooks/useTeams'
import { useAuth } from '@/features/auth/AuthProvider'
import { useParams } from 'next/navigation'

export default function JoinTeamPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { joinTeamWithCode } = useTeams()
  const [error, setError] = useState('')
  const [joining, setJoining] = useState(false)

  const params = useParams()
  const { code } = params

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
      return
    }

    const joinTeam = async () => {
      if (!user || joining) return

      setJoining(true)
      try {
        if (!code) throw new Error('Invalid invite code')
        await joinTeamWithCode(code as string)
        router.push('/team')
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to join team')
      } finally {
        setJoining(false)
      }
    }

    joinTeam()
  }, [user, authLoading, code, router, joinTeamWithCode, joining]) 

  if (authLoading || !user) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Joining Team...
          </h2>
          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4 dark:bg-red-900">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Error joining team
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    {error}
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => router.push('/team')}
                      className="btn-primary"
                    >
                      Go to Teams
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
