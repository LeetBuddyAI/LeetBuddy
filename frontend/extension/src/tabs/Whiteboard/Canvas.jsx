import React, { useRef, useState, useEffect } from 'react';

const Canvas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [tool, setTool] = useState('draw');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);

  // Selection box state
  const [selection, setSelection] = useState(null); // { x, y, width, height }
  const [isSelecting, setIsSelecting] = useState(false); // For handling selection
  const [isDragging, setIsDragging] = useState(false); // Flag for dragging mode
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Offset for dragging

  // Handle drawing actions
  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === 'select') {
      if (selection && 
        offsetX >= selection.x && offsetX <= selection.x + selection.width && 
        offsetY >= selection.y && offsetY <= selection.y + selection.height) {
        // If clicking inside the selection box, start dragging
        setIsDragging(true);
        setDragOffset({
          x: offsetX - selection.x,
          y: offsetY - selection.y,
        });
      } else {
        // Start selecting
        setSelection({ x: offsetX, y: offsetY, width: 0, height: 0 });
        setIsSelecting(true);
      }
    } else {
      setDrawing(true);
      setLastPos({ x: offsetX, y: offsetY });
    }
  };

  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    
    if (isSelecting) {
      // Update the size of the selection box
      setSelection((prevSelection) => ({
        ...prevSelection,
        width: offsetX - prevSelection.x,
        height: offsetY - prevSelection.y,
      }));
    } else if (isDragging && selection) {
      // Move the selection box while dragging
      const newX = offsetX - dragOffset.x;
      const newY = offsetY - dragOffset.y;

      setSelection((prevSelection) => ({
        ...prevSelection,
        x: newX,
        y: newY,
      }));
    } else if (drawing) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.strokeStyle = tool === 'draw' ? color : '#FFFFFF';

      if (tool === 'draw') {
        ctx.beginPath();
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
      } else if (tool === 'erase') {
        ctx.clearRect(offsetX - lineWidth / 2, offsetY - lineWidth / 2, lineWidth, lineWidth);
      }

      setLastPos({ x: offsetX, y: offsetY });
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
    setIsSelecting(false);
    setIsDragging(false);
  };

  const handleClear = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear canvas
  };

  // Set the canvas size when the component mounts or the window resizes
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    // Set canvas width and height based on the parent container size
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Render selection box if it exists
  const renderSelectionBox = () => {
    if (!selection) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.setLineDash([6]);
    ctx.strokeRect(selection.x, selection.y, selection.width, selection.height);
  };

  const handleDeleteSelection = () => {
    if (!selection) return;

    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(selection.x, selection.y, selection.width, selection.height);
    setSelection(null); // Remove selection after delete
  };

  return (
    <div className="canvas-container" ref={containerRef}>
      <div>
        <button onClick={() => setTool('draw')}>Draw</button>
        <button onClick={() => setTool('erase')}>Eraser</button>
        <button onClick={() => setTool('select')}>Select</button>
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleDeleteSelection}>Delete Selection</button>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => setLineWidth(e.target.value)}
        />
      </div>
      <canvas
        ref={canvasRef}
        className="whiteboard-canvas show-border"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseUp}
      />
      {renderSelectionBox()}
    </div>
  );
};

export default Canvas;
