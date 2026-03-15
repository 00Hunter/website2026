import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import type { BlogPost } from './blog/types'

function AdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

        const response = await fetch(`${API_BASE_URL}/api/posts`)
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = (await response.json()) as BlogPost[]
        if (!cancelled) {
          setPosts(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load posts.')
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
  }, [])

  return (
    <section className="section">
      <div className="blog-header">
        <div>
          <h2>Admin</h2>
          <p className="blog-subtitle">
            Manage blog posts: create new content and edit existing entries.
          </p>
        </div>

        <Link to="/blog/new" className="blog-primary-button">
          Create new post
        </Link>
      </div>

      {loading && <p>Loading posts…</p>}

      {!loading && error && <p className="blog-error">Could not load posts. Please try again.</p>}

      {!loading && !error && posts.length === 0 && (
        <div className="blog-empty">
          <p>No posts yet.</p>
          <p className="blog-subtitle">Use the &quot;Create new post&quot; button above to add one.</p>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="grid">
          {posts.map((post) => (
            <article key={post.id} className="card blog-card">
              <h3 className="blog-card-title">{post.title}</h3>
              <p className="blog-card-meta">
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Draft'}
              </p>
              <p>{post.summary}</p>
              {post.tags && post.tags.length > 0 && (
                <div className="blog-tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="blog-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="blog-form-actions" style={{ marginTop: '1rem' }}>
                <Link to={`/admin/edit/${post.id}`} className="blog-primary-button">
                  Edit
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default AdminPage

