export interface TeamMember {
  userId: string
  email: string
  role: 'owner' | 'admin' | 'member'
  joinedAt: string
}

export interface Team {
  id: string
  name: string
  description: string
  createdBy: string
  createdAt: string
  updatedAt: string
  inviteCode: string
  members: { [userId: string]: TeamMember }
}

export interface Project {
  id: string
  name: string
  description: string
  teamId: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface TeamInvite {
  id: string
  teamId: string
  email: string
  role: TeamMember['role']
  createdAt: string
  expiresAt: string
}
