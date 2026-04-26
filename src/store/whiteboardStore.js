// store/whiteboardStore.js
const useWhiteboardStore = create((set, get) => ({
  // Local state
  tool: 'pen',           // pen | eraser | rect | circle | text | select
  color: '#000000',
  strokeWidth: 5,
  objects: [],           // Fabric objects array
  
  // Collaboration state
  activeUsers: [],
  localUserId: null,
  
  // History for undo/redo
  history: [],
  historyStep: -1,
  
  actions: {
    addObject: (obj) => {
      set((state) => {
        const newHistory = state.history.slice(0, state.historyStep + 1);
        newHistory.push(state.objects);
        return { 
          objects: [...state.objects, obj],
          history: newHistory,
          historyStep: newHistory.length - 1
        };
      });
    },
    undo: () => set((state) => ({
      historyStep: Math.max(-1, state.historyStep - 1),
      objects: state.history[state.historyStep] || []
    })),
    // ... more actions
  }
}));