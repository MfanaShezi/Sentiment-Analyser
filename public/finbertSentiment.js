import fs from 'fs/promises';
import { spawn } from 'child_process';

// Function to call Python for sentiment analysis
function analyzeSentimentWithPython(text) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('C:/Users/Student/AppData/Local/Programs/Python/Python310/python.exe', ['-c', `
import json
from transformers import pipeline

pipe = pipeline("text-classification", model="ProsusAI/finbert")
result = pipe('${text}')
print(json.dumps(result))
`]);

        let output = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                try {
                    resolve(JSON.parse(output));
                } catch (err) {
                    reject(`Error parsing Python output: ${err}`);
                }
            } else {
                reject(`Python script exited with code ${code}: ${error}`);
            }
        });
    });
}

// Main function to read file, analyze sentiment, and update file
async function processArticles() {
    try {
        // Read the articles file
        const filePath = './articles.json';
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const articles = JSON.parse(fileContent);

        // Analyze sentiment for each article
        for (const article of articles) {
            if (!article.sentiment || article.sentiment === '') {
                console.log(`Analyzing sentiment for article: ${article.title}`);
                const sentimentResult = await analyzeSentimentWithPython(article.content);
                article.sentiment = sentimentResult[0].label; // Add sentiment label to the article
            }
        }

        // Save the updated articles back to the file
        await fs.writeFile('./finbert_articles.json', JSON.stringify(articles, null, 4), 'utf-8');
        console.log('Sentiment analysis completed and saved to articles.json.');
    } catch (error) {
        console.error('Error processing articles:', error);
    }
}

// Run the main function
processArticles();
