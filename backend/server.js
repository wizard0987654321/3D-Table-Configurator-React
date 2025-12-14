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

// 1. REGISTER Endpoint

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    // Insert user into database (Plain text password for now)
    const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
    
    db.run(sql, [username, password], function(err) {
        if (err) {
            // Error code 19 is "Constraint Violation" (Duplicate username)
            if (err.errno === 19) { 
                return res.status(400).json({ error: "Username already exists." });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "User created successfully", userId: this.lastID });
    });
});

// 2. LOGIN Endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
    
    db.get(sql, [username, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            // User found!
            res.json({ 
                message: "Login successful", 
                user: { id: row.id, username: row.username } 
            });
        } else {
            // No user found with that combo
            res.status(401).json({ error: "Invalid username or password" });
        }
    });
});

// 4. Start Server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});