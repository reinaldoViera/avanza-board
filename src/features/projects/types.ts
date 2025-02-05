import { Task } from '../types'

export type TaskStatus = 'todo' | 'in_progress' | 'done'

export interface Project {
  id: string
  name: string
  description: string
  teamId: string
  createdBy: string
  createdAt: string
  updatedAt: string
  taskIds: string[]
}
