import React from 'react';
import './Toolbar.css';

const Toolbar = ({ tool, setTool, color, setColor, strokeWidth, setStrokeWidth }) => {
  const tools = [
    { id: 'pen', label: '✏️ Pen' },
    { id: 'brush', label: '🖌️ Brush' },
    { id: 'rect', label: '▢ Rect' },
    { id: 'square', label: '□ Square' },
    { id: 'circle', label: '○ Circle' },
    { id: 'oval', label: '◯ Oval' },
    { id: 'line', label: '━ Line' },
    { id: 'arrow', label: '→ Arrow' },
    { id: 'eraser', label: '🧹 Eraser' },
  ];

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
  ];

  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <h3>Tools</h3>
        <div className="tools-grid">
          {tools.map((t) => (
            <button
              key={t.id}
              className={`tool-button ${tool === t.id ? 'active' : ''}`}
              onClick={() => setTool(t.id)}
              title={t.label}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-section">
        <h3>Color</h3>
        <div className="color-picker">
          <div className="color-grid">
            {colors.map((c) => (
              <button
                key={c}
                className={`color-button ${color === c ? 'active' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                title={c}
              />
            ))}
          </div>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="color-input"
            title="Custom color"
          />
        </div>
      </div>

      <div className="toolbar-section">
        <h3>Stroke Width</h3>
        <div className="stroke-control">
          <input
            type="range"
            min="1"
            max="20"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            className="stroke-slider"
          />
          <span className="stroke-value">{strokeWidth}px</span>
        </div>
        <div className="stroke-preview">
          <svg width="100" height="40">
            <line
              x1="5"
              y1="20"
              x2="95"
              y2="20"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
