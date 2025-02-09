
import express from 'express';
import { verifyToken } from '../utils/verifiedUser.js';
import { create } from '../controllers/postcontroller.js';

const router = express.Router();

router.post('/create', verifyToken, create)



export default router;