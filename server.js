const express = require('express');
const cors = require('cors')
const postsRouter = require('./data/posts-router.js')

const server = express();

server.use(express.json());
server.use(cors())
server.use('/api/posts', postsRouter)


// endpoints

server.get('/', (req, res) => {
    res.send(`
      <h2>Express Routing API</h>
      <p>Welcome to the Express Routing API</p>
    `);
  });


module.exports = server;


