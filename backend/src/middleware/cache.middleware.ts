import { Request, Response, NextFunction } from 'express';
import { cache } from '../config/redis';

export const routeCache = (durationInSeconds: number) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const userId = (req as any).user?._id?.toString() || 'anonymous';
    const key = `__express__${userId}__${req.originalUrl || req.url}`;
    
    try {
      const cachedBody = await cache.get(key);
      if (cachedBody) {
        res.setHeader('Content-Type', 'application/json');
        res.send(cachedBody);
        return;
      } else {
        // Intercept res.json
        const originalJson = res.json.bind(res);
        res.json = (body: any): Response => {
          cache.set(key, JSON.stringify(body), durationInSeconds);
          return originalJson(body);
        };
        next();
      }
    } catch (err) {
      next();
    }
  };
};
