import React, { useState } from 'react';
import useWhiteboardStore from '../store/whiteboardStore';
import './Lobby.css';

function Lobby() {
  const [username, setUsername] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { socket, setCurrentUser, setCurrentRoomId, setActiveUsers, setIsInRoom, setObjects, currentBoardId } = useWhiteboardStore();

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!socket) {
      setError('Connecting to server...');
      return;
    }

    setLoading(true);
    setError('');

    socket.emit('createRoom', { name: username.trim() }, (response) => {
      setLoading(false);
      if (response.success) {
        setCurrentUser(response.userData);
        setCurrentRoomId(response.roomId);
        setActiveUsers(response.users);
        if (response.boardData) {
          setObjects(currentBoardId, response.boardData);
        }
        setIsInRoom(true);
      } else {
        setError(response.error || 'Failed to create room');
      }
    });
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!joinCode.trim()) {
      setError('Please enter room code');
      return;
    }
    if (!socket) {
      setError('Connecting to server...');
      return;
    }

    setLoading(true);
    setError('');

    socket.emit('joinRoom', { roomId: joinCode.trim(), name: username.trim() }, (response) => {
      setLoading(false);
      if (response.success) {
        setCurrentUser(response.userData);
        setCurrentRoomId(response.roomId);
        setActiveUsers(response.users);
        if (response.boardData) {
          setObjects(currentBoardId, response.boardData);
        }
        setIsInRoom(true);
      } else {
        setError(response.error || 'Failed to join room');
      }
    });
  };

  return (
    <div className="lobby">
      <div className="lobby-card">
        <h1>🎨 White Board</h1>
        <p>Create or join a room to start collaborating!</p>
        {error && <p className="error">{error}</p>}
        
        <form onSubmit={handleCreateRoom} className="form-group">
          <input
            type="text"
            placeholder="Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
          />
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Room'}
          </button>
        </form>
        
        <div className="divider">OR</div>
        
        <form onSubmit={handleJoinRoom} className="form-group">
          <input
            type="text"
            placeholder="Room Code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            maxLength={6}
            disabled={loading}
            required
          />
          <button type="submit" className="secondary-btn" disabled={loading}>
            {loading ? 'Joining...' : 'Join Room'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Lobby;
