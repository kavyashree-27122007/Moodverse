import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Check, X, MessageCircle } from 'lucide-react';
import { API } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import ChatPanel from './ChatPanel';

interface Friend {
  _id: string;
  username: string;
  fullName: string;
  profilePicture?: string;
}

interface PendingRequest {
  _id: string;
  requester: Friend;
  status: string;
}

const FriendsList: React.FC = () => {
  const socket = useSocket();
  const friendStatuses = socket?.friendStatuses || {};
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pending, setPending] = useState<PendingRequest[]>([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'friends' | 'pending' | 'add'>('friends');
  const [requestStatus, setRequestStatus] = useState<{msg: string, type: 'error'|'success'} | null>(null);
  const [activeChat, setActiveChat] = useState<Friend | null>(null);

  useEffect(() => {
    fetchFriends();
    fetchPending();
  }, []);

  const fetchFriends = async () => {
    try {
      const res = await API.get('/friends');
      setFriends(res.data);
    } catch {
      // Demo friends
      setFriends([
        { _id: 'demo1', username: 'arjun_m', fullName: 'Arjun Mehta' },
        { _id: 'demo2', username: 'priya_s', fullName: 'Priya Sharma' },
        { _id: 'demo3', username: 'vikram_r', fullName: 'Vikram Rajan' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPending = async () => {
    try {
      const res = await API.get('/friends/pending');
      setPending(res.data);
    } catch {
      setPending([]);
    }
  };

  const respondToRequest = async (friendshipId: string, action: 'accepted' | 'rejected') => {
    try {
      await API.put('/friends/respond', { friendshipId, action });
      setPending((prev) => prev.filter((p) => p._id !== friendshipId));
      if (action === 'accepted') fetchFriends();
    } catch {
      // silent
    }
  };

  const sendRequest = async () => {
    if (!searchUsername.trim()) return;
    setRequestStatus(null);
    try {
      await API.post('/friends/request', { recipientUsername: searchUsername.trim() });
      setSearchUsername('');
      setRequestStatus({ msg: 'Friend request sent!', type: 'success' });
    } catch (err: any) {
      setRequestStatus({ 
        msg: err.response?.data?.message || 'Failed to send request', 
        type: 'error' 
      });
    }
  };

  const toggleChat = (friend: Friend) => {
    if (activeChat?._id === friend._id) {
      setActiveChat(null);
    } else {
      setActiveChat(friend);
    }
  };

  return (
    <div className="space-y-4">
      {/* Primary Box: Friends / Requests / Add Friend */}
      <div className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {/* Tabs Bar — Always visible, completely unblocked */}
        <div className="flex border-b border-white/10 bg-surface/80">
          {[
            { key: 'friends' as const, label: 'Friends', icon: Users, count: friends.length },
            { key: 'pending' as const, label: 'Requests', icon: MessageCircle, count: pending.length },
            { key: 'add' as const, label: 'Add Friend', icon: UserPlus },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all cursor-pointer ${
                tab === t.key
                  ? 'text-accent border-b-2 border-accent bg-accent/5 font-semibold'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <t.icon size={15} />
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold">{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {/* Friends List */}
          {tab === 'friends' && (
            <div className="space-y-2">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-28 bg-white/10 rounded" />
                      <div className="h-2.5 w-20 bg-white/5 rounded" />
                    </div>
                  </div>
                ))
              ) : friends.length === 0 ? (
                <p className="text-white/40 text-sm text-center py-8">No friends yet. Send a request to get started!</p>
              ) : (
                friends.map((friend) => {
                  const status = friendStatuses[friend._id];
                  const isOnline = status?.online;
                  const isChatting = activeChat?._id === friend._id;

                  return (
                    <motion.div
                      key={friend._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        isChatting 
                          ? 'bg-accent/10 border-accent/40' 
                          : 'bg-white/5 hover:bg-white/10 border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
                            {friend.fullName.charAt(0).toUpperCase()}
                          </div>
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface ${
                              isOnline ? 'bg-green-500' : 'bg-gray-500'
                            }`}
                          />
                        </div>

                        {/* Info */}
                        <div className="min-w-0">
                          <p className="text-white text-sm font-semibold truncate">{friend.fullName}</p>
                          <div className="flex items-center gap-1.5 text-xs text-white/40">
                            <span>@{friend.username}</span>
                            {status?.emotion && (
                              <span className="text-accent/80 font-medium">• {status.emotion}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Chat Toggle Button */}
                      <button 
                        onClick={() => toggleChat(friend)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                          isChatting
                            ? 'bg-accent text-white shadow-accent/30'
                            : 'bg-accent/20 hover:bg-accent text-accent hover:text-white'
                        }`}
                      >
                        <MessageCircle size={14} />
                        <span>{isChatting ? 'Close' : 'Chat'}</span>
                      </button>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}

          {/* Pending Requests */}
          {tab === 'pending' && (
            <div className="space-y-2">
              {pending.length === 0 ? (
                <p className="text-white/40 text-sm text-center py-8">No pending requests</p>
              ) : (
                pending.map((req) => (
                  <motion.div
                    key={req._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">
                      {req.requester.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-semibold">{req.requester.fullName}</p>
                      <p className="text-white/40 text-xs">@{req.requester.username}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => respondToRequest(req._id, 'accepted')}
                        className="p-2 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all cursor-pointer"
                        title="Accept"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => respondToRequest(req._id, 'rejected')}
                        className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all cursor-pointer"
                        title="Reject"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Add Friend */}
          {tab === 'add' && (
            <div className="py-2 space-y-4">
              <p className="text-white/60 text-sm">Search by username to send a friend request.</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter username…"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendRequest()}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendRequest}
                  className="px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-all cursor-pointer"
                >
                  <UserPlus size={16} />
                </motion.button>
              </div>
              {requestStatus && (
                <p className={`text-sm mt-2 font-medium ${requestStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {requestStatus.msg}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Standalone Individual Chat Box — Rendered directly BELOW the Friends/Requests Box */}
      <AnimatePresence>
        {activeChat && (
          <ChatPanel 
            friendId={activeChat._id} 
            friendName={activeChat.fullName} 
            onClose={() => setActiveChat(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FriendsList;
