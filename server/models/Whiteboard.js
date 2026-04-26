const mongoose = require('mongoose');

const WhiteboardSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  canvasState: { type: mongoose.Schema.Types.Mixed, default: {} },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Whiteboard', WhiteboardSchema);
