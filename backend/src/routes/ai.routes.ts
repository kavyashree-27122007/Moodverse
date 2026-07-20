import { Router } from 'express';
import { getInsights, getRecommendations, getMemory, deleteMemory, exportMemory } from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.js';
import { routeCache } from '../middleware/cache.middleware.js';

const router = Router();

// Protect all AI routes
router.use(protect);

// Get AI Insights - cache for 1 hour (3600 seconds) since historical insights don't change rapidly
router.get('/insights', routeCache(3600), getInsights);

// Get AI Recommendations - cache for 15 minutes
router.get('/recommendations', routeCache(900), getRecommendations);

// Memory Endpoints
router.get('/memory', getMemory);
router.delete('/memory', deleteMemory);
router.get('/memory/export', exportMemory);

export default router;
