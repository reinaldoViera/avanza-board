'use client'

import { useEffect, useState } from 'react'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { Project } from '@/features/projects/types'
import { KanbanBoard } from '@/features/projects/components/KanbanBoard'
import { useParams } from 'next/navigation'

export default function ProjectPage() {
  const { projects } = useProjects()
  const [project, setProject] = useState<Project | null>(null)
  const params = useParams()

  useEffect(() => {
    const currentProject = projects.find((p) => p.id === params.id)
    if (currentProject) {
      setProject(currentProject)
    }
  }, [projects, params.id])

  if (!project) {
    return <div>Loading project...</div>
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {project.description}
        </p>
      </div>

      <KanbanBoard project={project} />
    </div>
  )
}
