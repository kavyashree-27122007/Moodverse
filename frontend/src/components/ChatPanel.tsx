import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, X, MessageCircle } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

interface ChatPanelProps {
  friendId: string;
  friendName: string;
  onClose: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ friendId, friendName, onClose }) => {
  const { user } = useAuth();
  const { chatMessages, sendChatMessage } = useSocket();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Filter messages relevant to this conversation
  const messages = chatMessages.filter(
    (m) =>
      (m.from === user?._id && m.to === friendId) ||
      (m.from === friendId && m.to === user?._id)
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendChatMessage(friendId, input.trim());
    setInput('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-24 right-6 w-80 h-[400px] bg-surface/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-accent text-xs font-bold">{friendName.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-white text-sm font-medium">{friendName}</p>
            <p className="text-green-400 text-xs">Online</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-white/30">
            <MessageCircle size={32} className="mb-2" />
            <p className="text-sm">Start a conversation</p>
          </div>
        )}
        {messages.map((msg, i) => {
          const isMine = msg.from === user?._id;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                  isMine
                    ? 'bg-accent text-white rounded-br-md'
                    : 'bg-white/10 text-white rounded-bl-md'
                }`}
              >
                {msg.message}
              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/10">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message…"
            className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-accent transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            className="p-2.5 rounded-xl bg-accent text-white hover:bg-accent/90 transition-all"
          >
            <Send size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatPanel;
