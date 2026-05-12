const { Server } = require('socket.io');

let io;

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  io.on('connection', (socket) => {
    // Driver joins their bus room
    socket.on('driver:join', (busId) => {
      socket.join(`bus:${busId}`);
    });

    // Student joins a bus room to watch it
    socket.on('student:watch', (busId) => {
      socket.join(`bus:${busId}`);
    });

    socket.on('disconnect', () => {});
  });

  return io;
}

function getIO() {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}

module.exports = { initSocket, getIO };
