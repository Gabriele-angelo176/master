const express = require('express');
const requireAuth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
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
} = require('../controllers/blogPostController');

const router = express.Router();

router.get('/', getAllPosts);
router.get('/:id/comments', getComments);
router.get('/:id/comments/:commentId', getCommentById);
router.post('/:id', requireAuth, addComment);
router.put('/:id/comment/:commentId', requireAuth, updateComment);
router.delete('/:id/comment/:commentId', requireAuth, deleteComment);
router.get('/:id', getPostById);
router.post('/', requireAuth, createPost);
router.patch('/:id', requireAuth, updatePost);
router.delete('/:id', requireAuth, deletePost);
router.patch('/:blogPostId/cover', requireAuth, upload.single('cover'), uploadCover);

module.exports = router;
