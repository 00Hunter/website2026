export interface BlogPost {
  id: string
  title: string
  summary: string
  content: string
  createdAt: string
  tags?: string[]
}

export type NewPostPayload = {
  title: string
  summary: string
  content: string
  tags?: string[]
}

