'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import { collection, query, where, onSnapshot, doc, runTransaction } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/features/auth/AuthProvider'
import { Board, Task } from '../../types'
import { KanbanColumn } from './KanbanColumn'
import { TaskModal } from './TaskModal'
import { PlusIcon } from '@heroicons/react/24/outline'

const initialBoard: Board = {
  tasks: {},
  columns: {
    backlog: {
      id: 'backlog',
      title: 'Backlog',
      taskIds: [],
    },
    todo: {
      id: 'todo',
      title: 'To Do',
      taskIds: [],
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      taskIds: [],
    },
    review: {
      id: 'review',
      title: 'Review',
      taskIds: [],
    },
    done: {
      id: 'done',
      title: 'Done',
      taskIds: [],
    },
  },
  columnOrder: ['backlog', 'todo', 'in-progress', 'review', 'done'],
}

export function KanbanBoard() {
  const { user } = useAuth()
  const [board, setBoard] = useState<Board>(initialBoard)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'tasks'),
      where('projectId', '==', 'avanza-board') // TODO: Replace with actual project ID
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newBoard = { ...initialBoard }

      snapshot.docs.forEach((doc) => {
        const task = { id: doc.id, ...doc.data() } as Task
        newBoard.tasks[doc.id] = task
        const status = task.status as keyof typeof newBoard.columns
        if (!newBoard.columns[status].taskIds.includes(doc.id)) {
          newBoard.columns[status].taskIds.push(doc.id)
        }
      })

      setBoard(newBoard)
    })

    return () => unsubscribe()
  }, [user])

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    try {
      await runTransaction(db, async (transaction) => {
        // Update the task's status in Firestore
        const taskRef = doc(db, 'tasks', draggableId)
        transaction.update(taskRef, {
          status: destination.droppableId,
          updatedAt: new Date().toISOString(),
        })

        // Update the local state
        const newBoard = { ...board }
        const sourceColumn = newBoard.columns[source.droppableId]
        const destColumn = newBoard.columns[destination.droppableId]

        sourceColumn.taskIds.splice(source.index, 1)
        destColumn.taskIds.splice(destination.index, 0, draggableId)

        setBoard(newBoard)
      })
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId)
    setIsTaskModalOpen(true)
  }

  const handleCreateTask = () => {
    setSelectedTaskId(null)
    setIsTaskModalOpen(true)
  }

  return (
    <div className="h-full px-4 py-8 md:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <button
          onClick={handleCreateTask}
          className="btn-primary"
        >
          <PlusIcon className="mr-2 h-5 w-5" />
          New Task
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {board.columnOrder.map((columnId) => {
            const column = board.columns[columnId]
            const tasks = column.taskIds.map((taskId) => board.tasks[taskId])

            return (
              <div key={column.id} className="flex-shrink-0 md:w-80">
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <KanbanColumn
                      column={column}
                      tasks={tasks}
                      onTaskClick={handleTaskClick}
                      provided={provided}
                    />
                  )}
                </Droppable>
              </div>
            )
          })}
        </div>
      </DragDropContext>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskId={selectedTaskId}
      />
    </div>
  )
}
