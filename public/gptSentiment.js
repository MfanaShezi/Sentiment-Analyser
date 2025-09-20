import fs from 'fs/promises';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
// Set up OpenAI API configuration
const client = new OpenAI({
  apiKey:process.env.OPENAI_API_KEY,
});

// Load the articles JSON file
let articles = await fs.readFile('./articles.json', 'utf-8');
articles = JSON.parse(articles);


// Function to get sentiment using OpenAI API
async function getSentiment(content) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: 'system', content: 'You are a helpful assistant that analyzes the sentiment of text.' },
        { role: 'user', content: `Analyze the sentiment of the following text: ${content}, return only Positive, Neutral or Negative` },
      ],
    });
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error analyzing sentiment:', error.message);
    return 'Error';
  }
}

// Add sentiment to each article
async function analyzeSentiments() {
  for (let article of articles) {
    if (!article.sentiment || article.sentiment === '') {
      console.log(`Analyzing sentiment for article: ${article.title}`);
      article.sentiment = await getSentiment(article.content);
    }
  }

  // Save the updated articles back to the JSON file
  fs.writeFileSync(filePath, JSON.stringify(articles, null, 4), 'utf-8');
  console.log('Sentiment analysis completed and saved to gpt4_articles.json.');
}

// Run the sentiment analysis
analyzeSentiments();