import { motion } from 'framer-motion';
import FriendsList from '../components/FriendsList';

const Friends: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white tracking-tight">Friends</h1>
        <p className="text-white/50 mt-1">Connect with friends and share your emotional journey</p>
      </motion.div>
      <div className="max-w-2xl">
        <FriendsList />
      </div>
    </div>
  );
};

export default Friends;
