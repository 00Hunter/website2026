import { useEffect } from 'react'
import { Route, Routes, Link, useLocation } from 'react-router-dom'
import './App.css'
import PortfolioPage from './PortfolioPage'
import BlogHomePage from './blog/BlogHomePage.tsx'
import BlogDetailPage from './blog/BlogDetailPage.tsx'
import NewPostPage from './blog/NewPostPage.tsx'
import LoginPage from './LoginPage.tsx'
import AdminPage from './AdminPage.tsx'
import EditPostPage from './blog/EditPostPage.tsx'

function ScrollToSection() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== '/') return

    if (!location.hash) {
      window.scrollTo({ top: 0 })
      return
    }

    const id = location.hash.slice(1)
    if (!id) return

    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.pathname, location.hash])

  return null
}

function App() {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="tagline">Software Engineer</p>
          <h1 className="headline">Hi, I&apos;m Prajawal.</h1>
          <p className="subtitle">
            I design and build reliable software systems with a focus on clear structure, maintainable code, and a calm
            developer experience.
          </p>
        </div>

        <nav className="page-nav">
          <Link to="/">Home</Link>
          <Link to="/#about">About</Link>
          <Link to="/#experience">Experience</Link>
          <Link to="/#projects">Projects</Link>
          <Link to="/#contact">Contact</Link>
          <Link to="/blog">Blog</Link>
        </nav>
      </header>

      <main className="page-main">
        <ScrollToSection />
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/blog" element={<BlogHomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/blog/new" element={<NewPostPage />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/edit/:id" element={<EditPostPage />} />
        </Routes>
      </main>

      <footer className="page-footer">
        <p>© {new Date().getFullYear()} Prajawal Gupta.</p>
      </footer>
    </div>
  )
}

export default App
