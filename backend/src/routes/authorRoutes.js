const express = require('express');
const { getAuthors, getAuthorById, uploadAvatar } = require('../controllers/authorController');
const requireAuth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getAuthors);
router.get('/:id', getAuthorById);
router.patch('/:authorId/avatar', requireAuth, upload.single('avatar'), uploadAvatar);

module.exports = router;
