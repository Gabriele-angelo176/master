const express = require('express');
const cors = require('cors');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes');
const authorRoutes = require('./routes/authorRoutes');
const blogPostRoutes = require('./routes/blogPostRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
require('./config/passport');

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Strive Blog API is running' });
});

app.use('/auth', authRoutes);
app.use('/authors', authorRoutes);
app.use('/blogPosts', blogPostRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
