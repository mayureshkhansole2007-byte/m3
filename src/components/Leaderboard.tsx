import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { LeaderboardEntry } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Trophy, Medal, Star } from 'lucide-react';
import { motion } from 'motion/react';

export const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'leaderboard'), orderBy('xp', 'desc'), limit(10));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as LeaderboardEntry);
      setEntries(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'leaderboard');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Mock data if empty
  const displayEntries = entries.length > 0 ? entries : [
    { uid: '1', displayName: 'CodeMaster', xp: 12500, level: 15, photoURL: 'https://picsum.photos/seed/1/100/100' },
    { uid: '2', displayName: 'AlgoQueen', xp: 11200, level: 14, photoURL: 'https://picsum.photos/seed/2/100/100' },
    { uid: '3', displayName: 'DebugNinja', xp: 9800, level: 12, photoURL: 'https://picsum.photos/seed/3/100/100' },
    { uid: '4', displayName: 'SyntaxWizard', xp: 8500, level: 10, photoURL: 'https://picsum.photos/seed/4/100/100' },
    { uid: '5', displayName: 'LogicPro', xp: 7200, level: 9, photoURL: 'https://picsum.photos/seed/5/100/100' },
  ];

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1: return <Medal className="w-6 h-6 text-zinc-400" />;
      case 2: return <Medal className="w-6 h-6 text-orange-500" />;
      default: return <span className="text-zinc-500 font-bold w-6 text-center">{index + 1}</span>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Global Leaderboard</h1>
        <p className="text-zinc-400">The top programmers in the CodeQuest universe.</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-800">
            {displayEntries.map((entry, index) => (
              <motion.div
                key={entry.uid}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-6 hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-6">
                  <div className="w-8 flex justify-center">
                    {getRankIcon(index)}
                  </div>
                  <Avatar className="h-12 w-12 border-2 border-zinc-800">
                    <AvatarImage src={entry.photoURL} />
                    <AvatarFallback>{entry.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg">{entry.displayName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px] uppercase">
                        Level {entry.level}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-primary">{entry.xp.toLocaleString()}</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">Total XP</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
