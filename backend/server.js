// backend/server.js
import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

const app = express();
const port = 3000;

// Middleware (Allows React to talk to us)
app.use(cors());
app.use(express.json());

// 1. Connect to SQLite
// This creates a file 'database.sqlite' automatically if it doesn't exist
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database.');
    }
});

// 2. Create Tables (Run this every time server starts to ensure they exist)
db.serialize(() => {
    // Users Table (For Requirement 1: Login/Register)
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);

    // Configurations Table (For Requirement 6: Save Config)
    db.run(`CREATE TABLE IF NOT EXISTS configurations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        config_name TEXT,
        config_data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);
});

// 3. Test Route
app.get('/api/test', (req, res) => {
    res.json({ message: "Backend is connected and working!" });
});

// 4. Start Server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});