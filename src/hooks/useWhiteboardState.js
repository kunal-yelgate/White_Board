import create from 'zustand';

const useWhiteboardState = create((set) => ({
  objects: [],
  users: [],
  activeTool: 'pen',
  color: '#000000',
  strokeWidth: 2,
  setObjects: (objects) => set({ objects }),
  setUsers: (users) => set({ users }),
  setActiveTool: (activeTool) => set({ activeTool }),
  setColor: (color) => set({ color }),
  setStrokeWidth: (strokeWidth) => set({ strokeWidth }),
}));

export default useWhiteboardState;
