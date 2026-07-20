// MoodVerse Application Entry Point
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { MascotProvider } from './context/MascotContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import MoodyMascot from './components/MoodyMascot';
import { Loader2 } from 'lucide-react';

const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Friends = lazy(() => import('./pages/Friends'));
const Music = lazy(() => import('./pages/Music'));
const Movies = lazy(() => import('./pages/Movies'));
const Journal = lazy(() => import('./pages/Journal'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Settings = lazy(() => import('./pages/Settings'));
const Achievements = lazy(() => import('./pages/Achievements'));

// Fallback UI
const PageLoader = () => (
  <div className="fixed inset-0 z-[100] flex flex-col h-screen w-full items-center justify-center bg-gradient-to-b from-surface to-background">
    <div className="mb-6 flex items-center justify-center scale-90">
       <MoodyMascot size="medium" inline={true} />
    </div>
    <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">MoodVerse</h1>
    <p className="text-white/50 mb-8 text-sm">Awakening the AI engine...</p>
    <Loader2 className="animate-spin text-accent" size={28} />
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <MascotProvider>
            <div className="min-h-screen bg-background text-text font-sans">
              <Router>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected routes wrapped in Sidebar layout */}
                    <Route
                      element={
                        <ProtectedRoute>
                          <AppLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/friends" element={<Friends />} />
                      <Route path="/music" element={<Music />} />
                      <Route path="/movies" element={<Movies />} />
                      <Route path="/journal" element={<Journal />} />
                      <Route path="/notifications" element={<Notifications />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/achievements" element={<Achievements />} />
                    </Route>

                    <Route path="/" element={<Navigate to="/login" replace />} />
                  </Routes>
                </Suspense>
              </Router>
            </div>
          </MascotProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
