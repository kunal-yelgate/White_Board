export const serializeCanvas = (canvas) => {
  return canvas.toJSON();
};

export const deserializeCanvas = (canvas, json) => {
  canvas.loadFromJSON(json, canvas.renderAll.bind(canvas));
};
