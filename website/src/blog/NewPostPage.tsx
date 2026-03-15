import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import { createPost } from './api'
import { getAuthToken } from '../auth.ts'

function NewPostPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [contentHtml, setContentHtml] = useState('')
  const [contentText, setContentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      navigate('/login', { replace: true })
    }
  }, [navigate])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    const htmlContent = contentHtml
    const textContent = contentText.trim()

    if (!title.trim() || !textContent) {
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
      const newPost = await createPost({
        title: title.trim(),
        summary: summary.trim() || textContent.slice(0, 140),
        content: htmlContent,
        tags,
      })
      navigate(`/blog/${newPost.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create post.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="section">
      <div className="blog-header">
        <div>
          <h2>Write a new post</h2>
          <p className="blog-subtitle">Share what you&apos;re building or learning.</p>
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
              placeholder="Give your post a clear, descriptive title"
            />
          </label>

          <label className="blog-field">
            <span>Summary</span>
            <input
              type="text"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="One or two sentences about this post"
            />
          </label>

          <div className="blog-field">
            <span>Content</span>
            <SimpleEditor
              onUpdate={({ html, text }) => {
                setContentHtml(html)
                setContentText(text)
              }}
            />
          </div>

          <label className="blog-field">
            <span>Tags</span>
            <input
              type="text"
              value={tagsInput}
              onChange={(event) => setTagsInput(event.target.value)}
              placeholder="Comma separated tags (react, backend, notes)"
            />
          </label>
        </div>

        <aside className="blog-preview">
          <h3 className="blog-preview-title">{title || 'Live preview'}</h3>
          {summary && <p className="blog-card-meta">{summary}</p>}
          <div
            className="blog-preview-content"
            dangerouslySetInnerHTML={{ __html: contentHtml || '<p>Your content preview will appear here.</p>' }}
          />
        </aside>

        <div className="blog-form-actions">
          <button type="submit" className="blog-primary-button" disabled={submitting}>
            {submitting ? 'Publishing…' : 'Publish post'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default NewPostPage

