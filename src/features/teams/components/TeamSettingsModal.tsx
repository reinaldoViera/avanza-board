'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition, Tab, TransitionChild, DialogPanel, DialogTitle, TabGroup, TabList, TabPanels, TabPanel } from '@headlessui/react'
import { XMarkIcon, ClipboardIcon } from '@heroicons/react/24/outline'
import { Team, TeamMember } from '../types'
import { useTeams } from '../hooks/useTeams'
import { useAuth } from '@/features/auth/AuthProvider'

interface TeamSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  team: Team
}

export function TeamSettingsModal({ isOpen, onClose, team }: TeamSettingsModalProps) {
  const { user } = useAuth()
  const { updateTeam, generateInviteLink, updateMemberRole, removeMember } = useTeams()
  const [name, setName] = useState(team.name)
  const [description, setDescription] = useState(team.description)
  const [inviteLink, setInviteLink] = useState('')
  const [loading, setLoading] = useState(false)
  const currentMember = user ? team.members[user.uid] : undefined
  const isOwner = currentMember?.role === 'owner'
  const membersList = Object.values(team.members)

  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateTeam(team.id, { name, description })
      onClose()
    } catch (error) {
      console.error('Error updating team:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateInviteLink = async () => {
    try {
      const link = await generateInviteLink(team.id)
      setInviteLink(link)
    } catch (error) {
      console.error('Error generating invite link:', error)
    }
  }

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
  }

  const handleUpdateRole = async (userId: string, newRole: TeamMember['role']) => {
    try {
      await updateMemberRole(team.id, userId, newRole)
    } catch (error) {
      console.error('Error updating member role:', error)
    }
  }

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return

    try {
      await removeMember(team.id, userId)
    } catch (error) {
      console.error('Error removing member:', error)
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
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all dark:bg-gray-900 sm:my-8 sm:w-full sm:max-w-lg">
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

                <div className="bg-white px-4 pb-4 pt-5 dark:bg-gray-900 sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                      <DialogTitle as="h3" className="text-lg font-semibold leading-6">
                        Team Settings
                      </DialogTitle>

                      <TabGroup>
                        <TabList className="mt-4 flex space-x-4 border-b border-gray-200 dark:border-gray-700">
                          <Tab
                            className={({ selected }) =>
                              `border-b-2 px-4 py-2 text-sm font-medium ${
                                selected
                                  ? 'border-primary-500 text-primary-600'
                                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                              }`
                            }
                          >
                            General
                          </Tab>
                          <Tab
                            className={({ selected }) =>
                              `border-b-2 px-4 py-2 text-sm font-medium ${
                                selected
                                  ? 'border-primary-500 text-primary-600'
                                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                              }`
                            }
                          >
                            Members
                          </Tab>
                          <Tab
                            className={({ selected }) =>
                              `border-b-2 px-4 py-2 text-sm font-medium ${
                                selected
                                  ? 'border-primary-500 text-primary-600'
                                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                              }`
                            }
                          >
                            Invites
                          </Tab>
                        </TabList>

                        <TabPanels className="mt-4">
                          <TabPanel>
                            <form onSubmit={handleUpdateTeam} className="space-y-4">
                              <div>
                                <label htmlFor="name" className="block text-sm font-medium">
                                  Team Name
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
                                <label htmlFor="description" className="block text-sm font-medium">
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

                              <div className="flex justify-end">
                                <button type="submit" disabled={loading} className="btn-primary">
                                  {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                              </div>
                            </form>
                          </TabPanel>

                          <TabPanel>
                            <div className="space-y-4">
                              <div className="flow-root">
                                <ul role="list" className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
                                  {membersList.map((member) => (
                                    <li key={member.userId} className="py-4">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                          <img
                                            className="h-8 w-8 rounded-full"
                                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.email}`}
                                            alt=""
                                          />
                                          <div className="ml-3">
                                            <p className="text-sm font-medium">{member.email}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                              Joined {new Date(member.joinedAt).toLocaleDateString()}
                                            </p>
                                          </div>
                                        </div>
                                        {isOwner && member.userId !== user?.uid && (
                                          <div className="flex items-center gap-2">
                                            <select
                                              value={member.role}
                                              onChange={(e) =>
                                                handleUpdateRole(member.userId, e.target.value as TeamMember['role'])
                                              }
                                              className="input-field text-sm"
                                            >
                                              <option value="member">Member</option>
                                              <option value="admin">Admin</option>
                                            </select>
                                            <button
                                              onClick={() => handleRemoveMember(member.userId)}
                                              className="text-sm font-medium text-red-600 hover:text-red-500"
                                            >
                                              Remove
                                            </button>
                                          </div>
                                        )}
                                        {!isOwner && (
                                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                            {member.role}
                                          </span>
                                        )}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </TabPanel>

                          <TabPanel>
                            <div className="space-y-4">
                              <div>
                                <button
                                  type="button"
                                  onClick={handleGenerateInviteLink}
                                  className="btn-primary w-full"
                                >
                                  Generate New Invite Link
                                </button>
                              </div>

                              {inviteLink && (
                                <div className="mt-4">
                                  <label className="block text-sm font-medium">
                                    Invite Link
                                  </label>
                                  <div className="mt-1 flex rounded-md shadow-sm">
                                    <div className="relative flex flex-grow items-stretch">
                                      <input
                                        type="text"
                                        className="input-field"
                                        value={inviteLink}
                                        readOnly
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={copyInviteLink}
                                      className="btn-secondary ml-3"
                                    >
                                      <ClipboardIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                  </div>
                                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    This link will expire in 7 days
                                  </p>
                                </div>
                              )}
                            </div>
                          </TabPanel>
                        </TabPanels>
                      </TabGroup>
                    </div>
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
