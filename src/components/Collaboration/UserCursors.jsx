import React from 'react';

const UserCursors = ({ cursors }) => (
  <div className="user-cursors">
    {cursors.map((cursor) => (
      <div
        key={cursor.userId}
        className="user-cursor"
        style={{ left: cursor.x, top: cursor.y }}
      >
        <span>{cursor.name}</span>
      </div>
    ))}
  </div>
);

export default UserCursors;
