import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Check, X, MessageCircle, Wifi, WifiOff } from 'lucide-react';
import { API } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

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
  const { friendStatuses } = useSocket();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pending, setPending] = useState<PendingRequest[]>([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'friends' | 'pending' | 'add'>('friends');
  const [requestStatus, setRequestStatus] = useState<{msg: string, type: 'error'|'success'} | null>(null);

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

  return (
    <div className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {[
          { key: 'friends' as const, label: 'Friends', icon: Users, count: friends.length },
          { key: 'pending' as const, label: 'Requests', icon: MessageCircle, count: pending.length },
          { key: 'add' as const, label: 'Add Friend', icon: UserPlus },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${
              tab === t.key
                ? 'text-accent border-b-2 border-accent bg-accent/5'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            <t.icon size={15} />
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className="text-xs bg-accent/20 text-accent px-1.5 py-0.5 rounded-full">{t.count}</span>
            )}
          </button>
        ))}
      </div>

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
                return (
                  <motion.div
                    key={friend._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group"
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="text-accent text-sm font-bold">
                          {friend.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {/* Online indicator */}
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface ${
                          isOnline ? 'bg-green-500' : 'bg-gray-500'
                        }`}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{friend.fullName}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-white/40 text-xs">@{friend.username}</span>
                        {status?.emotion && (
                          <span className="text-xs text-accent/80">• Feeling {status.emotion}</span>
                        )}
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isOnline ? <Wifi size={14} className="text-green-400" /> : <WifiOff size={14} className="text-white/20" />}
                      <button 
                        onClick={() => alert(`Starting a chat with ${friend.fullName} (Feature coming soon in v2.1!)`)}
                        className="p-1.5 ml-2 bg-accent/20 hover:bg-accent/40 text-accent rounded-lg transition-colors"
                        title="Chat"
                      >
                        <MessageCircle size={14} />
                      </button>
                    </div>
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
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                >
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-accent text-sm font-bold">
                      {req.requester.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{req.requester.fullName}</p>
                    <p className="text-white/40 text-xs">@{req.requester.username}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => respondToRequest(req._id, 'accepted')}
                      className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => respondToRequest(req._id, 'rejected')}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Add Friend */}
        {tab === 'add' && (
          <div className="py-4 space-y-4">
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
                className="px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-all"
              >
                <UserPlus size={16} />
              </motion.button>
            </div>
            {requestStatus && (
              <p className={`text-sm mt-2 ${requestStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {requestStatus.msg}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsList;
