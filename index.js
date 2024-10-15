const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root', // your password from docker-compose.yml
    database: 'flora'  // the database you created
});

connection.connect((err) => {
    if (err) {
        console.error('Database connection failed: ', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Middleware to parse JSON bodies
app.use(express.json());

// Example route to add a plant
app.post('/plants', (req, res) => {
    const { name, bloom_time, planting_time, discoverer } = req.body;

    connection.query(
        'INSERT INTO plants (name, bloom_time, planting_time, discoverer) VALUES (?, ?, ?, ?)',
        [name, bloom_time, planting_time, discoverer],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: results.insertId, name, bloom_time, planting_time, discoverer });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
