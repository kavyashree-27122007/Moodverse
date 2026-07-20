import express from 'express';
import { logMood, getMoodHistory, getMoodStats } from '../controllers/moodController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.post('/', logMood);
router.get('/', getMoodHistory);
router.get('/stats', getMoodStats);

export default router;
