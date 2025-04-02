/**
 * Task interface
 */
export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  assignedTo?: string;
  createdBy: string;
  dueDate: string;
  labels: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Column interface
 */
export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

/**
 * Board interface
 */
export interface Board {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: string[];
}
