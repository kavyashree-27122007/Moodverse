import express from 'express';
import {
  getFriends,
  sendFriendRequest,
  respondToRequest,
  getPendingRequests,
} from '../controllers/friendController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/', getFriends);
router.get('/pending', getPendingRequests);
router.post('/request', sendFriendRequest);
router.put('/respond', respondToRequest);

export default router;
