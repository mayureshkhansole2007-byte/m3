import React from 'react';
import { useAuth } from '../AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Flame, Trophy, Zap } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { profile } = useAuth();

  if (!profile) return null;

  return (
    <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-orange-500">
          <Flame className="w-5 h-5 fill-current" />
          <span className="font-bold">{profile.streak} Day Streak</span>
        </div>
        <div className="flex items-center gap-2 text-yellow-500">
          <Zap className="w-5 h-5 fill-current" />
          <span className="font-bold">{profile.xp} XP</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium">{profile.displayName}</p>
          <p className="text-xs text-zinc-500">Level {profile.level} Programmer</p>
        </div>
        <Avatar className="h-9 w-9 border border-zinc-800">
          <AvatarImage src={profile.photoURL} />
          <AvatarFallback>{profile.displayName[0]}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};
