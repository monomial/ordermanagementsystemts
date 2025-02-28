import rateLimit from 'express-rate-limit';
import logger from '../config/logger';

const isTestEnvironment = process.env.NODE_ENV === 'test';

export const rateLimiter = rateLimit({
  windowMs: isTestEnvironment ? 1000 : parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 1 second for tests, 15 minutes for other environments
  max: isTestEnvironment ? 50 : parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10), // 50 requests for tests, 100 for other environments
  message: 'Too many requests from this IP, please try again later',
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP ${req.ip}`);
    res.status(429).json({
      status: 'error',
      message: 'Too many requests from this IP, please try again later',
    });
  },
  skip: (req) => isTestEnvironment && (req.path === '/health' || req.path === '/api/v1/non-existent'), // Skip rate limiting for health check and 404 test in test environment
}); 