'use client'

import { DroppableProvided } from '@hello-pangea/dnd'
import { Column, Task } from '../../types'
import { TaskCard } from './TaskCard'

interface KanbanColumnProps {
  column: Column
  tasks: Task[]
  onTaskClick: (taskId: string) => void
  provided: DroppableProvided
}

export function KanbanColumn({ column, tasks, onTaskClick, provided }: KanbanColumnProps) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.droppableProps}
      className="flex h-full flex-col rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium">{column.title}</h3>
        <span className="flex h-5 w-5 items-center justify-center rounded bg-gray-200 text-xs font-medium dark:bg-gray-700">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            onClick={() => onTaskClick(task.id)}
          />
        ))}
        {provided.placeholder}
      </div>
    </div>
  )
}
