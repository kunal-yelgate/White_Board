import React from 'react';

const ColorPicker = ({ value, onChange }) => (
  <input
    type="color"
    value={value}
    onChange={(event) => onChange(event.target.value)}
  />
);

export default ColorPicker;
