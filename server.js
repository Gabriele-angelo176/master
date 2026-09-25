const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/strive-blog';

app.use(cors());
app.use(express.json());

const authorSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cognome: { type: String, required: true },
  email: { type: String, required: true },
  dataDiNascita: { type: String, default: '' },
  avatar: { type: String, default: '' }
}, { timestamps: true });

const Author = mongoose.model('Author', authorSchema);

const blogPostSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  cover: { type: String, required: true },
  readTime: {
    value: { type: Number, required: true },
    unit: { type: String, required: true }
  },
  author: { type: String, required: true },
  content: { type: String, required: true }
}, { timestamps: true });

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Strive Blog API attiva' });
});

app.get('/authors', async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Author.countDocuments();
    const authors = await Author.find().skip(skip).limit(limit);

    res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      authors
    });
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero autori', error: error.message });
  }
});

app.get('/authors/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({ message: 'Autore non trovato' });
    }

    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero autore', error: error.message });
  }
});

app.get('/authors/:id/blogPosts', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({ message: 'Autore non trovato' });
    }

    const posts = await BlogPost.find({ author: author.email });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero blog post dell\'autore', error: error.message });
  }
});

app.post('/authors', async (req, res) => {
  const { nome, cognome, email, dataDiNascita, avatar } = req.body;

  if (!nome || !cognome || !email) {
    return res.status(400).json({ message: 'Nome, cognome ed email sono obbligatori' });
  }

  try {
    const newAuthor = new Author({
      nome,
      cognome,
      email,
      dataDiNascita: dataDiNascita || '',
      avatar: avatar || ''
    });

    const savedAuthor = await newAuthor.save();
    res.status(201).json(savedAuthor);
  } catch (error) {
    res.status(500).json({ message: 'Errore nella creazione autore', error: error.message });
  }
});

app.put('/authors/:id', async (req, res) => {
  const { nome, cognome, email, dataDiNascita, avatar } = req.body;

  if (!nome || !cognome || !email) {
    return res.status(400).json({ message: 'Nome, cognome ed email sono obbligatori' });
  }

  try {
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      { nome, cognome, email, dataDiNascita: dataDiNascita || '', avatar: avatar || '' },
      { new: true, runValidators: true }
    );

    if (!updatedAuthor) {
      return res.status(404).json({ message: 'Autore non trovato' });
    }

    res.status(200).json(updatedAuthor);
  } catch (error) {
    res.status(500).json({ message: 'Errore nella modifica autore', error: error.message });
  }
});

app.delete('/authors/:id', async (req, res) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);

    if (!deletedAuthor) {
      return res.status(404).json({ message: 'Autore non trovato' });
    }

    res.status(200).json({ message: 'Autore eliminato con successo', deletedAuthor });
  } catch (error) {
    res.status(500).json({ message: 'Errore nella cancellazione autore', error: error.message });
  }
});

app.get('/blogPosts', async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const titleFilter = req.query.title;

    let query = {};

    if (titleFilter) {
      query.title = { $regex: titleFilter, $options: 'i' };
    }

    const total = await BlogPost.countDocuments(query);
    const posts = await BlogPost.find(query).skip(skip).limit(limit);

    res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      posts
    });
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero blog post', error: error.message });
  }
});

app.get('/blogPosts/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Blog post non trovato' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero blog post', error: error.message });
  }
});

app.post('/blogPosts', async (req, res) => {
  const { category, title, cover, readTime, author, content } = req.body;

  if (!category || !title || !cover || !readTime || !author || !content) {
    return res.status(400).json({ message: 'Tutti i campi del blog post sono obbligatori' });
  }

  try {
    const newPost = new BlogPost({
      category,
      title,
      cover,
      readTime,
      author,
      content
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: 'Errore nella creazione blog post', error: error.message });
  }
});

app.put('/blogPosts/:id', async (req, res) => {
  const { category, title, cover, readTime, author, content } = req.body;

  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { category, title, cover, readTime, author, content },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Blog post non trovato' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Errore nella modifica blog post', error: error.message });
  }
});

app.delete('/blogPosts/:id', async (req, res) => {
  try {
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Blog post non trovato' });
    }

    res.status(200).json({ message: 'Blog post eliminato con successo', deletedPost });
  } catch (error) {
    res.status(500).json({ message: 'Errore nella cancellazione blog post', error: error.message });
  }
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connesso a MongoDB');
    app.listen(PORT, () => {
      console.log(`Server in ascolto su http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Errore connessione MongoDB:', error.message);
    process.exit(1);
  });

