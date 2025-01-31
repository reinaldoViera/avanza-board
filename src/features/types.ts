export interface Task {
  id: string
  title: string
  description: string
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high'
  assignedTo: string
  createdBy: string
  dueDate: string
  labels: string[]
  createdAt: string
  updatedAt: string
}

export interface Column {
  id: string
  title: string
  taskIds: string[]
}

export interface Board {
  tasks: { [key: string]: Task }
  columns: { [key: string]: Column }
  columnOrder: string[]
}
