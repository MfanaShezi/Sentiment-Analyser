import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

console.log('Environment Variables:' + process.env.OPENAI_API_KEY);