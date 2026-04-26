const handleCursor = (socket, payload, roomManager) => {
  const room = roomManager.getRoom(payload.roomId);
  if (!room) return;

  room.cursorPositions = room.cursorPositions || {};
  room.cursorPositions[socket.id] = payload.cursor;
  socket.to(payload.roomId).emit('cursorUpdate', {
    socketId: socket.id,
    cursor: payload.cursor,
  });
};

module.exports = { handleCursor };
