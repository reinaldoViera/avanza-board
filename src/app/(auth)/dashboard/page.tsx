'use client'

import { useEffect, useState } from 'react'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/features/auth/AuthProvider'
import { Task } from '@/features/types'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'




export default function DashboardPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  
  const displayTasks = tasks.filter(task => {
    if (status) {
      return task.status === status
    }
    if (priority) {
      return task.priority === priority
    }
    return true
  })

  const totals = tasks.reduce((acc, task) => {
    if (task.status === 'in_progress') {
      acc.inProgress += 1
    } else if (task.status === 'done') {
      acc.done += 1
    }
    if (task.priority === 'high') {
      acc.highPriority += 1
    }
    return acc
  }, { inProgress: 0, done: 0, highPriority: 0 })


  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return

      try {
        const q = query(
          collection(db, 'tasks'),
          where('assignedTo', '==', user.uid),
          orderBy('dueDate', 'desc')
        )
        const querySnapshot = await getDocs(q)
        const tasksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Task[]

        setTasks(tasksData)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [user])

    

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
            Dashboard
          </h2>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

        <Link className="card cursor-pointer" href="/dashboard">
          <div className="text-sm font-medium text-gray-500">Total Tasks</div>
          <div className="mt-1 text-3xl font-semibold">{tasks.length}</div>
        </Link>
        <Link className="card cursor-pointer" href="/dashboard?status=in_progress">
          <div className="text-sm font-medium text-gray-500">In Progress</div>
          <div className="mt-1 text-3xl font-semibold">
            {totals.inProgress}
          </div>
        </Link>
        <Link className="card cursor-pointer" href="/dashboard?status=done">
          <div className="text-sm font-medium text-gray-500">Completed</div>
          <div className="mt-1 text-3xl font-semibold">
            {totals.done}
          </div>
        </Link>
        <Link className="card cursor-pointer" href="/dashboard?priority=high">
          <div className="text-sm font-medium text-gray-500">High Priority</div>
          <div className="mt-1 text-3xl font-semibold">
            {totals.highPriority}
          </div>
        </Link>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium">Recent Tasks</h3>
        <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {displayTasks.slice(0, 5).map((task) => (
                <tr key={task.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm">{task.title}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      task.status === 'done'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : task.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      task.priority === 'high'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
