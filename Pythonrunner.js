
import { spawn } from 'child_process';

const python = spawn('python', ['./public/sentiment.py']);


python.stdout.on('data', (data)=>{
  console.log(`stdout:' ${data}`);
})

python.stderr.on('data', (data) => {
  console.error(' Python Error:', data.toString());
});

python.on('close', (code) => {
  console.log(` Python process exited with code ${code}`);
});
