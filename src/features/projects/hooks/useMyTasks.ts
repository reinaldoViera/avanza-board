import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/features/auth/AuthProvider'
import { Task } from '@/features/types'

export function useMyTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'tasks'),
      where('assignedTo', '==', user.uid)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userTasks: Task[] = []
      snapshot.forEach((doc) => {
        userTasks.push({ id: doc.id, ...doc.data() } as Task)
      })
      setTasks(userTasks)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  return { tasks, loading }
}