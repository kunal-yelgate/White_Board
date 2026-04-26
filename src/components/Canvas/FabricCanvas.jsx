// FabricCanvas.jsx
useEffect(() => {
  if (!canvas) return;
  
  // Drawing completed
  canvas.on('path:created', (e) => {
    const pathJson = e.path.toJSON();
    socket.emit('draw:end', { roomId, objectData: pathJson });
  });
  
  // Object modified (move, scale, rotate)
  canvas.on('object:modified', (e) => {
    const obj = e.target;
    socket.emit('object:modify', {
      roomId,
      objectId: obj.id,
      transform: {
        left: obj.left,
        top: obj.top,
        scaleX: obj.scaleX,
        scaleY: obj.scaleY,
        angle: obj.angle
      }
    });
  });
  
  // Selection changed
  canvas.on('selection:created', handleSelection);
  canvas.on('selection:updated', handleSelection);
  
}, [canvas]);