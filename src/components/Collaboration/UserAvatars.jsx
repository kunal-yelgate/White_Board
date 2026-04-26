import React from 'react';

const UserAvatars = ({ users }) => (
  <div className="user-avatars">
    {users.map((user) => (
      <div key={user.id} className="user-avatar">
        <span>{user.initials}</span>
        <span>{user.name}</span>
      </div>
    ))}
  </div>
);

export default UserAvatars;
