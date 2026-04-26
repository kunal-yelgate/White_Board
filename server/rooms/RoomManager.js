const RoomState = require('./RoomState');

const createRoomManager = () => {
  const rooms = new Map();

  const getRoom = (roomId) => {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new RoomState(roomId));
    }
    return rooms.get(roomId);
  };

  const joinRoom = (socket, roomId) => {
    const room = getRoom(roomId);
    socket.join(roomId);
    room.addParticipant(socket.id);
    socket.emit('roomState', room.getState());
  };

  const leaveRoom = (socket, roomId) => {
    const room = rooms.get(roomId);
    if (!room) return;
    socket.leave(roomId);
    room.removeParticipant(socket.id);
  };

  const disconnect = (socket) => {
    rooms.forEach((room) => {
      if (room.hasParticipant(socket.id)) {
        room.removeParticipant(socket.id);
      }
    });
  };

  return { joinRoom, leaveRoom, disconnect, getRoom };
};

module.exports = { createRoomManager };
