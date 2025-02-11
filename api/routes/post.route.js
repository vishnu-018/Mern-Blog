
import express from 'express';
import { verifyToken } from '../utils/verifiedUser.js';
import { create, getposts } from '../controllers/postcontroller.js';

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getposts', getposts)


export default router;