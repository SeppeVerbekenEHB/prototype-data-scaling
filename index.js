const express = require('express');
const { redisClient, connectRedis } = require('./js/redisClient'); // Adjust path as needed

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Redis
connectRedis();

// Example route that uses Redis caching
app.get('/plants', async (req, res) => {
    const cacheKey = 'plantsCache';
    
    // Check Redis for cached results
    const cacheResults = await redisClient.get(cacheKey);
    if (cacheResults) {
        return res.json(JSON.parse(cacheResults)); // Return cached data
    }

    // Fetch from the database if not found in cache
    const plants = await fetchFromDatabase(); // Define your database fetching logic
    await redisClient.set(cacheKey, JSON.stringify(plants), { EX: 3600 }); // Cache the data for 1 hour
    res.json(plants);
});

// Start your server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Dummy database fetching function (replace with your actual DB logic)
const fetchFromDatabase = async () => {
    // Example data (replace with your actual database query)
    return [
        { id: 1, name: 'Rose', bloom_time: 'Spring' },
        { id: 2, name: 'Tulip', bloom_time: 'Spring' },
    ];
};
