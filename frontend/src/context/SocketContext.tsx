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

export interface AppNotification {
  id: string;
  type: 'insight' | 'achievement' | 'friend_mood' | 'system' | 'message';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface SocketContextType {
  socket: Socket | null;
  friendStatuses: Record<string, FriendStatus>;
  chatMessages: ChatMessage[];
  notifications: AppNotification[];
  broadcastMood: (emotion: string, intensity: number) => void;
  sendChatMessage: (to: string, message: string) => void;
  markNotificationAsRead: (id: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [friendStatuses, setFriendStatuses] = useState<Record<string, FriendStatus>>({});
  
  // Persistent chat messages from localStorage so chat memory is retained forever!
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('mv_chat_messages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'welcome',
      type: 'system',
      title: 'Welcome to MoodVerse 2.0',
      message: 'Start logging your moods and connect with friends!',
      timestamp: new Date().toISOString(),
      read: false
    }
  ]);

  // Sync chat messages to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem('mv_chat_messages', JSON.stringify(chatMessages));
    } catch {
      // ignore quota storage issues
    }
  }, [chatMessages]);

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
      setNotifications((prev) => [{
        id: Date.now().toString(),
        type: 'friend_mood',
        title: 'Friend Update',
        message: `A friend just updated their mood to ${data.emotion}`,
        timestamp: new Date().toISOString(),
        read: false
      }, ...prev]);
    });

    // Receive a chat message
    socket.on('chat:message', (msg: ChatMessage) => {
      setChatMessages((prev) => [...prev, msg]);
      setNotifications((prev) => [{
        id: Date.now().toString(),
        type: 'message',
        title: 'New Message',
        message: `You received a new message`,
        timestamp: new Date().toISOString(),
        read: false
      }, ...prev]);
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
    const senderId = user?._id || 'me';
    const msg: ChatMessage = {
      to,
      from: senderId,
      message,
      timestamp: new Date().toISOString(),
    };
    if (socketRef.current) {
      socketRef.current.emit('chat:message', msg);
    }
    setChatMessages((prev) => [...prev, msg]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        friendStatuses,
        chatMessages,
        notifications,
        broadcastMood,
        sendChatMessage,
        markNotificationAsRead
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
