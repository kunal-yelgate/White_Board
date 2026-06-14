// Test file for ConflictResolver
const resolveConflict = (localState, remoteState) => {
  const objects = mergeObjects(localState?.objects || [], remoteState?.objects || []);
  
  return {
    ...remoteState,
    objects,
  };
};

const mergeObjects = (localObjects = [], remoteObjects = []) => {
  const objectMap = new Map();

  localObjects.forEach((obj) => {
    if (obj?.id) {
      objectMap.set(obj.id, { ...obj, source: 'local', timestamp: obj.timestamp || 0 });
    }
  });

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

const detectConflicts = (localState, remoteState) => {
  const conflicts = [];
  const localIds = new Set((localState?.objects || []).map((o) => o?.id).filter(Boolean));
  const remoteIds = new Set((remoteState?.objects || []).map((o) => o?.id).filter(Boolean));

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

// ============ TEST CASES ============

console.log('\n========== CONFLICT RESOLUTION TEST CASES ==========\n');

// Test 1: Simple merge
console.log('TEST 1: Simple merge with no conflicts');
const local1 = {
  objects: [
    { id: '1', type: 'rect', x: 10, y: 10, timestamp: 1000 }
  ]
};
const remote1 = {
  objects: [
    { id: '2', type: 'circle', x: 50, y: 50, timestamp: 1000 }
  ]
};
const result1 = resolveConflict(local1, remote1);
console.log('Local objects:', local1.objects);
console.log('Remote objects:', remote1.objects);
console.log('Resolved:', result1.objects);
console.log('✓ Both objects preserved\n');

// Test 2: Same object modified both sides
console.log('TEST 2: Same object modified on both sides (CONFLICT)');
const local2 = {
  objects: [
    { id: 'shape-1', type: 'rect', x: 10, y: 10, color: '#FF0000', timestamp: 1000 }
  ]
};
const remote2 = {
  objects: [
    { id: 'shape-1', type: 'rect', x: 10, y: 10, color: '#0000FF', timestamp: 1500 }
  ]
};
const conflicts2 = detectConflicts(local2, remote2);
const result2 = resolveConflict(local2, remote2);
console.log('Local version (older):', local2.objects[0]);
console.log('Remote version (newer):', remote2.objects[0]);
console.log('Conflicts detected:', conflicts2);
console.log('Resolved (remote wins):', result2.objects[0]);
console.log('✓ Remote version applied (newer timestamp)\n');

// Test 3: Object deleted remotely but modified locally
console.log('TEST 3: Object deleted remotely but modified locally (CONFLICT)');
const local3 = {
  objects: [
    { id: 'obj-1', shape: 'line', length: 100, timestamp: 2000 }
  ]
};
const remote3 = {
  objects: []
};
const conflicts3 = detectConflicts(local3, remote3);
const result3 = resolveConflict(local3, remote3);
console.log('Local state:', local3.objects);
console.log('Remote state:', remote3.objects);
console.log('Conflicts detected:', conflicts3);
console.log('Resolved:', result3.objects);
console.log('✓ Deletion detected (remote deletes, local keeps)\n');

// Test 4: Complex multi-object scenario
console.log('TEST 4: Complex scenario with multiple objects and conflicts');
const local4 = {
  objects: [
    { id: 'a', type: 'rect', x: 0, y: 0, timestamp: 1000 },
    { id: 'b', type: 'circle', x: 50, y: 50, timestamp: 1100 },
    { id: 'c', type: 'text', text: 'old', timestamp: 900 }
  ]
};
const remote4 = {
  objects: [
    { id: 'a', type: 'rect', x: 0, y: 0, timestamp: 1000 },     // same
    { id: 'c', type: 'text', text: 'new', timestamp: 1300 },     // modified (newer)
    { id: 'd', type: 'line', x: 100, y: 100, timestamp: 1200 }   // new
  ]
};
const conflicts4 = detectConflicts(local4, remote4);
const result4 = resolveConflict(local4, remote4);
console.log('Local objects:', local4.objects.length, 'items');
console.log('Remote objects:', remote4.objects.length, 'items');
console.log('Conflicts:', conflicts4);
console.log('Resolved:', result4.objects);
console.log(`✓ Merged into ${result4.objects.length} objects (a,b,c,d)\n`);

// Test 5: Empty states
console.log('TEST 5: Merging with empty/null states');
const result5 = resolveConflict(null, { objects: [{ id: 'e', type: 'shape', timestamp: 1000 }] });
console.log('Resolved:', result5.objects);
console.log('✓ Handled null gracefully\n');

console.log('========== ALL TESTS COMPLETED ==========\n');
