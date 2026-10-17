const express = require('express');
const passport = require('passport');
const requireAuth = require('../middleware/auth');
const { register, login, getMe, googleCallback } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, getMe);
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  }),
);
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/?auth=error`,
  }),
  googleCallback,
);

module.exports = router;
