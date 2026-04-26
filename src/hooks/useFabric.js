// hooks/useFabric.js — Core Pattern
const useFabric = (canvasRef) => {
  const [canvas, setCanvas] = useState(null);
  
  useEffect(() => {
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#ffffff',
      isDrawingMode: true, // Freehand drawing
    });
    
    // Configure drawing brush
    fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
    fabricCanvas.freeDrawingBrush.width = 5;
    fabricCanvas.freeDrawingBrush.color = '#000000';
    
    setCanvas(fabricCanvas);
    
    return () => fabricCanvas.dispose();
  }, []);
  
  return canvas;
};