import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const connectSocket = (userId) => {
    if (socket) {
      socket.disconnect();
    }
    const newSocket = io('http://localhost:4500', {
      pingTimeout: 60000,
    });

    if (userId) {
      newSocket.emit('storeUserInfo', { userId });
    }

    setSocket(newSocket);
    return newSocket;
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  // Re-establish connection if token is already in localstorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // We will let the app parse user details and trigger connectSocket
    }
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
