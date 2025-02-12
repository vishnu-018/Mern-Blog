
import express from 'express';
import { verifyToken } from '../utils/verifiedUser.js';
import { create, deletepost, getposts } from '../controllers/postcontroller.js';

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getposts', getposts)
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost)


export default router;