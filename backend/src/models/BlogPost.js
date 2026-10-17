const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    author: { type: String, default: 'Anonimo' },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true, timestamps: true },
);

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    cover: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
    category: { type: String, default: 'General' },
    readTime: {
      value: { type: Number, default: 1 },
      unit: { type: String, default: 'min' },
    },
    comments: [commentSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model('BlogPost', blogPostSchema);
