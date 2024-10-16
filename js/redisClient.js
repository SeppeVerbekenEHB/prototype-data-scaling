// redisClient.js
const { createClient } = require('redis');

const redisClient = createClient({
    url: 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

const connectRedis = async () => {
    await redisClient.connect();
};

module.exports = {
    redisClient,
    connectRedis,
};
