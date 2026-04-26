const handleObjectChange = (socket, payload, roomManager) => {
  const room = roomManager.getRoom(payload.roomId);
  if (!room) return;

  room.updateCanvasState(payload.canvasState);
  socket.to(payload.roomId).emit('objectUpdate', payload);
};

module.exports = { handleObjectChange };
