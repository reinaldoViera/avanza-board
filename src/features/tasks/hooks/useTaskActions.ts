import { addDoc, collection, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Task } from '@/features/types'
import { nanoid } from 'nanoid'

interface CreateTaskData extends Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'projectId'> {
  createdBy: string
}

interface UpdateTaskData extends Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'projectId'>> {}

export function useTaskActions() {
  const createTask = async (projectId: string, taskData: CreateTaskData) => {
    const timestamp = new Date().toISOString()

    // Create the task in the tasks collection
    const taskDoc = await addDoc(collection(db, 'tasks'), {
      projectId,
      ...taskData,
      createdAt: timestamp,
      updatedAt: timestamp
    })
    const taskId = taskDoc.id

    // Add the task reference to the project
    const projectRef = doc(db, 'projects', projectId)
    await updateDoc(projectRef, {
      taskIds: arrayUnion(taskId)
    })

    return taskId
  }

  const updateTask = async (taskId: string, updates: UpdateTaskData) => {
    const taskRef = doc(db, 'tasks', taskId)
    const timestamp = new Date().toISOString()

    // Get current task to ensure it exists
    const taskSnap = await getDoc(taskRef)
    if (!taskSnap.exists()) {
      throw new Error('Task not found')
    }

    // Update the task with new data
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: timestamp
    })

    return taskId
  }

  return {
    createTask,
    updateTask
  }
}
