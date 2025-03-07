
import express from 'express';
import { verifyToken, verifyUserOrAdmin } from '../utils/verifiedUser.js';
import { approvePost, create,  deletepost, denyPost, getposts, updatepost } from '../controllers/postcontroller.js';



const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getposts', getposts)
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost)
router.put('/updatepost/:postId/:userId', verifyToken, updatepost)
router.put('/approvePost/:postId', approvePost);
router.put('/denyPost/:postId', denyPost);



export default router;