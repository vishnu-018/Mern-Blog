
import express from 'express';
import { verifyToken, verifyUserOrAdmin } from '../utils/verifiedUser.js';
import { create, create1, deletepost, getposts, updatepost, updatepost1 } from '../controllers/postcontroller.js';



const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getposts', getposts)
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost)
router.put('/updatepost/:postId/:userId', verifyToken, updatepost)
router.post('/create', verifyUserOrAdmin, create1);
router.put('/updatepost/:postId/:userId', verifyUserOrAdmin, updatepost1);


export default router;