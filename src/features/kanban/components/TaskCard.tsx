'use client'

import { Draggable } from '@hello-pangea/dnd'
import { Task } from '../../types'
import { format } from 'date-fns'

interface TaskCardProps {
  task: Task
  index: number
  onClick: () => void
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export function TaskCard({ task, index, onClick }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`
            group cursor-pointer rounded-lg bg-white p-4 shadow-sm transition-all
            hover:shadow-md dark:bg-gray-900
            ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary-500' : ''}
          `}
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <h4 className="flex-1 text-sm font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400">
              {task.title}
            </h4>
            <span
              className={`inline-flex flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                priorityColors[task.priority]
              }`}
            >
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p className="mb-3 text-sm text-gray-500 line-clamp-2 dark:text-gray-400">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              {task.labels.map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-800"
                >
                  {label}
                </span>
              ))}
            </div>
            {task.dueDate && (
              <span>
                Due {format(new Date(task.dueDate), 'MMM d')}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}
