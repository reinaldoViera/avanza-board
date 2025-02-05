'use client'

import { Fragment, useState, useEffect } from 'react'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useTeams } from '@/features/teams/hooks/useTeams'
import { Task } from '@/features/types'
import { Project } from '../types'
import { useAuth } from '@/features/auth/AuthProvider'
import { useTaskActions } from '@/features/tasks/hooks/useTaskActions'

interface EditTaskModalProps {
  isOpen: boolean
  onClose: () => void
  task: Task
  project: Project
}

export function EditTaskModal({
  isOpen,
  onClose,
  task,
  project,
}: EditTaskModalProps) {
  const { updateTask } = useTaskActions()
  const { teams } = useTeams()
  const { user } = useAuth()
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [priority, setPriority] = useState<Task['priority']>(task.priority)
  const [label, setLabel] = useState('')
  const [labels, setLabels] = useState<string[]>(task.labels)
  const [assignedTo, setAssignedTo] = useState(task.assignedTo)
  const [dueDate, setDueDate] = useState(task.dueDate)
  const [loading, setLoading] = useState(false)

  // Update form when task changes
  useEffect(() => {
    setTitle(task.title)
    setDescription(task.description)
    setPriority(task.priority)
    setLabels(task.labels)
    setAssignedTo(task.assignedTo)
    setDueDate(task.dueDate)
  }, [task])

  // Find the current project's team members
  const currentTeam = teams.find((team) => team.id === project.teamId)
  const teamMembersMap = currentTeam?.members || {}
  const teamMembers = Object.values(teamMembersMap)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)

    try {
      await updateTask(task.id, {
        title,
        description,
        priority,
        labels,
        assignedTo,
        dueDate
      })
      onClose()
    } catch (error) {
      console.error('Error updating task:', error)
    } finally {
      setLoading(false)
    }
  }

  const addLabel = () => {
    if (label && !labels.includes(label)) {
      setLabels([...labels, label])
      setLabel('')
    }
  }

  const removeLabel = (labelToRemove: string) => {
    setLabels(labels.filter((l) => l !== labelToRemove))
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
                      Edit Task
                    </DialogTitle>

                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                      <div>
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          className="input-field mt-1"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
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

                      <div>
                        <label
                          htmlFor="priority"
                          className="block text-sm font-medium"
                        >
                          Priority
                        </label>
                        <select
                          id="priority"
                          className="input-field mt-1"
                          value={priority}
                          onChange={(e) =>
                            setPriority(e.target.value as Task['priority'])
                          }
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="labels"
                          className="block text-sm font-medium"
                        >
                          Labels
                        </label>
                        <div className="mt-1 flex gap-2">
                          <input
                            type="text"
                            id="labels"
                            className="input-field flex-1"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            onKeyUp={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                addLabel()
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={addLabel}
                            className="btn-secondary"
                          >
                            Add
                          </button>
                        </div>
                        {labels.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {labels.map((label) => (
                              <span
                                key={label}
                                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                              >
                                {label}
                                <button
                                  type="button"
                                  onClick={() => removeLabel(label)}
                                  className="ml-1 text-gray-400 hover:text-gray-500"
                                >
                                  <XMarkIcon className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="assignedTo"
                          className="block text-sm font-medium"
                        >
                          Assigned To
                        </label>
                        <select
                          id="assignedTo"
                          className="input-field mt-1"
                          value={assignedTo}
                          onChange={(e) => setAssignedTo(e.target.value)}
                        >
                          <option value="">Unassigned</option>
                          {teamMembers.map((member) => (
                            <option
                              key={member.userId}
                              value={member.userId}
                            >
                              {member.name || member.email}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="dueDate"
                          className="block text-sm font-medium"
                        >
                          Due Date
                        </label>
                        <input
                          type="date"
                          id="dueDate"
                          className="input-field mt-1"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                        />
                      </div>

                      <div className="mt-5 flex justify-end gap-2">
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={onClose}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn-primary"
                          disabled={loading}
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
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
