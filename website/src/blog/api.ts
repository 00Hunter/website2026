import type { BlogPost, NewPostPayload } from './types'
import { getAuthToken } from '../auth.ts'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const USE_MOCK_DATA = !API_BASE_URL

const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building this portfolio',
    summary: 'How I put together this minimal, focused engineering portfolio site.',
    content:
      '<p>This site is built with React and Vite, with a focus on clean typography, a calm palette, and just enough structure to be useful.</p><p>The blog is a small extension on top of that: it reuses the same cards, sections, and layout so everything feels consistent.</p>',
    createdAt: new Date().toISOString(),
    tags: ['portfolio', 'react'],
  },
  {
    id: '2',
    title: 'Notes on backend APIs',
    summary: 'Some quick thoughts on designing APIs that stay maintainable over time.',
    content:
      '<p>Good APIs are boring in the best way: predictable URLs, clear error messages, and stable contracts.</p><ul><li>Keep the surface area small.</li><li>Prefer explicit fields over magic.</li><li>Write down the behavior in plain language.</li></ul>',
    createdAt: new Date().toISOString(),
    tags: ['backend', 'api-design'],
  },
]

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = `Request failed with status ${response.status}`
    throw new Error(message)
  }
  return (await response.json()) as T
}

export async function getPosts(): Promise<BlogPost[]> {
  if (USE_MOCK_DATA) {
    return Promise.resolve(mockPosts)
  }

  const response = await fetch(`${API_BASE_URL}/api/posts`)
  return handleResponse<BlogPost[]>(response)
}

export async function getPost(id: string): Promise<BlogPost> {
  if (USE_MOCK_DATA) {
    const found = mockPosts.find((post) => post.id === id)
    if (!found) {
      throw new Error('Post not found')
    }
    return Promise.resolve(found)
  }

  const response = await fetch(`${API_BASE_URL}/api/posts/${id}`)
  return handleResponse<BlogPost>(response)
}

export async function createPost(payload: NewPostPayload): Promise<BlogPost> {
  if (USE_MOCK_DATA) {
    const newPost: BlogPost = {
      id: String(mockPosts.length + 1),
      title: payload.title,
      summary: payload.summary,
      content: payload.content,
      tags: payload.tags,
      createdAt: new Date().toISOString(),
    }
    mockPosts.unshift(newPost)
    return Promise.resolve(newPost)
  }

  const token = getAuthToken()

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}/api/posts`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })
  return handleResponse<BlogPost>(response)
}

export async function updatePost(id: string, payload: Partial<NewPostPayload>): Promise<BlogPost> {
  if (USE_MOCK_DATA) {
    const index = mockPosts.findIndex((post) => post.id === id)
    if (index === -1) {
      throw new Error('Post not found')
    }
    const existing = mockPosts[index]
    const updated: BlogPost = {
      ...existing,
      title: payload.title ?? existing.title,
      summary: payload.summary ?? existing.summary,
      content: payload.content ?? existing.content,
      tags: payload.tags ?? existing.tags,
    }
    mockPosts[index] = updated
    return Promise.resolve(updated)
  }

  const token = getAuthToken()

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
  })

  return handleResponse<BlogPost>(response)
}

