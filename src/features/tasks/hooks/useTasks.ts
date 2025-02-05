import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Task } from '@/features/types'

export function useTasks(projectId: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!projectId) {
      setTasks([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'tasks'),
      where('projectId', '==', projectId)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedTasks: Task[] = []
      snapshot.forEach((doc) => {
        loadedTasks.push({ id: doc.id, ...doc.data() } as Task)
      })
      setTasks(loadedTasks)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [projectId])

  return { tasks, loading }
}

export async function getTasksByIds(taskIds: string[]) {
  if (!taskIds.length) return []
  
  const tasks: Task[] = []
  for (const taskId of taskIds) {
    const taskDoc = await getDoc(doc(db, 'tasks', taskId))
    if (taskDoc.exists()) {
      tasks.push({ id: taskDoc.id, ...taskDoc.data() } as Task)
    }
  }
  return tasks
}
