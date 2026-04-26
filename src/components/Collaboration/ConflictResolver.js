export const resolveConflict = (localState, remoteState) => {
  // TODO: implement intelligent merge strategy for concurrent edits.
  return { ...localState, ...remoteState };
};
