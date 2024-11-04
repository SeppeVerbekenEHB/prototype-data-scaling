const express = require('express');
const path = require('path');

const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'flora'
});

connection.connect((err) => {
    if (err) {
        console.error('Database connection failed: ', err.stack);
        return;
    }
    console.log('Connected to database.');
});

app.use(express.json());

// Get all plants
app.get('/plants', (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    // Query to get paginated plants
    connection.query(
        'SELECT * FROM plants LIMIT ? OFFSET ?',
        [limit, offset],
        (err, results) => {
            if (err) {
                console.error('Error fetching plants:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            // Query to get the total count of plants
            connection.query(
                'SELECT COUNT(*) AS count FROM plants',
                (err, countResults) => {
                    if (err) {
                        console.error('Error counting plants:', err);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }

                    res.json({
                        plants: results,
                        total: countResults[0].count
                    });
                }
            );
        }
    );
});


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
