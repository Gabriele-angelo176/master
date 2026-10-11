const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/strive-blog';
const JWT_SECRET = process.env.JWT_SECRET || 'strive-blog-secret-key';

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

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  author: { type: String, default: '' }
}, { timestamps: true });

const blogPostSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  cover: { type: String, required: true },
  readTime: {
    value: { type: Number, required: true },
    unit: { type: String, required: true }
  },
  author: { type: String, required: true },
  content: { type: String, required: true },
  comments: { type: [commentSchema], default: [] }
}, { timestamps: true });

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

function requireAuth(req, res, next) {
  const isPublicRoute =
    (req.path === '/login' || req.path === '/register') ||
    (req.path === '/authors' && req.method === 'POST');

  if (isPublicRoute) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token mancante o non valido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.user = decodedToken;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token non valido', error: error.message });
  }
}

app.use(requireAuth);

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, email e password sono obbligatori' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'La password deve contenere almeno 6 caratteri' });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: 'Utente già registrato' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    return res.status(201).json({
      message: 'Registrazione completata con successo',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Errore durante la registrazione', error: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e password sono obbligatori' });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login effettuato con successo',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Errore durante il login', error: error.message });
  }
});

app.get('/me', (req, res) => {
  res.status(200).json({ user: req.user });
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Strive Blog API attiva', user: req.user });
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
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, email e password sono obbligatori' });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ message: 'La password deve avere almeno 6 caratteri' });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: 'Utente già esistente' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    return res.status(201).json({
      message: 'Utente creato con successo',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Errore nella creazione utente', error: error.message });
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

app.get('/blogPosts/:id/comments', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'ID del blog post non valido' });
  }

  try {
    const post = await BlogPost.findById(req.params.id).select('comments');

    if (!post) {
      return res.status(404).json({ message: 'Blog post non trovato' });
    }

    res.status(200).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero commenti', error: error.message });
  }
});

app.get('/blogPosts/:id/comments/:commentId', async (req, res) => {
  const { id, commentId } = req.params;

  if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(commentId)) {
    return res.status(400).json({ message: 'ID non valido' });
  }

  try {
    const post = await BlogPost.findById(id).select('comments');

    if (!post) {
      return res.status(404).json({ message: 'Blog post non trovato' });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Commento non trovato' });
    }

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero commento', error: error.message });
  }
});

app.post('/blogPosts/:id', async (req, res) => {
  const { text, author } = req.body;

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'ID del blog post non valido' });
  }

  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ message: 'Il campo text è obbligatorio' });
  }

  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Blog post non trovato' });
    }

    post.comments.push({ text, author });
    await post.save();

    res.status(201).json(post.comments[post.comments.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Errore nell\'aggiunta del commento', error: error.message });
  }
});

app.put('/blogPosts/:id/comment/:commentId', async (req, res) => {
  const { id, commentId } = req.params;
  const { text, author } = req.body;

  if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(commentId)) {
    return res.status(400).json({ message: 'ID non valido' });
  }

  if (text !== undefined && (typeof text !== 'string' || !text.trim())) {
    return res.status(400).json({ message: 'Il campo text non può essere vuoto' });
  }

  try {
    const post = await BlogPost.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Blog post non trovato' });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Commento non trovato' });
    }

    if (text !== undefined) comment.text = text;
    if (author !== undefined) comment.author = author;

    await post.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Errore nella modifica del commento', error: error.message });
  }
});

app.delete('/blogPosts/:id/comment/:commentId', async (req, res) => {
  const { id, commentId } = req.params;

  if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(commentId)) {
    return res.status(400).json({ message: 'ID non valido' });
  }

  try {
    const post = await BlogPost.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Blog post non trovato' });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Commento non trovato' });
    }

    comment.deleteOne();
    await post.save();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Errore nella cancellazione del commento', error: error.message });
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

