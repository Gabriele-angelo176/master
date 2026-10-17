const cloudinary = require('../config/cloudinary');
const Author = require('../models/Author');

async function getAuthors(req, res) {
  try {
    const authors = await Author.find().select('-password').sort({ createdAt: -1 });
    return res.json({ authors });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch authors', error: error.message });
  }
}

async function getAuthorById(req, res) {
  try {
    const author = await Author.findById(req.params.id).select('-password');

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    return res.json({ author });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch author', error: error.message });
  }
}

async function uploadAvatar(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const authorId = req.params.authorId;
    const author = await Author.findById(authorId);

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'strive-blog/authors' },
        (error, uploadResult) => {
          if (error) return reject(error);
          return resolve(uploadResult);
        },
      );

      stream.end(req.file.buffer);
    });

    author.avatar = result.secure_url;
    await author.save();

    return res.json({
      message: 'Avatar uploaded successfully',
      avatar: author.avatar,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Avatar upload failed', error: error.message });
  }
}

module.exports = { getAuthors, getAuthorById, uploadAvatar };
