// server/handlers/drawHandler.js
module.exports = (io, socket, roomManager) => {
  
  // User starts drawing
  socket.on('draw:start', ({ roomId, point, tool, style }) => {
    socket.to(roomId).emit('user:draw:start', {
      userId: socket.userId,
      point,
      tool,
      style
    });
  });
  
  // Drawing in progress (throttled on client)
  socket.on('draw:move', ({ roomId, points }) => {
    socket.to(roomId).emit('user:draw:move', {
      userId: socket.userId,
      points
    });
  });
  
  // Drawing complete → broadcast final object
  socket.on('draw:end', ({ roomId, objectData }) => {
    // 1. Persist to database
    roomManager.addObject(roomId, objectData);
    
    // 2. Broadcast to others (exclude sender)
    socket.to(roomId).emit('object:created', {
      objectId: generateId(),
      objectData,
      userId: socket.userId,
      timestamp: Date.now()
    });
  });
  
  // Object modification (move, resize, rotate)
  socket.on('object:modify', ({ roomId, objectId, transform }) => {
    roomManager.updateObject(roomId, objectId, transform);
    socket.to(roomId).emit('object:modified', { objectId, transform });
  });
  
  // Object deletion
  socket.on('object:delete', ({ roomId, objectIds }) => {
    roomManager.deleteObjects(roomId, objectIds);
    socket.to(roomId).emit('objects:deleted', { objectIds });
  });
};