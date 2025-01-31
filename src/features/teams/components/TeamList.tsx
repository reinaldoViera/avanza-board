'use client'

import { useState } from 'react'
import { useTeams } from '../hooks/useTeams'
import { CreateTeamModal } from './CreateTeamModal'
import { TeamCard } from './TeamCard'
import { PlusIcon } from '@heroicons/react/24/outline'

export function TeamList() {
  const { teams, loading } = useTeams()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Teams</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary"
        >
          <PlusIcon className="mr-2 h-5 w-5" />
          New Team
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
          <h3 className="mt-2 text-sm font-semibold">No teams</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating a new team
          </p>
          <div className="mt-6">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              New Team
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}

      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}
