import React from 'react';

const LayerManager = ({ layers, onReorder, onToggleVisibility }) => (
  <div className="layer-manager">
    {layers.map((layer) => (
      <div key={layer.id} className="layer-item">
        <label>
          <input
            type="checkbox"
            checked={layer.visible}
            onChange={() => onToggleVisibility(layer.id)}
          />
          {layer.name}
        </label>
      </div>
    ))}
  </div>
);

export default LayerManager;
