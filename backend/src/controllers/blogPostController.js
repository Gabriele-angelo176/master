const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost');
const cloudinary = require('../config/cloudinary');

function getReadTime(content) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return {
    value: Math.max(1, Math.ceil(words / 200)),
    unit: 'min',
  };
}

async function getAllPosts(req, res) {
  try {
    const posts = await BlogPost.find()
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 });

    return res.json({ posts });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
  }
}

async function getPostById(req, res) {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author', 'name email avatar');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.json({ post });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch post', error: error.message });
  }
}

async function createPost(req, res) {
  try {
    const { title, content, cover, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const post = await BlogPost.create({
      title,
      content,
      cover: cover || '',
      author: req.user._id,
      category: category || 'General',
      readTime: getReadTime(content),
    });

    const populatedPost = await post.populate('author', 'name email avatar');
    return res.status(201).json({ post: populatedPost });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
}

async function updatePost(req, res) {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (String(post.author) !== String(req.user._id)) {
      return res.status(403).json({ message: 'You cannot update someone else\'s post' });
    }

    const { title, content, cover, category } = req.body;

    if (title) post.title = title;
    if (content) {
      post.content = content;
      post.readTime = getReadTime(content);
    }
    if (cover) post.cover = cover;
    if (category) post.category = category;

    await post.save();
    const updatedPost = await post.populate('author', 'name email avatar');

    return res.json({ post: updatedPost });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update post', error: error.message });
  }
}

async function deletePost(req, res) {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (String(post.author) !== String(req.user._id)) {
      return res.status(403).json({ message: 'You cannot delete someone else\'s post' });
    }

    await post.deleteOne();
    return res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete post', error: error.message });
  }
}

async function getComments(req, res) {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.json({ comments: post.comments });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
  }
}

async function getCommentById(req, res) {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    return res.json({ comment });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch comment', error: error.message });
  }
}

async function addComment(req, res) {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const { text, author } = req.body;

    if (!text || !String(text).trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const comment = {
      text: String(text).trim(),
      author: author || req.user?.name || 'Anonimo',
    };

    post.comments.push(comment);
    await post.save();

    return res.status(201).json({ comment: post.comments[post.comments.length - 1] });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to add comment', error: error.message });
  }
}

async function updateComment(req, res) {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const { text, author } = req.body;

    if (text !== undefined) {
      if (!String(text).trim()) {
        return res.status(400).json({ message: 'Comment text cannot be empty' });
      }
      comment.text = String(text).trim();
    }

    if (author !== undefined) comment.author = author;

    await post.save();
    return res.json({ comment });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update comment', error: error.message });
  }
}

async function deleteComment(req, res) {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.deleteOne();
    await post.save();
    return res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete comment', error: error.message });
  }
}

async function uploadCover(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const post = await BlogPost.findById(req.params.blogPostId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'strive-blog/posts' },
        (error, uploadResult) => {
          if (error) return reject(error);
          return resolve(uploadResult);
        },
      );

      stream.end(req.file.buffer);
    });

    post.cover = result.secure_url;
    await post.save();

    return res.json({ message: 'Cover uploaded successfully', cover: post.cover });
  } catch (error) {
    return res.status(500).json({ message: 'Cover upload failed', error: error.message });
  }
}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getComments,
  getCommentById,
  addComment,
  updateComment,
  deleteComment,
  uploadCover,
};
