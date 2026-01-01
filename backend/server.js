// backend/server.js

import express from 'express';

import cors from 'cors';

import pkg from 'pg'; // Import the pg library

const { Pool } = pkg; // Extract Pool from the package

import dotenv from 'dotenv';
dotenv.config();


const app = express();

const port = 3000;


// Middleware

app.use(cors());

app.use(express.json());


// 1. Connect to PostgreSQL

// You must replace these values with your actual Postgres installation details

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

        return console.error('Error acquiring client', err.stack);

    }

    console.log('✅ Connected to PostgreSQL database.');

    release();

});


// 2. Create Tables (Run this every time server starts)

const createTables = async () => {

    try {

        // Users Table

        // CHANGE: 'INTEGER PRIMARY KEY AUTOINCREMENT' -> 'SERIAL PRIMARY KEY'

        await pool.query(`

            CREATE TABLE IF NOT EXISTS users (

                id SERIAL PRIMARY KEY,

                username VARCHAR(255) UNIQUE NOT NULL,

                password TEXT NOT NULL

            );

        `);


        // Configurations Table

        // CHANGE: Postgres handles timestamps slightly differently, but CURRENT_TIMESTAMP is standard

        await pool.query(`

            CREATE TABLE IF NOT EXISTS configurations (

                id SERIAL PRIMARY KEY,

                user_id INTEGER REFERENCES users(id),

                config_name TEXT,

                config_data TEXT,

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

            );

        `);

        console.log("✅ Tables checked/created.");

    } catch (err) {

        console.error("Error creating tables:", err);

    }

};


createTables();


// 3. Test Route

app.get('/api/test', (req, res) => {

    res.json({ message: "Backend is connected to Postgres!" });

});


// 1. REGISTER Endpoint

app.post('/api/register', async (req, res) => {

    const { username, password } = req.body;


    if (!username || !password) {

        return res.status(400).json({ error: "Username and password are required" });

    }


    // CHANGE: Placeholders are $1, $2 instead of ?

    // CHANGE: Added 'RETURNING id' to get the new ID back immediately

    const sql = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`;


    try {

        const result = await pool.query(sql, [username, password]);

        res.json({ message: "User created successfully", userId: result.rows[0].id });

    } catch (err) {

        // CHANGE: Error code '23505' is Postgres for "Unique Violation"

        if (err.code === '23505') {

            return res.status(400).json({ error: "Username already exists." });

        }

        return res.status(500).json({ error: err.message });

    }

});


// 2. LOGIN Endpoint

app.post('/api/login', async (req, res) => {

    const { username, password } = req.body;


    const sql = `SELECT * FROM users WHERE username = $1 AND password = $2`;


    try {

        const result = await pool.query(sql, [username, password]);



        if (result.rows.length > 0) {

            const user = result.rows[0];

            res.json({

                message: "Login successful",

                user: { id: user.id, username: user.username }

            });

        } else {

            res.status(401).json({ error: "Invalid username or password" });

        }

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

});


// 4. Start Server

app.listen(port, () => {

    console.log(`🚀 Server running at http://localhost:${port}`);

}); 