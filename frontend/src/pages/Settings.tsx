import { motion } from 'framer-motion';
import { useAuth, API } from '../context/AuthContext';
import { Settings as SettingsIcon, User, Globe, Bell, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import type { EmotionName } from '../utils/emotions';
import { useState } from 'react';

const emotions: EmotionName[] = ['Happy', 'Sad', 'Angry', 'Calm', 'Anxious', 'Excited', 'Love', 'Motivated', 'Relaxed', 'Neutral'];

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { currentEmotion, setEmotion } = useTheme();
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    dailyReminder: true,
    friendUpdates: true,
    achievements: true,
    shareStatus: true,
    privateJournal: false,
  });

  const handleToggle = (key: string) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const [actionStatus, setActionStatus] = useState<string | null>(null);

  const showMessage = (msg: string) => {
    setActionStatus(msg);
    setTimeout(() => setActionStatus(null), 3000);
  };

  return (
    <div className="p-8 space-y-8 pb-20 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <SettingsIcon className="text-accent" size={28} />
          Settings
        </h1>
        <p className="text-white/50 mt-1">Manage your MoodVerse preferences</p>
      </motion.div>

      {/* Profile Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-5">
        <h2 className="text-white font-bold flex items-center gap-2"><User size={18} className="text-accent" /> Profile</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-white/40 text-xs mb-1">Full Name</p>
            <p className="text-white font-medium">{user?.fullName}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs mb-1">Username</p>
            <p className="text-white font-medium">@{user?.username}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs mb-1">Email</p>
            <p className="text-white font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs mb-1">AI Persona</p>
            <p className="text-white font-medium">{user?.aiPersonality || 'Empathetic'}</p>
          </div>
        </div>
      </motion.div>

      {/* Theme Override */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4">
        <h2 className="text-white font-bold flex items-center gap-2"><Globe size={18} className="text-accent" /> Theme Preview</h2>
        <p className="text-white/50 text-sm">Manually preview how the app looks for each emotion</p>
        <div className="flex flex-wrap gap-2">
          {emotions.map((em) => (
            <button
              key={em}
              onClick={() => setEmotion(em)}
              className={`px-3 py-1.5 text-sm rounded-xl font-medium transition-all ${
                currentEmotion === em ? 'bg-accent text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {em}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notifications Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4">
        <h2 className="text-white font-bold flex items-center gap-2"><Bell size={18} className="text-accent" /> Notifications</h2>
        <div className="space-y-3">
          {[
            { label: 'Daily mood reminder', key: 'dailyReminder' }, 
            { label: 'Friend activity updates', key: 'friendUpdates' }, 
            { label: 'Achievement unlocked', key: 'achievements' }
          ].map(({label, key}) => (
            <div key={key} className="flex items-center justify-between">
              <p className="text-white/70 text-sm">{label}</p>
              <div 
                onClick={() => handleToggle(key)}
                className={`w-10 h-5 rounded-full flex items-center px-1 cursor-pointer transition-colors ${toggles[key] ? 'bg-accent justify-end' : 'bg-white/10 justify-start'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-full shadow ${toggles[key] ? 'bg-white' : 'bg-white/40'}`} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Privacy Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4">
        <h2 className="text-white font-bold flex items-center gap-2"><Shield size={18} className="text-accent" /> Privacy & Security</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-white/70 text-sm">Share mood status with friends</p>
            <div 
              onClick={() => handleToggle('shareStatus')}
              className={`w-10 h-5 rounded-full flex items-center px-1 cursor-pointer transition-colors ${toggles['shareStatus'] ? 'bg-accent justify-end' : 'bg-white/10 justify-start'}`}
            >
              <div className={`w-3.5 h-3.5 rounded-full shadow ${toggles['shareStatus'] ? 'bg-white' : 'bg-white/40'}`} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-white/70 text-sm">Private journal mode</p>
            <div 
              onClick={() => handleToggle('privateJournal')}
              className={`w-10 h-5 rounded-full flex items-center px-1 cursor-pointer transition-colors ${toggles['privateJournal'] ? 'bg-accent justify-end' : 'bg-white/10 justify-start'}`}
            >
              <div className={`w-3.5 h-3.5 rounded-full shadow ${toggles['privateJournal'] ? 'bg-white' : 'bg-white/40'}`} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Memory Management Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold flex items-center gap-2"><SettingsIcon size={18} className="text-accent" /> Data & AI Memory</h2>
          {actionStatus && <span className="text-xs text-accent font-medium animate-pulse">{actionStatus}</span>}
        </div>
        <p className="text-white/60 text-sm mb-4">Manage the long-term memory Moody uses to personalize your experience.</p>
        
        <div className="space-y-4">
          <button 
            onClick={async () => {
              showMessage('Fetching memory...');
              try {
                const res = await API.get('/ai/memory');
                showMessage('Memory loaded.');
                console.log(res.data.memory); // log instead of blocking alert
              } catch (e) {
                showMessage('Memory currently unavailable.');
              }
            }}
            className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
          >
            <p className="text-white font-medium">View AI Memory (Console)</p>
            <p className="text-xs text-white/50 mt-1">See exactly what Moody remembers about you.</p>
          </button>

          <button 
            onClick={async () => {
              showMessage('Preparing export...');
              try {
                const res = await API.get('/ai/memory/export');
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data.data, null, 2));
                const downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href",     dataStr);
                downloadAnchorNode.setAttribute("download", "moodverse_export.json");
                document.body.appendChild(downloadAnchorNode); 
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
                showMessage('Export started.');
              } catch (e) {
                showMessage('Data export currently unavailable.');
              }
            }}
            className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
          >
            <p className="text-white font-medium">Export My Data</p>
            <p className="text-xs text-white/50 mt-1">Download a JSON file of your moods and memory.</p>
          </button>

          <button 
            onClick={async () => {
              if (window.confirm("Are you sure you want to reset Moody's memory? This will delete all personalized context.")) {
                showMessage('Resetting memory...');
                try {
                  await API.delete('/ai/memory');
                  showMessage('Memory reset successfully.');
                } catch (e) {
                  showMessage('Failed to reset memory.');
                }
              }
            }}
            className="w-full text-left p-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
          >
            <p className="text-red-400 font-medium">Reset AI Memory</p>
            <p className="text-xs text-red-400/60 mt-1">Permanently delete your AI personalization history.</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
