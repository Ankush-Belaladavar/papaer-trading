const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { execFile } = require('child_process'); // Import child_process
require('dotenv').config();

const db = require('./config/db');
const tradeRoutes = require('./routes/tradeRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const authRoutes = require('./routes/authRoutes');
const updateRoutes = require('./routes/updateRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(bodyParser.json());

// API routes
app.use('/api/trades', tradeRoutes);
app.use('/api/quote', quoteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/update', updateRoutes);
app.use('/api/watchlist', watchlistRoutes);

// Route to call Python script and fetch stock market news
app.get('/api/news', (req, res) => {
    execFile('python', ['./python/news_scraper.py'], (error, stdout, stderr) => {
        if (error) {
            console.error("Error executing Python script:", error);
            return res.status(500).json({ error: "Failed to fetch news" });
        }
        try {
            const newsData = JSON.parse(stdout);
            res.json(newsData);
        } catch (parseError) {
            console.error("Error parsing Python script output:", parseError);
            res.status(500).json({ error: "Invalid news data format" });
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
