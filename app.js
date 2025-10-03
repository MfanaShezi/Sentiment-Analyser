import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GenerateSentiment } from './public/sentiment.js';
import cors from 'cors';

const PORT = process.env.PORT || 8000;

// Serving static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
// Simple CORS configuration to allow all origins
const corsOptions = {
    origin: true, // Allow all origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions)); // Enable CORS for cross-origin requests
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Sentiment Analysis API is running' });
});

app.get('/api/analyse/:ticker', async (req, res) => {
    try {
        const ticker = req.params.ticker.toUpperCase();
        
        if (!ticker) {
            return res.status(400).json({ 
                error: 'Ticker symbol is required' 
            });
        }

        console.log(`Analyzing sentiment for ticker: ${ticker}`);
        const result = await GenerateSentiment(ticker);

        res.json({
            ticker: ticker,
            Results: result,
            timestamp: new Date().toISOString(),
            status: 'success'
        });

    } catch (error) {
        console.error('Error in sentiment analysis:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message,
            status: 'error'
        });
    }
});

// Batch analysis endpoint
app.post('/api/analyse/batch', async (req, res) => {
    try {
        const { tickers } = req.body;
        
        if (!Array.isArray(tickers) || tickers.length === 0) {
            return res.status(400).json({
                error: 'Tickers array is required'
            });
        }

        const results = [];
        for (const ticker of tickers) {
            try {
                const result = await GenerateSentiment(ticker.toUpperCase());
                results.push({
                    ticker: ticker.toUpperCase(),
                    sentiment: result,
                    status: 'success'
                });
            } catch (error) {
                results.push({
                    ticker: ticker.toUpperCase(),
                    error: error.message,
                    status: 'error'
                });
            }
        }

        res.json({
            results,
            timestamp: new Date().toISOString(),
            total: results.length
        });

    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Sentiment Analysis API running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`API endpoint: http://localhost:${PORT}/api/analyse/{ticker}`);
});
