'use client'

import { useState } from 'react'
import { Team } from '../types'
import { TeamSettingsModal } from './TeamSettingsModal'
import { UserGroupIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/features/auth/AuthProvider'

interface TeamCardProps {
  team: Team
}

export function TeamCard({ team }: TeamCardProps) {
  const { user } = useAuth()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const currentMember = user ? team.members[user.uid] : undefined
  const isOwnerOrAdmin = currentMember?.role === 'owner' || currentMember?.role === 'admin'
  const memberCount = Object.keys(team.members).length
  const membersList = Object.values(team.members)

  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{team.name}</h3>
            {isOwnerOrAdmin && (
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700"
              >
                <Cog6ToothIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          <p className="mt-2 flex-1 text-sm text-gray-500 dark:text-gray-400">
            {team.description}
          </p>

          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <UserGroupIcon className="mr-2 h-5 w-5" />
              {memberCount} {memberCount === 1 ? 'member' : 'members'}
            </div>
          </div>

          <div className="mt-4 flex -space-x-2">
            {membersList.slice(0, 5).map((member) => (
              <div
                key={member.userId}
                className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-900 ring-2 ring-white dark:bg-gray-700 dark:ring-gray-800"
              >
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.email}`}
                  alt={member.email}
                  className="h-full w-full rounded-full"
                />
                <span className="sr-only">{member.email}</span>
              </div>
            ))}
            {memberCount > 5 && (
              <div className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-900 ring-2 ring-white dark:bg-gray-700 dark:ring-gray-800">
                <span>+{memberCount - 5}</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Your role: </span>
              <span className="font-medium capitalize">{currentMember?.role}</span>
            </div>
            {isOwnerOrAdmin && (
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Manage Team
              </button>
            )}
          </div>
        </div>
      </div>

      <TeamSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        team={team}
      />
    </>
  )
}
