const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379', {
  // Exponential backoff retry strategy
  retryStrategy: (times) => {
    const delay = Math.min(times * 100, 3000);
    console.log(`⏳ Redis retry attempt ${times}, waiting ${delay}ms`);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});

redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('ready',   () => console.log('✅ Redis ready'));
redis.on('error',   (err) => console.error('❌ Redis error:', err.message));

module.exports = redis;
