'use client'

import { useState } from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd'
import { Project, TaskStatus } from '../types'
import { useProjects } from '../hooks/useProjects'
import { useTasks } from '@/features/tasks/hooks/useTasks'
import { useTaskActions } from '@/features/tasks/hooks/useTaskActions'
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline'
import { CreateTaskModal } from './CreateTaskModal'
import { EditTaskModal } from './EditTaskModal'
import { Task } from '@/features/types'

interface KanbanBoardProps {
  project: Project
}

const columns: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
]

export function KanbanBoard({ project }: KanbanBoardProps) {
  const { updateTask } = useTaskActions()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const { tasks: projectTasks, loading } = useTasks(project.id)

  const tasks = projectTasks.reduce<Record<TaskStatus, Task[]>>(
    (acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = []
      }
      acc[task.status].push(task)
      return acc
    },
    { todo: [], in_progress: [], done: [] }
  )

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const task = projectTasks.find((t) => t.id === draggableId)
    if (!task) return

    try {
      await updateTask(task.id, {
        status: destination.droppableId as TaskStatus,
      })
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary inline-flex items-center gap-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid gap-4 md:grid-cols-3">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex flex-col rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50"
            >
              <h3 className="mb-4 text-lg font-medium">{column.title}</h3>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-1 flex-col gap-2"
                  >
                    {tasks[column.id].map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                          >
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium">{task.title}</h4>
                              <button
                                onClick={() => {
                                  setSelectedTask(task)
                                  setIsEditModalOpen(true)
                                }}
                                className="ml-2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              {task.description}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                  task.priority === 'high'
                                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                                    : task.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                                    : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                                }`}
                              >
                                {task.priority}
                              </span>
                              {task.labels.map((label: string) => (
                                <span
                                  key={label}
                                  className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                >
                                  {label}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        project={project}
      />

      {selectedTask && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedTask(null)
          }}
          project={project}
          task={selectedTask}
        />
      )}
    </>
  )
}
