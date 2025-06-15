import { pipeline } from '@xenova/transformers';
import { provideDataFeed } from './feed.js';

let Totalscore = 0;
let articl_num = 0;
let sentiment='';

// Allocating a pipeline for sentiment-analysis
let pipe;
try {
    pipe = await pipeline('sentiment-analysis');
    console.log('Sentiment analysis pipeline initialized successfully');
} catch (error) {
    console.error('Error initializing sentiment analysis pipeline:', error);
    process.exit(1);
}

async function analyzeSentiment(ticker) {
    const feed = await provideDataFeed(ticker);
    console.log(feed);
    if (!feed) return ;

    for (let i = 0; i < feed.items.length; i++) {
        let content = feed.items[i].content; 
        try {
            let sentiment = await pipe(content);
            if(sentiment[0].label.toUpperCase()==='POSITIVE'){
                Totalscore+=sentiment[0].score;
                articl_num++;
            }
            else if(sentiment[0].label.toUpperCase()==='NEGATIVE'){
                Totalscore-=sentiment[0].score;
                articl_num++;
            }
            //console.log(sentiment[0].label, sentiment[0].score, feed.items[i].title);
        } catch (error) {
            console.error('Error analyzing sentiment:', error);
        }
    }

        console.log(ticker,'Total Score:', Totalscore);
        console.log(ticker,' Numbers :', articl_num)
        const final_score= Totalscore/articl_num;
        console.log('Final Score:', final_score);
    if(final_score>=0.2){
      return  sentiment= ticker +' Positive sentiment detected';
    }
    else if(final_score<=-0.2){
       return sentiment=ticker +' Negative sentiment detected';
    }
    else{
        return sentiment=ticker +' Neutral sentiment detected';
    }

}



export async function GenerateSentiment(ticker){
    return await analyzeSentiment(ticker);
}