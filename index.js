const fs = require('fs');
const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

const keywords = {
    'cat': ['http://127.0.0.1:80/download'],
    'dog': ['https://images.pexels.com/photos/3104709/pexels-photo-3104709.jpeg', 
            'https://images.pexels.com/photos/3196887/pexels-photo-3196887.jpeg', 
            'https://images.pexels.com/photos/14666143/pexels-photo-14666143.jpeg'],
    'bird': ['https://images.pexels.com/photos/2662434/pexels-photo-2662434.jpeg', 
            'https://images.pexels.com/photos/2115984/pexels-photo-2115984.jpeg', 
            'https://images.pexels.com/photos/3250454/pexels-photo-3250454.jpeg'],    
  // Другие ключевые слова с соответствующими URL
};

const MAX_CONCURRENT_THREADS = process.env.MAX_CONCURRENT_THREADS || 1; 
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080; 
// console.log('process.env - ', process.env);
// fs.readFile('config.txt', 'utf8', function(err, data) {
//   if (!err) {
//     MAX_CONCURRENT_THREADS = Number(data);
//     console.log('MAX_CONCURRENT_THREADS set to', MAX_CONCURRENT_THREADS);
//   } else {
//     console.error('Failed to read config.txt:', err);
//   }
// }); 

const server = new WebSocket.Server({ port: PORT });

server.on('connection', (socket) => {
  console.log('Client connected');
  let threadCount = 0; 

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    const urls = keywords[message];
    console.log('Client connected');
    if (threadCount < MAX_CONCURRENT_THREADS) {
      threadCount++;

      if (urls) {
        socket.send(JSON.stringify(urls));
      } else {
        socket.send(JSON.stringify(new String('empty')));
      }

      console.log('Started stream');
    } else {
      console.log('Maximum concurrent streams reached');
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

const app = express()
app.use(cors())

app.options('*', cors())
app.get('/download', function(req, res){
    const file = `${__dirname}/static/cat.jpg`;
    res.download(file); // Set disposition and send it.
  });

  app.listen(80, function () {
    console.log('CORS-enabled web server listening on port 80')
  })

console.log("Server started on port 8080");