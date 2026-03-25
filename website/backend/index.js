require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs/promises');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json());

const POSTS_DIR = path.join(__dirname, 'data', 'posts');

let posts = [];

function generatePostId() {
  // URL-safe id; reduces collision risk when multiple posts are created quickly.
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function writePostFile(post) {
  await fs.mkdir(POSTS_DIR, { recursive: true });

  const finalPath = path.join(POSTS_DIR, `${post.id}.json`);
  const tmpPath = path.join(
    POSTS_DIR,
    `${post.id}.tmp-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`
  );

  // Atomic-ish write: write temp file, then rename into place.
  await fs.writeFile(tmpPath, JSON.stringify(post, null, 2), 'utf8');
  await fs.rename(tmpPath, finalPath);
}

async function loadPostsFromDisk() {
  await fs.mkdir(POSTS_DIR, { recursive: true });

  const entries = await fs.readdir(POSTS_DIR);
  const jsonFiles = entries.filter((f) => f.endsWith('.json'));

  if (jsonFiles.length === 0) {
    // Seed initial posts the first time.
    const seedPosts = [
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

    posts = seedPosts.slice();
    // Store each seeded post as its own file.
    for (const post of seedPosts) {
      await writePostFile(post);
    }
  } else {
    const loaded = [];
    for (const fileName of jsonFiles) {
      const raw = await fs.readFile(path.join(POSTS_DIR, fileName), 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.id && parsed.title && parsed.content) {
        loaded.push(parsed);
      }
    }

    posts = loaded;
  }

  // Ensure latest posts show first.
  posts.sort((a, b) => {
    const at = Date.parse(a.createdAt || '') || 0;
    const bt = Date.parse(b.createdAt || '') || 0;
    return bt - at;
  });
}

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

app.post('/api/posts', async (req, res, next) => {
  const { title, summary, content, tags } = req.body || {};

  if (!title || !summary || !content) {
    return res.status(400).json({ message: 'title, summary, and content are required' });
  }

  const newPost = {
    id: generatePostId(),
    title,
    summary,
    content,
    tags: Array.isArray(tags) ? tags : [],
    createdAt: new Date().toISOString(),
  };

  try {
    await writePostFile(newPost);
    posts.unshift(newPost);
    return res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
});

app.put('/api/posts/:id', async (req, res, next) => {
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

  try {
    await writePostFile(updated);
    posts[postIndex] = updated;
    return res.json(updated);
  } catch (err) {
    next(err);
  }
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

loadPostsFromDisk()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend API listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start backend:', err);
    process.exit(1);
  });

