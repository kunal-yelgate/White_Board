const handleHistory = (socket, payload, roomManager) => {
  const room = roomManager.getRoom(payload.roomId);
  if (!room) return;

  // TODO: implement undo/redo stack synchronization for the room.
  socket.to(payload.roomId).emit('historyUpdate', payload);
};

module.exports = { handleHistory };
