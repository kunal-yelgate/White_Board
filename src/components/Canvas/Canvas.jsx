import React, { useEffect, useRef, useCallback } from 'react';
import { fabric } from 'fabric';
import {
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  exportCanvasAsImage,
  clearCanvas,
} from './CanvasEvents';
import useWhiteboardStore from '../../store/whiteboardStore';
import './Canvas.css';

const Canvas = () => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const {
    socket,
    currentRoomId,
    tool,
    color,
    strokeWidth,
    boards,
    currentBoardId,
    setObjects,
    recordHistory,
  } = useWhiteboardStore();

  // Update refs when values change
  useEffect(() => {
    // No-op, just ensuring dependencies are tracked
  }, [tool, color, strokeWidth]);

  // Save board to state and server
  const saveBoard = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const objects = canvas.getObjects().map((obj) => fabric.util.object.dehydrate(obj));
    setObjects(currentBoardId, objects);
    recordHistory(currentBoardId, objects);

    if (socket && currentRoomId) {
      socket.emit('updateBoard', { roomId: currentRoomId, objects });
    }
  }, [socket, currentRoomId, currentBoardId, setObjects, recordHistory]);

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 1200,
      height: 700,
      backgroundColor: '#ffffff',
      isDrawingMode: false,
    });

    // Configure free drawing brush
    fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
    fabricCanvas.freeDrawingBrush.color = color;
    fabricCanvas.freeDrawingBrush.width = strokeWidth;

    fabricCanvasRef.current = fabricCanvas;

    // Load initial board
    const currentBoard = boards[currentBoardId];
    if (currentBoard && currentBoard.objects.length > 0) {
      currentBoard.objects.forEach((objData) => {
        const obj = fabric.util.object.enliven(objData);
        fabricCanvas.add(obj);
      });
      fabricCanvas.renderAll();
    }

    // Canvas event listeners
    const onMouseDown = (e) => handlePointerDown(e, fabricCanvas, tool, color, strokeWidth);
    const onMouseMove = (e) => handlePointerMove(e, fabricCanvas, tool, color, strokeWidth);
    const onMouseUp = (e) => handlePointerUp(e, fabricCanvas, saveBoard);
    const onPathCreated = () => saveBoard();

    fabricCanvas.on('mouse:down', onMouseDown);
    fabricCanvas.on('mouse:move', onMouseMove);
    fabricCanvas.on('mouse:up', onMouseUp);
    fabricCanvas.on('path:created', onPathCreated);

    return () => {
      fabricCanvas.dispose();
    };
  }, [saveBoard, color, strokeWidth, boards, currentBoardId, tool]);

  // Update drawing mode, color, stroke width
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = tool === 'pen' || tool === 'brush';
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = strokeWidth;
  }, [tool, color, strokeWidth]);

  // Switch board
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.clear();
    canvas.backgroundColor = '#ffffff';

    const currentBoard = boards[currentBoardId];
    if (currentBoard && currentBoard.objects.length > 0) {
      currentBoard.objects.forEach((objData) => {
        const obj = fabric.util.object.enliven(objData);
        canvas.add(obj);
      });
    }

    canvas.renderAll();
  }, [currentBoardId, boards]);

  // Handle remote updates
  useEffect(() => {
    if (!socket) return;

    const handleBoardUpdated = (objects) => {
      setObjects(currentBoardId, objects);
      recordHistory(currentBoardId, objects);
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      canvas.clear();
      canvas.backgroundColor = '#ffffff';
      objects.forEach((objData) => {
        const obj = fabric.util.object.enliven(objData);
        canvas.add(obj);
      });
      canvas.renderAll();
    };

    socket.on('boardUpdated', handleBoardUpdated);
    return () => socket.off('boardUpdated', handleBoardUpdated);
  }, [socket, currentBoardId, setObjects, recordHistory]);

  // Undo
  const handleUndo = () => {
    const store = useWhiteboardStore.getState();
    const step = (store.historyStep[currentBoardId] || 0) - 1;
    const history = store.history[currentBoardId] || [];
    if (step < 0) return;

    const prevObjects = history[step];
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Update store
    setObjects(currentBoardId, prevObjects);
    useWhiteboardStore.setState({
      historyStep: { ...store.historyStep, [currentBoardId]: step },
    });

    // Update canvas
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    prevObjects.forEach((objData) => {
      const obj = fabric.util.object.enliven(objData);
      canvas.add(obj);
    });
    canvas.renderAll();
  };

  // Clear
  const handleClear = () => {
    if (!window.confirm('Are you sure you want to clear this board?')) return;
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    clearCanvas(canvas);
    saveBoard();
  };

  // Export
  const handleExport = () => exportCanvasAsImage(fabricCanvasRef.current);

  return (
    <div className="canvas-container">
      <div className="canvas-toolbar">
        <button onClick={handleUndo} title="Undo">↶ Undo</button>
        <button onClick={handleClear} title="Clear Canvas">🗑️ Clear</button>
        <button onClick={handleExport} title="Export">💾 Export</button>
      </div>
      <canvas ref={canvasRef} className="fabric-canvas" />
    </div>
  );
};

export default Canvas;
