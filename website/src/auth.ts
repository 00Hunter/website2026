const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const TOKEN_KEY = 'authToken'

type LoginResponse = {
  token: string
}

async function handleAuthResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = `Login failed with status ${response.status}`
    throw new Error(message)
  }
  return (await response.json()) as T
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearAuthToken(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

export async function login(email: string, password: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await handleAuthResponse<LoginResponse>(response)
  setAuthToken(data.token)
}

