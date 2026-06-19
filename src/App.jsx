import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import Lobby from './components/Lobby';
import Header from './components/UI/Header';
import Sidebar from './components/UI/Sidebar';
import Toolbar from './components/Toolbar/Toolbar';
import Canvas from './components/Canvas/Canvas';
import UserList from './components/Collaboration/UserList';
import BoardSelector from './components/BoardSelector';
import useWhiteboardStore from './store/whiteboardStore';
import './index.css';

function App() {
  const {
    socket,
    setSocket,
    currentUser,
    currentRoomId,
    activeUsers,
    setActiveUsers,
    isInRoom,
    setIsInRoom,
    setCurrentUser,
    setCurrentRoomId,
    tool,
    color,
    strokeWidth,
    setTool,
    setColor,
    setStrokeWidth,
    currentBoardId,
    setObjects,
    recordHistory
  } = useWhiteboardStore();

  useEffect(() => {
    // Initialize socket
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [setSocket]);

  // Listen for user events
  useEffect(() => {
    if (!socket) return;

    const handleUserJoined = (user) => {
      const store = useWhiteboardStore.getState();
      setActiveUsers([...store.activeUsers, user]);
    };

    const handleUserLeft = (userId) => {
      const store = useWhiteboardStore.getState();
      setActiveUsers(store.activeUsers.filter(u => u.id !== userId));
    };

    const handleSessionEnded = () => {
      alert('This session has been ended by the host');
      setIsInRoom(false);
      setCurrentUser(null);
      setCurrentRoomId(null);
      setActiveUsers([]);
    };

    const handleBoardUpdated = (objects) => {
      setObjects(currentBoardId, objects);
      recordHistory(currentBoardId, objects);
    };

    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);
    socket.on('sessionEnded', handleSessionEnded);
    socket.on('boardUpdated', handleBoardUpdated);
    
    return () => {
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
      socket.off('sessionEnded', handleSessionEnded);
      socket.off('boardUpdated', handleBoardUpdated);
    };
  }, [socket, setActiveUsers, setIsInRoom, setCurrentUser, setCurrentRoomId, currentBoardId, setObjects, recordHistory]);

  const handleEndSession = () => {
    if (window.confirm('Are you sure you want to end this session? All data will be deleted.')) {
      if (socket && currentRoomId) {
        socket.emit('endSession', { roomId: currentRoomId }, () => {
          setIsInRoom(false);
          setCurrentUser(null);
          setCurrentRoomId(null);
          setActiveUsers([]);
        });
      }
    }
  };

  if (!isInRoom) {
    return <Lobby />;
  }

  return (
    <div className="app">
      <Header title={`White Board - ${currentRoomId}`}>
        <button className="end-session-btn" onClick={handleEndSession}>
          🚪 End Session
        </button>
      </Header>
      <div className="main-content">
        <Sidebar>
          <UserList users={activeUsers} currentUserId={currentUser?.id} />
          <BoardSelector />
        </Sidebar>
        <div className="app-main">
          <Toolbar
            tool={tool}
            setTool={setTool}
            color={color}
            setColor={setColor}
            strokeWidth={strokeWidth}
            setStrokeWidth={setStrokeWidth}
          />
          <div className="canvas-wrapper">
            <Canvas />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
