/**
 * Resolves conflicts between local and remote whiteboard states using OT-like strategy
 * Priority: Remote > Local (server state is authoritative)
 * Preserves all unique additions, handles conflicts by timestamp
 */
export const resolveConflict = (localState, remoteState) => {
  const objects = mergeObjects(localState?.objects || [], remoteState?.objects || []);
  
  return {
    ...remoteState,
    objects,
  };
};

/**
 * Merge objects from local and remote states
 * Strategy: Keep all unique objects by ID, resolve conflicts by timestamp
 */
const mergeObjects = (localObjects = [], remoteObjects = []) => {
  const objectMap = new Map();

  // Add all local objects
  localObjects.forEach((obj) => {
    if (obj?.id) {
      objectMap.set(obj.id, { ...obj, source: 'local', timestamp: obj.timestamp || 0 });
    }
  });

  // Merge remote objects (remote wins on conflicts)
  remoteObjects.forEach((obj) => {
    if (obj?.id) {
      const existing = objectMap.get(obj.id);
      if (!existing || (obj.timestamp && obj.timestamp > (existing.timestamp || 0))) {
        objectMap.set(obj.id, { ...obj, source: 'remote', timestamp: obj.timestamp || Date.now() });
      }
    }
  });

  return Array.from(objectMap.values());
};

/**
 * Detect and log conflicts
 */
export const detectConflicts = (localState, remoteState) => {
  const conflicts = [];
  const localIds = new Set((localState?.objects || []).map((o) => o?.id).filter(Boolean));
  const remoteIds = new Set((remoteState?.objects || []).map((o) => o?.id).filter(Boolean));

  // Objects modified in both
  localIds.forEach((id) => {
    if (remoteIds.has(id)) {
      const localObj = localState.objects.find((o) => o.id === id);
      const remoteObj = remoteState.objects.find((o) => o.id === id);
      if (JSON.stringify(localObj) !== JSON.stringify(remoteObj)) {
        conflicts.push({
          type: 'MODIFIED_BOTH',
          id,
          local: localObj,
          remote: remoteObj,
        });
      }
    }
  });

  // Objects deleted in one, modified in other
  localIds.forEach((id) => {
    if (!remoteIds.has(id)) {
      conflicts.push({
        type: 'DELETED_REMOTE',
        id,
        local: localState.objects.find((o) => o.id === id),
      });
    }
  });

  remoteIds.forEach((id) => {
    if (!localIds.has(id)) {
      conflicts.push({
        type: 'DELETED_LOCAL',
        id,
        remote: remoteState.objects.find((o) => o.id === id),
      });
    }
  });

  return conflicts;
};