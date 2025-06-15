import { spawn } from 'child_process';

const pythonProcess = spawn('C:/Users/Student/AppData/Local/Programs/Python/Python310/python.exe', ['-c', `
import feedparser
from transformers import pipeline


pipe = pipeline("text-classification", model="ProsusAI/finbert")

print(pipe('stocks rallied and the british pound gained'))
`]);

pythonProcess.stdout.on('data', (data) => {
    console.log(`Python Output: ${data}`);
});

pythonProcess.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
});

pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
});

//console.log(`Python script exited with code `)