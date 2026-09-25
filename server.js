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

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Strive Blog API attiva' });
});

app.get('/authors', async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
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

