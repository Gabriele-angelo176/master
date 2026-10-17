const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Author = require('../models/Author');

function signToken(author) {
  return jwt.sign(
    { id: author._id, name: author.name, email: author.email },
    process.env.JWT_SECRET || 'strive-secret',
    { expiresIn: '1h' },
  );
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const authorExists = await Author.findOne({ email: normalizedEmail });

    if (authorExists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const author = await Author.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: 'Registration successful',
      user: { id: author._id, name: author.name, email: author.email },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const author = await Author.findOne({ email: normalizedEmail });

    if (!author) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, author.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(author);

    return res.json({
      message: 'Login successful',
      token,
      user: { id: author._id, name: author.name, email: author.email, avatar: author.avatar },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
}

async function getMe(req, res) {
  const author = req.user;

  return res.json({
    user: {
      id: author._id,
      name: author.name,
      email: author.email,
      avatar: author.avatar,
    },
  });
}

function googleCallback(req, res) {
  const frontUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const author = req.user;
  const token = signToken(author);
  const serializedUser = encodeURIComponent(
    JSON.stringify({
      id: author._id,
      name: author.name,
      email: author.email,
      avatar: author.avatar,
    }),
  );

  return res.redirect(`${frontUrl}/?token=${encodeURIComponent(token)}&user=${serializedUser}`);
}

module.exports = { register, login, getMe, googleCallback };
