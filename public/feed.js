import Parser from 'rss-parser';
import fs from 'fs/promises';
 function setYahooUrl(ticker){
    let rss_url = `https://finance.yahoo.com/rss/headline?s=${ticker}`;
     return rss_url;
 }


async function fetchFeed(ticker) {
    try {
        const parser = new Parser();
        const feed = await parser.parseURL(setYahooUrl(ticker));
        console.log('Feed fetched successfully');
        return feed;
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        return null;
    }
}

// export async function  provideDataFeed(ticker) {
//     setYahooUrl(ticker);
//     return await fetchFeed(ticker);
// }

export async function provideDataFeed(ticker) {
    setYahooUrl(ticker);
    const feed = await fetchFeed(ticker);
    if (!feed) return null;

    //print(feed);

    //Collect up to 200 articles
    // const articles = feed.items.slice(0, 20).map(item => ({
    //     title: item.title,
    //     link: item.link,
    //     content: item.content || item.contentSnippet,
    //     pubDate: item.pubDate,
    // }));

//read current data and then append new data
//    let  existingArticles = [];
//     try {
//         const existingData = await fs.readFile(`./articles.json`, 'utf-8');
//          existingArticles = JSON.parse(existingData);
//     } catch (error) {
//         console.error('Error reading existing articles:', error);
//     }

//     // Append new articles to existing ones
//     articles.push(...existingArticles);


    // Save articles to a file
    // try {
    //     await fs.writeFile(`./articles.json`, JSON.stringify(articles, null, 2));
    //     console.log(`Saved ${articles.length} articles to articles.json`);
    // } catch (error) {
    //     console.error('Error saving articles to file:', error);
    // }

    return feed;
}