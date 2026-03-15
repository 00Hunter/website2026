import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../App.css'
import type { BlogPost } from './types'
import { getPost, updatePost } from './api'
import { getAuthToken } from '../auth.ts'

function EditPostPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [post, setPost] = useState<BlogPost | null>(null)
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [contentHtml, setContentHtml] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      navigate('/login', { replace: true })
      return
    }
  }, [navigate])

  useEffect(() => {
    if (!id) return

    let cancelled = false

    async function load() {
      try {
        const data = await getPost(id)
        if (cancelled) return

        setPost(data)
        setTitle(data.title)
        setSummary(data.summary)
        setContentHtml(data.content)
        setTagsInput((data.tags ?? []).join(', '))
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load post.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [id])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (!id) {
      setError('Missing post id.')
      return
    }

    if (!title.trim() || !contentHtml.trim()) {
      setError('Title and content are required.')
      return
    }

    const tags =
      tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean) ?? []

    try {
      setSubmitting(true)
      const updated = await updatePost(id, {
        title: title.trim(),
        summary: summary.trim() || (post ? post.summary : ''),
        content: contentHtml,
        tags,
      })
      navigate(`/blog/${updated.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update post.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <section className="section">
        <p>Loading post…</p>
      </section>
    )
  }

  if (!post) {
    return (
      <section className="section">
        <p className="blog-error">Could not load this post for editing.</p>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="blog-header">
        <div>
          <h2>Edit post</h2>
          <p className="blog-subtitle">Update the title, summary, content, or tags.</p>
        </div>
      </div>

      {error && <p className="blog-error">{error}</p>}

      <form className="blog-form" onSubmit={handleSubmit}>
        <div>
          <label className="blog-field">
            <span>Title</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Title"
            />
          </label>

          <label className="blog-field">
            <span>Summary</span>
            <input
              type="text"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="Summary"
            />
          </label>

          <label className="blog-field">
            <span>Content (HTML)</span>
            <textarea
              value={contentHtml}
              onChange={(event) => setContentHtml(event.target.value)}
              rows={10}
            />
          </label>

          <label className="blog-field">
            <span>Tags</span>
            <input
              type="text"
              value={tagsInput}
              onChange={(event) => setTagsInput(event.target.value)}
              placeholder="Comma separated tags"
            />
          </label>
        </div>

        <div className="blog-form-actions">
          <button type="submit" className="blog-primary-button" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default EditPostPage

