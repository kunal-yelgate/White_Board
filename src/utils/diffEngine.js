export const diffCanvasStates = (previousState, nextState) => {
  // TODO: compute delta changes between two canvas states for sync
  return {
    added: nextState.filter((item) => !previousState.some((prev) => prev.id === item.id)),
    removed: previousState.filter((item) => !nextState.some((next) => next.id === item.id)),
    updated: nextState.filter((item) => previousState.some((prev) => prev.id === item.id && JSON.stringify(prev) !== JSON.stringify(item))),
  };
};
