const http = require('http');
const app = require('./app');
const { initSocket } = require('./socket');

const port = process.env.PORT || 4000;
const server = http.createServer(app);

// Attach Socket.IO to the same HTTP server
initSocket(server);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
