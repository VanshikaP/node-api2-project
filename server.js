const express = require('express');
const postsRouter = require('./data/posts-router.js')

const server = express();

server.use(express.json());
server.use('/api/posts', postsRouter)


// endpoints

server.get('/', (req, res) => {
    res.send(`
      <h2>Express Routing API</h>
      <p>Welcome to the Express Routing API</p>
    `);
  });


module.exports = server;


