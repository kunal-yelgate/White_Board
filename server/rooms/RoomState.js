class RoomState {
  constructor(roomId) {
    this.roomId = roomId;
    this.participants = new Set();
    this.canvasState = { objects: [], metadata: {} };
  }

  addParticipant(socketId) {
    this.participants.add(socketId);
  }

  removeParticipant(socketId) {
    this.participants.delete(socketId);
  }

  hasParticipant(socketId) {
    return this.participants.has(socketId);
  }

  getState() {
    return {
      roomId: this.roomId,
      canvasState: this.canvasState,
      participants: Array.from(this.participants),
    };
  }

  updateCanvasState(state) {
    this.canvasState = state;
  }
}

module.exports = RoomState;
