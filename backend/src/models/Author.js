const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    googleId: { type: String, default: null },
    provider: { type: String, default: 'local' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Author', authorSchema);
