import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface FriendStatus {
  userId: string;
  emotion?: string;
  intensity?: number;
  online: boolean;
}

interface ChatMessage {
  to: string;
  from: string;
  message: string;
  timestamp: string;
}

interface SocketContextType {
  socket: Socket | null;
  friendStatuses: Record<string, FriendStatus>;
  chatMessages: ChatMessage[];
  broadcastMood: (emotion: string, intensity: number) => void;
  sendChatMessage: (to: string, message: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [friendStatuses, setFriendStatuses] = useState<Record<string, FriendStatus>>({});
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!user) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket'],
    });
    socketRef.current = socket;

    // Identify self to server
    socket.emit('user:online', user._id);

    // Friend comes online
    socket.on('friend:online', ({ userId }: { userId: string }) => {
      setFriendStatuses((prev) => ({
        ...prev,
        [userId]: { ...prev[userId], userId, online: true },
      }));
    });

    // Friend goes offline
    socket.on('friend:offline', ({ userId }: { userId: string }) => {
      setFriendStatuses((prev) => ({
        ...prev,
        [userId]: { ...prev[userId], userId, online: false },
      }));
    });

    // Friend updates their mood
    socket.on('friend:mood_updated', (data: { userId: string; emotion: string; intensity: number }) => {
      setFriendStatuses((prev) => ({
        ...prev,
        [data.userId]: { ...prev[data.userId], userId: data.userId, emotion: data.emotion, intensity: data.intensity, online: true },
      }));
    });

    // Receive a chat message
    socket.on('chat:message', (msg: ChatMessage) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  const broadcastMood = (emotion: string, intensity: number) => {
    if (socketRef.current && user) {
      socketRef.current.emit('mood:update', { userId: user._id, emotion, intensity });
    }
  };

  const sendChatMessage = (to: string, message: string) => {
    if (socketRef.current && user) {
      const msg: ChatMessage = {
        to,
        from: user._id,
        message,
        timestamp: new Date().toISOString(),
      };
      socketRef.current.emit('chat:message', msg);
      setChatMessages((prev) => [...prev, msg]);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        friendStatuses,
        chatMessages,
        broadcastMood,
        sendChatMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within SocketProvider');
  return ctx;
};
