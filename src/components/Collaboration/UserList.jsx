import React from 'react';

const UserList = ({ users = [], currentUserId }) => {
  return (
    <div className="user-list">
      <h3>Active Users ({users.length})</h3>
      <div className="user-items">
        {users.map((user) => (
          <div
            key={user.id}
            className={`user-item ${user.id === currentUserId ? 'current-user' : ''}`}
          >
            <div
              className="user-avatar"
              style={{ backgroundColor: user.color || '#667eea' }}
            >
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <div className="user-name">
                {user.name || 'Anonymous'}
                {user.id === currentUserId && ' (You)'}
              </div>
            </div>
            {user.id === currentUserId && <div className="you-badge">You</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
