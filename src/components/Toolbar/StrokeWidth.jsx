import React from 'react';

const StrokeWidth = ({ value, onChange }) => (
  <input
    type="range"
    min="1"
    max="50"
    value={value}
    onChange={(event) => onChange(Number(event.target.value))}
  />
);

export default StrokeWidth;
