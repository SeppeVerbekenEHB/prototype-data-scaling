const express = require('express');
const path = require('path');

const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

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

// Get all plants
app.get('/plants', (req, res) => {
    connection.query('SELECT * FROM plants', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // count the number of plants from the results
        const count = results.length;

        res.json(results);
    });
});

// Post a plant
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

// Route to serve index.html when visiting root '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
