require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json());

// Simple in-memory data store for demo purposes
let nextPostId = 3;

const posts = [
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
];

// For this demo we use a single hard-coded user
const DEMO_USER = {
  id: 'user-1',
  email: process.env.DEMO_USER_EMAIL || 'prajawal@example.com',
  passwordHash: null,
};

const DEMO_USER_PASSWORD = process.env.DEMO_USER_PASSWORD || 'password123';

async function ensureDemoUser() {
  if (!DEMO_USER.passwordHash) {
    DEMO_USER.passwordHash = await bcrypt.hash(DEMO_USER_PASSWORD, 10);
  }
}

function generateToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: '1h' },
  );
}

async function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const [, token] = header.split(' ');

  if (!token) {
    return res.status(401).json({ message: 'Missing Authorization header' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  await ensureDemoUser();

  if (email !== DEMO_USER.email) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, DEMO_USER.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(DEMO_USER);
  return res.json({ token });
});

app.get('/api/posts', (req, res) => {
  res.json(posts);
});

app.get('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => p.id === id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  return res.json(post);
});

app.post('/api/posts', authMiddleware, (req, res) => {
  const { title, summary, content, tags } = req.body || {};

  if (!title || !summary || !content) {
    return res.status(400).json({ message: 'title, summary, and content are required' });
  }

  const newPost = {
    id: String(nextPostId++),
    title,
    summary,
    content,
    tags: Array.isArray(tags) ? tags : [],
    createdAt: new Date().toISOString(),
  };

  posts.unshift(newPost);

  return res.status(201).json(newPost);
});

app.put('/api/posts/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { title, summary, content, tags } = req.body || {};

  const postIndex = posts.findIndex((p) => p.id === id);
  if (postIndex === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const existing = posts[postIndex];

  const updated = {
    ...existing,
    title: title ?? existing.title,
    summary: summary ?? existing.summary,
    content: content ?? existing.content,
    tags: Array.isArray(tags) ? tags : existing.tags,
  };

  posts[postIndex] = updated;

  return res.json(updated);
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Backend API listening on http://localhost:${PORT}`);
});

