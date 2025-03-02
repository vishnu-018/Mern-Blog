// api/routes/upload.js
import express from 'express';
import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';

const router = express.Router();

// Configure multer to temporarily store files in an "uploads" directory
const upload = multer({ dest: 'uploads/' });

// POST route for file uploads
router.post('/', upload.single('file'), async (req, res) => {
  try {
    // Upload the file to Cloudinary; resource_type 'auto' handles both images and videos
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'auto',
    });
    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

export default router;
