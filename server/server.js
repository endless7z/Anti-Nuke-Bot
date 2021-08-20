const { port } = require('../config.json');

if (!port) return;

const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200); res.write('OK'); res.end();
});

server.listen(port, () => console.log('Server Listening on Port ' + port));
