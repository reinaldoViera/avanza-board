'use client'

import { Fragment, useState } from 'react'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useProjects } from '../hooks/useProjects'
import { useTeams } from '@/features/teams/hooks/useTeams'
import { useRouter } from 'next/navigation'

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  teamId?: string
}

export function CreateProjectModal({
  isOpen,
  onClose,
  teamId: defaultTeamId,
}: CreateProjectModalProps) {
  const router = useRouter()
  const { createProject } = useProjects()
  const { teams } = useTeams()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [teamId, setTeamId] = useState(defaultTeamId || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const projectId = await createProject(name, description, teamId)
      onClose()
      setName('')
      setDescription('')
      setTeamId(defaultTeamId || '')
      router.push(`/projects/${projectId}`)
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all dark:bg-gray-900 sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-lg font-semibold leading-6"
                    >
                      Create New Project
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Create a new project and assign it to a team.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium"
                        >
                          Project Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="input-field mt-1"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          rows={3}
                          className="input-field mt-1"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>

                      {!defaultTeamId && (
                        <div>
                          <label
                            htmlFor="team"
                            className="block text-sm font-medium"
                          >
                            Team
                          </label>
                          <select
                            id="team"
                            className="input-field mt-1"
                            value={teamId}
                            onChange={(e) => setTeamId(e.target.value)}
                            required
                          >
                            <option value="">Select a team</option>
                            {teams.map((team) => (
                              <option key={team.id} value={team.id}>
                                {team.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn-primary w-full sm:ml-3 sm:w-auto"
                        >
                          {loading ? 'Creating...' : 'Create Project'}
                        </button>
                        <button
                          type="button"
                          className="btn-secondary mt-3 w-full sm:mt-0 sm:w-auto"
                          onClick={onClose}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
