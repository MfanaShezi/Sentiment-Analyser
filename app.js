import { pipeline } from '@xenova/transformers';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT= process.env.PORT || 8000;

// Serving static files
const __filename =fileURLToPath(import.meta.url);
const __dirname= path.dirname(__filename);

const app = express();

app.use(express.json());


// Allocating a pipeline for sentiment-analysis
let pipe = await pipeline('sentiment-analysis');
app.post('/' , async(req, res,next) => {
    const result = await pipe(req.body.text);
    res.json(result);
});


app.use(express.static(path.join(__dirname, 'public')));

//route
app.get('/' , async(req, res, next) => {
    res.sendFile('index.html');
});



app.listen(PORT,() =>{
    console.log(` Server listening on http://localhost:${PORT}`);
});

