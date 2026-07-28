import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  BookOpen,
  Bell,
  Settings,
  LogOut,
  Headphones,
  Film,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: BarChart3, label: 'Analytics', to: '/analytics' },
  { icon: Headphones, label: 'Music', to: '/music' },
  { icon: Film, label: 'Movies', to: '/movies' },
  { icon: Users, label: 'Friends', to: '/friends' },
  { icon: BookOpen, label: 'Journal', to: '/journal' },
  { icon: Bell, label: 'Notifications', to: '/notifications' },
  { icon: Settings, label: 'Settings', to: '/settings' },
];

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-surface/90 backdrop-blur-xl border-b border-white/10 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xl shadow-accent/40" style={{ background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #3b82f6 100%)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21C12 21 3 14.5 3 8.5C3 6.01 5.01 4 7.5 4C9.24 4 10.76 4.96 11.57 6.38L12 7L12.43 6.38C13.24 4.96 14.76 4 16.5 4C18.99 4 21 6.01 21 8.5C21 14.5 12 21 12 21Z" fill="white" fillOpacity="0.25"/>
              <path d="M4 11.5H7L9 9L11 13.5L13 10.5L14.5 12.5H20" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-white font-bold text-sm">MoodVerse</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center flex-shrink-0">
            <span className="text-accent text-xs font-bold">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-screen w-64 flex-col bg-surface/80 backdrop-blur-xl border-r border-white/10 fixed left-0 top-0 z-40">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl shadow-accent/40" style={{ background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #3b82f6 100%)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Stylized heart with EEG-style wave inside — emotional wellness icon */}
                <path d="M12 21C12 21 3 14.5 3 8.5C3 6.01 5.01 4 7.5 4C9.24 4 10.76 4.96 11.57 6.38L12 7L12.43 6.38C13.24 4.96 14.76 4 16.5 4C18.99 4 21 6.01 21 8.5C21 14.5 12 21 12 21Z" fill="white" fillOpacity="0.25"/>
                <path d="M4 11.5H7L9 9L11 13.5L13 10.5L14.5 12.5H20" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">MoodVerse</h1>
              <p className="text-white/40 text-xs mt-0.5">Feel Everything</p>
            </div>
          </motion.div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item, i) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-accent/20 text-accent border border-accent/30'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      size={18}
                      className={`transition-all ${isActive ? 'text-accent' : 'text-white/40 group-hover:text-white'}`}
                    />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-accent"
                      />
                    )}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-accent/30 flex items-center justify-center flex-shrink-0">
              <span className="text-accent text-sm font-bold">
                {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.fullName || 'User'}</p>
              <p className="text-white/40 text-xs truncate">@{user?.username || 'username'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/95 backdrop-blur-xl border-t border-white/10 z-50 flex items-center justify-around px-1">
        {navItems.filter(i => ['/dashboard', '/music', '/movies', '/journal', '/settings'].includes(i.to)).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all ${
                isActive ? 'text-accent' : 'text-white/40 hover:text-white/70'
              }`
            }
          >
            <item.icon size={20} className="mb-1" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
