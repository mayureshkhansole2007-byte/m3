import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ChallengeView } from './components/ChallengeView';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { MiniGames } from './components/MiniGames';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { motion, AnimatePresence } from 'motion/react';

type View = 'dashboard' | 'challenges' | 'leaderboard' | 'profile' | 'games';

function AppContent() {
  const { user, profile, loading, signIn } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-950 text-zinc-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-md"
        >
          <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl font-bold text-primary">CQ</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Welcome to CodeQuest</h1>
          <p className="text-zinc-400">
            Master programming through gamified challenges, real-time feedback, and a global community of learners.
          </p>
          <button
            onClick={signIn}
            className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onStartChallenge={(id) => { setSelectedChallengeId(id); setCurrentView('challenges'); }} />;
      case 'challenges':
        return <ChallengeView challengeId={selectedChallengeId} onBack={() => setCurrentView('dashboard')} />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'profile':
        return <Profile />;
      case 'games':
        return <MiniGames />;
      default:
        return <Dashboard onStartChallenge={(id) => { setSelectedChallengeId(id); setCurrentView('challenges'); }} />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto w-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <AppContent />
        <Toaster position="top-center" />
      </TooltipProvider>
    </AuthProvider>
  );
}

