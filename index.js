const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
app.use(express.json())

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    author: { type: String, trim: true },
  },
  { timestamps: true },
)

const blogPostSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    comments: [commentSchema],
  },
  { strict: false, collection: 'blogPosts' },
)

const BlogPost = mongoose.model('BlogPost', blogPostSchema)

function isValidId(id) {
  return mongoose.isValidObjectId(id)
}

function handleError(error, res) {
  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: error.message })
  }
  console.error(error)
  return res.status(500).json({ message: 'Errore interno del server' })
}

app.get('/blogPosts/:id/comments', async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: 'ID del post non valido' })
  }

  try {
    const post = await BlogPost.findById(req.params.id).select('comments')
    if (!post) return res.status(404).json({ message: 'Post non trovato' })
    return res.json(post.comments)
  } catch (error) {
    return handleError(error, res)
  }
})

app.get('/blogPosts/:id/comments/:commentId', async (req, res) => {
  const { id, commentId } = req.params
  if (!isValidId(id) || !isValidId(commentId)) {
    return res.status(400).json({ message: 'ID non valido' })
  }

  try {
    const post = await BlogPost.findById(id).select('comments')
    if (!post) return res.status(404).json({ message: 'Post non trovato' })
    const comment = post.comments.id(commentId)
    if (!comment) return res.status(404).json({ message: 'Commento non trovato' })
    return res.json(comment)
  } catch (error) {
    return handleError(error, res)
  }
})

app.post('/blogPosts/:id', async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: 'ID del post non valido' })
  }
  if (typeof req.body.text !== 'string' || !req.body.text.trim()) {
    return res.status(400).json({ message: 'Il campo "text" è obbligatorio' })
  }

  try {
    const post = await BlogPost.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post non trovato' })
    post.comments.push({ text: req.body.text, author: req.body.author })
    await post.save()
    return res.status(201).json(post.comments[post.comments.length - 1])
  } catch (error) {
    return handleError(error, res)
  }
})

app.put('/blogPosts/:id/comment/:commentId', async (req, res) => {
  const { id, commentId } = req.params
  if (!isValidId(id) || !isValidId(commentId)) {
    return res.status(400).json({ message: 'ID non valido' })
  }

  try {
    const post = await BlogPost.findById(id)
    if (!post) return res.status(404).json({ message: 'Post non trovato' })
    const comment = post.comments.id(commentId)
    if (!comment) return res.status(404).json({ message: 'Commento non trovato' })

    if (req.body.text !== undefined) {
      if (typeof req.body.text !== 'string' || !req.body.text.trim()) {
        return res.status(400).json({ message: 'Il campo "text" non può essere vuoto' })
      }
      comment.text = req.body.text
    }
    if (req.body.author !== undefined) comment.author = req.body.author

    await post.save()
    return res.json(comment)
  } catch (error) {
    return handleError(error, res)
  }
})

app.delete('/blogPosts/:id/comment/:commentId', async (req, res) => {
  const { id, commentId } = req.params
  if (!isValidId(id) || !isValidId(commentId)) {
    return res.status(400).json({ message: 'ID non valido' })
  }

  try {
    const post = await BlogPost.findById(id)
    if (!post) return res.status(404).json({ message: 'Post non trovato' })
    const comment = post.comments.id(commentId)
    if (!comment) return res.status(404).json({ message: 'Commento non trovato' })
    comment.deleteOne()
    await post.save()
    return res.status(204).end()
  } catch (error) {
    return handleError(error, res)
  }
})

const port = process.env.PORT || 3000
const mongoUri = process.env.MONGODB_URI

if (!mongoUri) {
  console.error('Imposta MONGODB_URI per avviare il server')
  process.exit(1)
}

mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port, () => console.log(`Server avviato sulla porta ${port}`))
  })
  .catch((error) => {
    console.error('Connessione a MongoDB fallita:', error.message)
    process.exit(1)
  })