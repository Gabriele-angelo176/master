const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const Author = require('../models/Author');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/auth/google/callback',
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.trim().toLowerCase();

        if (!email) {
          return done(new Error('Google profile missing email'), null);
        }

        let author = await Author.findOne({ $or: [{ email }, { googleId: profile.id }] });

        if (!author) {
          const randomPassword = `google-${Date.now()}-${Math.random().toString(36).slice(2)}`;
          const hashedPassword = await bcrypt.hash(randomPassword, 10);

          author = await Author.create({
            name: profile.displayName || 'Google User',
            email,
            password: hashedPassword,
            googleId: profile.id,
            provider: 'google',
            avatar: profile.photos?.[0]?.value || '',
          });
        } else {
          author.googleId = author.googleId || profile.id;
          author.provider = author.provider || 'google';
          author.name = author.name || profile.displayName || 'Google User';
          author.avatar = author.avatar || profile.photos?.[0]?.value || '';
          await author.save();
        }

        return done(null, author);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

module.exports = passport;
