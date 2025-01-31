'use client'

import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition, Listbox, TransitionChild, DialogPanel, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import { XMarkIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/features/auth/AuthProvider'
import { Task } from '../../types'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  taskId: string | null
}

const priorities = ['low', 'medium', 'high']
const statuses = ['backlog', 'todo', 'in-progress', 'review', 'done']

const defaultTask: Omit<Task, 'id'> = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  assignedTo: '',
  createdBy: '',
  dueDate: new Date().toISOString().split('T')[0],
  labels: [],
  createdAt: '',
  updatedAt: '',
}

export function TaskModal({ isOpen, onClose, taskId }: TaskModalProps) {
  const { user } = useAuth()
  const [task, setTask] = useState<Omit<Task, 'id'>>(defaultTask)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) {
        setTask({ ...defaultTask, createdBy: user?.uid || '' })
        return
      }

      try {
        const taskDoc = await getDoc(doc(db, 'tasks', taskId))
        if (taskDoc.exists()) {
          setTask(taskDoc.data() as Task)
        }
      } catch (error) {
        console.error('Error fetching task:', error)
      }
    }

    fetchTask()
  }, [taskId, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const taskData = {
        ...task,
        updatedAt: new Date().toISOString(),
      }

      if (taskId) {
        await updateDoc(doc(db, 'tasks', taskId), taskData)
      } else {
        const newTaskRef = doc(collection(db, 'tasks'))
        await setDoc(newTaskRef, {
          ...taskData,
          createdAt: new Date().toISOString(),
          createdBy: user.uid,
          projectId: 'avanza-board', // TODO: Replace with actual project ID
        })
      }

      onClose()
    } catch (error) {
      console.error('Error saving task:', error)
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

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      className="input-field mt-1"
                      value={task.title}
                      onChange={(e) => setTask({ ...task, title: e.target.value })}
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
                      value={task.description}
                      onChange={(e) => setTask({ ...task, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">
                        Status
                      </label>
                      <Listbox
                        value={task.status}
                        onChange={(value) => setTask({ ...task, status: value })}
                      >
                        <div className="relative mt-1">
                          <ListboxButton className="input-field w-full text-left">
                            <span className="block truncate">{task.status}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                          </ListboxButton>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 sm:text-sm">
                              {statuses.map((status) => (
                                <ListboxOption
                                  key={status}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                      active
                                        ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                                        : 'text-gray-900 dark:text-gray-100'
                                    }`
                                  }
                                  value={status}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected ? 'font-medium' : 'font-normal'
                                        }`}
                                      >
                                        {status}
                                      </span>
                                      {selected ? (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600 dark:text-primary-400">
                                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </ListboxOption>
                              ))}
                            </ListboxOptions>
                          </Transition>
                        </div>
                      </Listbox>
                    </div>

                    <div>
                      <label className="block text-sm font-medium">
                        Priority
                      </label>
                      <Listbox
                        value={task.priority}
                        onChange={(value) => setTask({ ...task, priority: value })}
                      >
                        <div className="relative mt-1">
                          <ListboxButton className="input-field w-full text-left">
                            <span className="block truncate">{task.priority}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                          </ListboxButton>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 sm:text-sm">
                              {priorities.map((priority) => (
                                <ListboxOption
                                  key={priority}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                      active
                                        ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                                        : 'text-gray-900 dark:text-gray-100'
                                    }`
                                  }
                                  value={priority}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected ? 'font-medium' : 'font-normal'
                                        }`}
                                      >
                                        {priority}
                                      </span>
                                      {selected ? (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600 dark:text-primary-400">
                                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </ListboxOption>
                              ))}
                            </ListboxOptions>
                          </Transition>
                        </div>
                      </Listbox>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium">
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      className="input-field mt-1"
                      value={task.dueDate.split('T')[0]}
                      onChange={(e) =>
                        setTask({ ...task, dueDate: e.target.value })
                      }
                    />
                  </div>

                  <div className="mt-5 sm:mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full"
                    >
                      {loading ? 'Saving...' : taskId ? 'Update Task' : 'Create Task'}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
