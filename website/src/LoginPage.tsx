import type { FormEvent } from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import { login } from './auth.ts'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.')
      return
    }

    try {
      setSubmitting(true)
      await login(email.trim(), password)
      const redirectTo =
        (location.state && (location.state as { from?: string }).from) || '/blog/new'
      navigate(redirectTo)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not log in.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="section">
      <div className="blog-header">
        <div>
          <h2>Sign in to write</h2>
          <p className="blog-subtitle">Only you can publish new blog posts.</p>
        </div>
      </div>

      {error && <p className="blog-error">{error}</p>}

      <form className="blog-form" onSubmit={handleSubmit}>
        <label className="blog-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </label>

        <label className="blog-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Your password"
          />
        </label>

        <div className="blog-form-actions">
          <button type="submit" className="blog-primary-button" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default LoginPage

