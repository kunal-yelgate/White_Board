import React from 'react';

const ToolSelector = ({ tools, activeTool, onSelect }) => (
  <div className="tool-selector">
    {tools.map((tool) => (
      <button
        key={tool.id}
        type="button"
        className={tool.id === activeTool ? 'active' : ''}
        onClick={() => onSelect(tool.id)}
      >
        {tool.label}
      </button>
    ))}
  </div>
);

export default ToolSelector;
