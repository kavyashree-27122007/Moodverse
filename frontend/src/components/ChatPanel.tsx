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
  const socket = useSocket();
  const chatMessages = socket?.chatMessages || [];
  const sendChatMessage = socket?.sendChatMessage || (() => {});
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentUserId = user?._id || 'me';

  // Filter messages relevant to this conversation
  const messages = chatMessages.filter(
    (m) =>
      (m.from === currentUserId && m.to === friendId) ||
      (m.from === friendId && m.to === currentUserId) ||
      (m.to === friendId)
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="w-full bg-surface/80 backdrop-blur-xl border border-accent/30 rounded-2xl shadow-2xl flex flex-col h-[380px] overflow-hidden mt-3 relative"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface/90 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
            {friendName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="text-white text-sm font-bold tracking-tight leading-tight">{friendName}</h4>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-[11px] font-medium">Active Chat</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
          title="Close Chat"
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/20">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/30 space-y-1.5">
            <div className="p-3 rounded-xl bg-white/5 text-accent">
              <MessageCircle size={28} />
            </div>
            <p className="text-xs font-medium text-white/60">No messages yet</p>
            <p className="text-[11px] text-white/30">Type a message below to start chatting</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMine = msg.from === currentUserId || msg.from === 'me';
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                    isMine
                      ? 'bg-gradient-to-r from-accent to-purple-600 text-white rounded-br-xs shadow-md'
                      : 'bg-white/10 text-white border border-white/10 rounded-bl-xs'
                  }`}
                >
                  {msg.message}
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Section */}
      <div className="p-3 bg-surface/90 border-t border-white/10">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message ${friendName}…`}
            className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:ring-2 focus:ring-accent transition-all"
          />
          <button
            onClick={handleSend}
            className="p-2 rounded-xl bg-accent text-white hover:bg-accent/90 shadow-md transition-all cursor-pointer flex items-center justify-center"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatPanel;
