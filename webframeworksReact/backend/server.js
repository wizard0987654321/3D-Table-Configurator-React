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

// 1. Connect to PostgreSQL (Neon)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
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

        // Create Configurations Table
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
                top_texture VARCHAR(50), 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // --- NEW: Create Discount Codes Table ---
        await pool.query(`
            CREATE TABLE IF NOT EXISTS discount_codes (
                id SERIAL PRIMARY KEY,
                code VARCHAR(50) UNIQUE NOT NULL,
                discount_percent INTEGER NOT NULL
            );
        `);

        // --- NEW: Insert Default Codes (if they don't exist) ---
        const codesToInsert = [
            { code: 'rabatt10', percent: 10 },
            { code: 'rabattCode', percent: 10 },
            { code: 'minus10', percent: 10 }
        ];

        for (const c of codesToInsert) {
            await pool.query(
                `INSERT INTO discount_codes (code, discount_percent) VALUES ($1, $2) ON CONFLICT (code) DO NOTHING`,
                [c.code, c.percent]
            );
        }

        console.log("✅ Database tables and discount codes are ready.");
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
        thicknessCm, legType, totalPrice, topTexture 
    } = req.body;

    const sql = `
    INSERT INTO configurations (
        user_id, config_name, top_color, leg_color, top_material, 
        leg_material, width, height, depth, plate_shape, 
        thickness_cm, leg_type, total_price, top_texture 
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
    RETURNING id
    `;

    const values = [
        userId, configName, topColor, legColor, topMaterial, 
        legMaterial, width, height, depth, plateShape, 
        thicknessCm, legType, totalPrice, topTexture
    ];

    try {
        const result = await pool.query(sql, values);
        res.json({ message: "Configuration saved!", id: result.rows[0].id });
    } catch (err) {
        console.error("Save Error:", err);
        res.status(500).json({ error: "Failed to save data" });
    }
});

// GET USER CONFIGS
app.get('/api/user-configs/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const sql = `
            SELECT * FROM configurations 
            WHERE user_id = $1 
            ORDER BY created_at DESC
        `;
        const result = await pool.query(sql, [userId]);
        res.json(result.rows); 
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE CONFIG
app.delete('/api/delete-config/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM configurations WHERE id = $1', [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Configuration not found" });
        }

        res.json({ message: "Successfully deleted configuration" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ error: "Failed to delete configuration" });
    }
});

// UPDATE CONFIG
app.put('/api/update-config/:id', async (req, res) => {
    const { id } = req.params;
    const { 
        configName, topColor, legColor, topMaterial, legMaterial, 
        width, height, depth, plateShape, thicknessCm, legType, totalPrice, topTexture 
    } = req.body;

    const sql = `
    UPDATE configurations 
    SET config_name = $1, top_color = $2, leg_color = $3, top_material = $4, 
        leg_material = $5, width = $6, height = $7, depth = $8, 
        plate_shape = $9, thickness_cm = $10, leg_type = $11, total_price = $12, top_texture = $13
    WHERE id = $14
    `;

    try {
        await pool.query(sql, [
            configName, topColor, legColor, topMaterial, legMaterial, 
            width, height, depth, plateShape, thicknessCm, legType, totalPrice, topTexture, id
        ]);
        res.json({ message: "Updated successfully" });
    } catch (err) {
        res.status(500).json({ error: "Update failed" });
    }
});

// --- NEW ENDPOINT: VALIDATE DISCOUNT CODE ---
app.post('/api/validate-code', async (req, res) => {
    const { code } = req.body;
    try {
        // Query database for the code
        const result = await pool.query('SELECT * FROM discount_codes WHERE code = $1', [code]);
        
        if (result.rows.length > 0) {
            // Code found, send back the discount percent
            res.json({ valid: true, percent: result.rows[0].discount_percent });
        } else {
            // Code not found
            res.status(404).json({ valid: false, error: "Invalid code" });
        }
    } catch (err) {
        console.error("Validation Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// 4. Start Server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});