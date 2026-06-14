// sample for test
const express = require('express');
const http = require('http');
const { initSocket } = require('./config/socket');

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

initSocket(server);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});