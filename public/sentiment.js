import { pipeline } from '@xenova/transformers';
import { provideDataFeed } from './feed.js';

// Initialize the sentiment analysis pipeline once
let sentimentPipeline;

// Initialize pipeline
async function initializePipeline() {
    try {
        sentimentPipeline = await pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
        console.log('Sentiment analysis pipeline initialized successfully');
    } catch (error) {
        console.error('Error initializing sentiment analysis pipeline:', error);
        throw error;
    }
}

async function analyzeSentiment(ticker) {
    // Initialize pipeline if not already done
    if (!sentimentPipeline) {
        await initializePipeline();
    }

    // Initialize variables for this analysis session
    let Totalscore = 0;
    let articl_num = 0;
    
    const feed = await provideDataFeed(ticker);
    console.log('Feed data received for:', ticker); 
    
    // Check if feed exists and has items
    if (!feed || !feed.items || !Array.isArray(feed.items)) {
        console.error('No valid feed data returned for ticker:', ticker);
        return {
            sentiment: 'No data available',
            score: 0,
            confidence: 0,
            articlesProcessed: 0,
            totalArticles: 0
        };
    }

    // Check if items array is empty
    if (feed.items.length === 0) {
        console.log('No articles found for ticker:', ticker);
        return {
            sentiment: 'No articles found',
            score: 0,
            confidence: 0,
            articlesProcessed: 0,
            totalArticles: 0
        };
    }

    console.log(`Processing ${feed.items.length} articles for ${ticker}`);

    // Process each article
    for (let i = 0; i < feed.items.length; i++) {
        let content = feed.items[i].content || feed.items[i].contentSnippet;
        
        // Skip if no content
        if (!content || content.trim() === '') {
            console.warn(`No content found for article ${i} of ticker ${ticker}`);
            continue;
        }

        // Truncate content if too long (transformers have input limits)
        if (content.length > 512) {
            content = content.substring(0, 512);
        }

        try {
            // Use the initialized pipeline to analyze sentiment
            const result = await sentimentPipeline(content);
            const label = result[0].label.toUpperCase();
            const score = result[0].score;
            
            if (label === 'POSITIVE') {
                Totalscore += score;
                articl_num++;
            }
            else if (label === 'NEGATIVE') {
                Totalscore -= score;
                articl_num++;
            }
            
            console.log(`Article ${i}: ${label} (${score.toFixed(3)}) - ${feed.items[i].title}`);
        } catch (error) {
            console.error(`Error analyzing sentiment for article ${i}:`, error);
        }
    }

    console.log(`${ticker} - Total Score: ${Totalscore.toFixed(3)}`);
    console.log(`${ticker} - Articles processed: ${articl_num}`);
    
    // Calculate final score
    let final_score = articl_num > 0 ? Totalscore / articl_num : 0;
    console.log(`${ticker} - Final average score: ${final_score.toFixed(3)}`);
    
    // Determine sentiment category and return structured data
    let sentimentLabel;
    if (final_score >= 0.2) {
        sentimentLabel = 'Positive';
    }
    else if (final_score <= -0.2) {
        sentimentLabel = 'Negative';
    }
    else {
        sentimentLabel = 'Neutral';
    }
    
    return {
        sentiment: sentimentLabel,
        score: Math.abs(final_score),
        rawScore: final_score,
        confidence: Math.abs(final_score),
        articlesProcessed: articl_num,
        totalArticles: feed.items.length
    };
}

export async function GenerateSentiment(ticker) {
    return await analyzeSentiment(ticker);
}