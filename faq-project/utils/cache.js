import redis from 'redis';

const client = redis.createClient({ url: process.env.REDIS_URL });

client.on('error', (err) => console.log('Redis Client Error', err));
client.connect();

export const cache = async (key, data) => {
  await client.setEx(key, 3600, JSON.stringify(data)); // Cache for 1 hour
};

export const getFromCache = async (key) => {
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
};