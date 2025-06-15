import Parser from 'rss-parser';
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

export async function  provideDataFeed(ticker) {
    setYahooUrl(ticker);
    return await fetchFeed(ticker);
}