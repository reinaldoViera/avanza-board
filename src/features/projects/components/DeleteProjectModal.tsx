'use client'

import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useProjects } from '../hooks/useProjects'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface DeleteProjectModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
}

export function DeleteProjectModal({
  isOpen,
  onClose,
  projectId,
}: DeleteProjectModalProps) {
  const { deleteProject } = useProjects()
  if (!isOpen) return null
  return (
    <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Delete Project
                  </DialogTitle>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this project?
                  </p>
                </div>

                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end gap-2">
                  <button
                    type="button"
                    className="btn-secondary inline-flex items-center gap-x-2"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-primary inline-flex items-center gap-x-2"
                    onClick={async () => {
                      await deleteProject(projectId)
                      onClose()
                    }}
                  >
                    Delete
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
        
    </Transition>
  )
}