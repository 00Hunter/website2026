import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import type { BlogPost } from './types'
import { getPosts } from './api'

function BlogHomePage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await getPosts()
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
          <h2>Blog</h2>
          <p className="blog-subtitle">
            Notes on engineering, projects, and things I&apos;m learning along the way.
          </p>
        </div>
      </div>

      {loading && <p>Loading posts…</p>}

      {!loading && error && <p className="blog-error">Could not load posts. Please try again.</p>}

      {!loading && !error && posts.length === 0 && (
        <div className="blog-empty">
          <p>No posts yet.</p>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="grid">
          {posts.map((post) => (
            <article key={post.id} className="card blog-card">
              <h3 className="blog-card-title">
                <Link to={`/blog/${post.id}`} className="blog-link">
                  {post.title}
                </Link>
              </h3>
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
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default BlogHomePage

