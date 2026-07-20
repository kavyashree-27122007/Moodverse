import { Queue, Worker } from 'bullmq';
import { cache } from '../config/redis';

// Use the redis connection from our cache if available, otherwise mock it.
const redisConnection = cache.getRedisClient() || undefined;

// Create Queue (gracefully fail or skip if no Redis)
export const analyticsQueue = redisConnection 
  ? new Queue('AnalyticsQueue', { connection: redisConnection })
  : null;

// Create Worker
if (redisConnection) {
  const analyticsWorker = new Worker('AnalyticsQueue', async (job) => {
    console.log(`[BullMQ] Processing job ${job.id} for user ${job.data.userId}`);
    // Simulate heavy AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(`[BullMQ] Job ${job.id} completed.`);
  }, { connection: redisConnection });

  analyticsWorker.on('completed', (job) => {
    console.log(`[BullMQ] Analytics completed for ${job.data.userId}`);
  });

  analyticsWorker.on('failed', (job, err) => {
    console.error(`[BullMQ] Job ${job?.id} failed:`, err);
  });
} else {
  console.log('[BullMQ] Redis not available, skipping worker initialization.');
}

export const scheduleAnalyticsJob = async (userId: string) => {
  if (analyticsQueue) {
    await analyticsQueue.add('analyzeUserMood', { userId }, { delay: 5000 });
  } else {
    console.log(`[BullMQ] Mock Job: Analytics scheduled for ${userId} (No Redis)`);
    // Mock processing delay
    setTimeout(() => {
      console.log(`[BullMQ] Mock Job: Analytics completed for ${userId}`);
    }, 2000);
  }
};
