const jwt = require('jsonwebtoken');
const Author = require('../models/Author');

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token mancante o non valido' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'strive-secret');
    const author = await Author.findById(decoded.id).select('-password');

    if (!author) {
      return res.status(401).json({ message: 'Utente non trovato' });
    }

    req.user = author;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token non valido', error: error.message });
  }
}

module.exports = requireAuth;
