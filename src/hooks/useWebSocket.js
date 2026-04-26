import { useEffect, useRef, useState } from 'react';

const useWebSocket = (url) => {
  const [status, setStatus] = useState('closed');
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => setStatus('open');
    socket.onclose = () => setStatus('closed');
    socket.onerror = () => setStatus('error');

    return () => {
      socket.close();
    };
  }, [url]);

  return { socket: socketRef.current, status };
};

export default useWebSocket;
