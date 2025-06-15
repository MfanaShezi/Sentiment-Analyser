import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GenerateSentiment } from './public/sentiment.js';
import { nextTick } from 'process';

const PORT = process.env.PORT || 8000;

// Serving static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());


// Generate sentiment
//const sentiment = await GenerateSentiment('AMZN');
//console.log('Generated Sentiment:', sentiment);




app.use(express.static(path.join(__dirname, 'public')));

//Routes

app.get('/api/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
 });

app.get('/api/analyse/:ticker', async (req, res, next) => {
    try{
        const ticker=req.params.ticker.toUpperCase();
        const sentiment=await GenerateSentiment(ticker);
        if(!sentiment) return next('sentiment not found');
        console.log('Generated Sentiment:', sentiment);
        res.json({ticker, sentiment});
    }
    catch(error){
        next(error);
    }
    
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});



app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}/api`);
});
