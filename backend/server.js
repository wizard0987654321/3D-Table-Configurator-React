// backend/server.js
import express from 'express';
import cors from 'cors';
import pkg from 'pg'; 
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Connect to PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test connection immediately
pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ Error connecting to Postgres:', err.stack);
    }
    console.log('✅ Connected to PostgreSQL database.');
    release();
});

// 2. Automatic Table Creation Logic
// This runs every time the server starts. If your colleague doesn't have the tables,
// they will be created automatically before he even clicks "Save".
const createTables = async () => {
    try {
        // Create Users Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password TEXT NOT NULL
            );
        `);

        // Create Configurations Table with all columns
        await pool.query(`
            CREATE TABLE IF NOT EXISTS configurations (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                config_name TEXT,
                top_color VARCHAR(20),
                leg_color VARCHAR(20),
                top_material VARCHAR(50),
                leg_material VARCHAR(50),
                width INTEGER,
                height INTEGER,
                depth INTEGER,
                plate_shape VARCHAR(20),
                thickness_cm INTEGER,
                leg_type VARCHAR(50),
                total_price INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("✅ Database tables are ready.");
    } catch (err) {
        console.error("❌ Error during table creation:", err);
    }
};

// Execute the table creation
createTables();

// 3. API Routes

// Test Route
app.get('/api/test', (req, res) => {
    res.json({ message: "Backend is online!" });
});

// REGISTER Endpoint
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Missing credentials" });

    const sql = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`;
    try {
        const result = await pool.query(sql, [username, password]);
        res.json({ message: "User created", userId: result.rows[0].id });
    } catch (err) {
        if (err.code === '23505') return res.status(400).json({ error: "Username taken" });
        res.status(500).json({ error: err.message });
    }
});

// LOGIN Endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const sql = `SELECT * FROM users WHERE username = $1 AND password = $2`;
    try {
        const result = await pool.query(sql, [username, password]);
        if (result.rows.length > 0) {
            res.json({ message: "Login success", user: { id: result.rows[0].id, username: result.rows[0].username } });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SAVE CONFIGURATION Endpoint
app.post('/api/save-config', async (req, res) => {
    const { 
        userId, configName, topColor, legColor, topMaterial, 
        legMaterial, width, height, depth, plateShape, 
        thicknessCm, legType, totalPrice 
    } = req.body;

    const sql = `
        INSERT INTO configurations (
            user_id, config_name, top_color, leg_color, top_material, 
            leg_material, width, height, depth, plate_shape, 
            thickness_cm, leg_type, total_price
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
        RETURNING id
    `;

    const values = [
        userId, configName, topColor, legColor, topMaterial, 
        legMaterial, width, height, depth, plateShape, 
        thicknessCm, legType, totalPrice
    ];

    try {
        const result = await pool.query(sql, values);
        res.json({ message: "Configuration saved!", id: result.rows[0].id });
    } catch (err) {
        console.error("Save Error:", err);
        res.status(500).json({ error: "Failed to save data" });
    }
});

// 4. Start Server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});