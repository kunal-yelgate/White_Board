const { Server } = require('socket.io');
const { authenticateSocket } = require('../middleware/auth');
const { createRoomManager } = require('../rooms/RoomManager');

let io;
const roomManager = createRoomManager();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('joinRoom', ({ roomId }) => roomManager.joinRoom(socket, roomId));
    socket.on('leaveRoom', ({ roomId }) => roomManager.leaveRoom(socket, roomId));

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      roomManager.disconnect(socket);
    });
  });
};

module.exports = { initSocket, io, roomManager };
