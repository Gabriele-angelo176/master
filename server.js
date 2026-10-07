import 'dotenv/config'
import process from 'node:process'
import { DatabaseSync } from 'node:sqlite'
import express from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import sgMail from '@sendgrid/mail'
import { fileURLToPath } from 'node:url'

export const app = express()
const port = process.env.PORT || 3000

const upload = multer({ storage: multer.memoryStorage() })
const db = new DatabaseSync(fileURLToPath(new URL('./data.sqlite', import.meta.url)))

db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS authors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    avatar TEXT
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL REFERENCES authors(id),
    cover TEXT
  );
`)

app.use(express.json())

const findAuthor = (authorId) => {
  const id = Number(authorId)

  if (!Number.isSafeInteger(id) || id < 1) {
    return undefined
  }

  const author = db.prepare('SELECT id, name, email, avatar FROM authors WHERE id = ?').get(id)

  return author ? { ...author, id: String(author.id) } : undefined
}

const findBlogPost = (blogPostId) => {
  const id = Number(blogPostId)

  if (!Number.isSafeInteger(id) || id < 1) {
    return undefined
  }

  const blogPost = db
    .prepare(
      'SELECT id, title, content, author_id AS authorId, cover FROM blog_posts WHERE id = ?',
    )
    .get(id)

  return blogPost
    ? { ...blogPost, id: String(blogPost.id), authorId: String(blogPost.authorId) }
    : undefined
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

const sendEmail = async ({ to, subject, text }) => {
  if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
    return { skipped: true, message: 'SendGrid not configured' }
  }

  await sgMail.send({
    to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject,
    text,
  })

  return { skipped: false }
}

const uploadToCloudinary = (file, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) {
          reject(error)
          return
        }

        resolve(result.secure_url)
      },
    )

    stream.end(file.buffer)
  })

app.get('/health', (_req, res) => {
  res.json({ ok: true, message: 'Server is running' })
})

app.post('/authors', async (req, res) => {
  const { name, email } = req.body ?? {}

  if (!name || !email) {
    return res.status(400).json({ message: 'name and email are required' })
  }

  const result = db.prepare('INSERT INTO authors (name, email) VALUES (?, ?)').run(name, email)
  const author = {
    id: String(result.lastInsertRowid),
    name,
    email,
    avatar: null,
  }

  try {
    await sendEmail({
      to: email,
      subject: 'Benvenuto nella piattaforma',
      text: `Ciao ${name}, il tuo account è stato creato con successo.`,
    })
  } catch (error) {
    console.warn('Email registration notification failed:', error.message)
  }

  return res.status(201).json({ message: 'Author created', author })
})

app.patch('/authors/:authorId/avatar', upload.single('avatar'), async (req, res) => {
  const author = findAuthor(req.params.authorId)

  if (!author) {
    return res.status(404).json({ message: 'Author not found' })
  }

  if (!req.file) {
    return res.status(400).json({ message: 'avatar file is required' })
  }

  try {
    const avatarUrl = await uploadToCloudinary(req.file, 'authors')
    db.prepare('UPDATE authors SET avatar = ? WHERE id = ?').run(avatarUrl, Number(author.id))
    author.avatar = avatarUrl

    return res.json({ message: 'Avatar updated', author })
  } catch (error) {
    console.error('Cloudinary author avatar upload failed:', error)
    return res.status(500).json({ message: 'Failed to upload author avatar' })
  }
})

app.post('/blogPosts', async (req, res) => {
  const { title, content, authorId } = req.body ?? {}

  if (!title || !content || !authorId) {
    return res.status(400).json({ message: 'title, content and authorId are required' })
  }

  const author = findAuthor(authorId)

  if (!author) {
    return res.status(404).json({ message: 'Author not found' })
  }

  const result = db
    .prepare('INSERT INTO blog_posts (title, content, author_id) VALUES (?, ?, ?)')
    .run(title, content, Number(author.id))
  const blogPost = {
    id: String(result.lastInsertRowid),
    title,
    content,
    authorId: author.id,
    cover: null,
  }

  try {
    await sendEmail({
      to: author.email,
      subject: 'Nuovo blog post pubblicato',
      text: `Ciao ${author.name}, il tuo post "${title}" è stato pubblicato con successo.`,
    })
  } catch (error) {
    console.warn('Email blog post notification failed:', error.message)
  }

  return res.status(201).json({ message: 'Blog post created', blogPost })
})

app.patch('/blogPosts/:blogPostId/cover', upload.single('cover'), async (req, res) => {
  const blogPost = findBlogPost(req.params.blogPostId)

  if (!blogPost) {
    return res.status(404).json({ message: 'Blog post not found' })
  }

  if (!req.file) {
    return res.status(400).json({ message: 'cover file is required' })
  }

  try {
    const coverUrl = await uploadToCloudinary(req.file, 'blog-posts')
    db.prepare('UPDATE blog_posts SET cover = ? WHERE id = ?').run(coverUrl, Number(blogPost.id))
    blogPost.cover = coverUrl

    return res.json({ message: 'Cover updated', blogPost })
  } catch (error) {
    console.error('Cloudinary blog cover upload failed:', error)
    return res.status(500).json({ message: 'Failed to upload blog cover' })
  }
})

const isDirectExecution = process.argv[1] && import.meta.url === new URL(process.argv[1], 'file:').href

if (isDirectExecution) {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
  })
}
