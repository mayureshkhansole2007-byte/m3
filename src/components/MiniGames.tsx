import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, RefreshCw, CheckCircle2, XCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';

export const MiniGames: React.FC = () => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const puzzles = [
    {
      question: "What is the final value of 'x'?",
      code: "let x = 0;\nfor(let i = 0; i < 5; i++) {\n  x += i;\n}",
      options: [5, 10, 15, 20],
      answer: 10,
      xp: 50
    },
    {
      question: "How many times will 'Hello' be printed?",
      code: "let i = 10;\nwhile(i > 0) {\n  console.log('Hello');\n  i -= 2;\n}",
      options: [5, 10, 4, 6],
      answer: 5,
      xp: 75
    }
  ];

  const startGame = () => {
    setGameState('playing');
    setSelectedAnswer(null);
  };

  const checkAnswer = (option: number) => {
    setSelectedAnswer(option);
    if (option === puzzles[currentPuzzle].answer) {
      toast.success('Correct!', { description: `+${puzzles[currentPuzzle].xp} XP` });
      if (currentPuzzle < puzzles.length - 1) {
        setTimeout(() => {
          setCurrentPuzzle(prev => prev + 1);
          setSelectedAnswer(null);
        }, 1500);
      } else {
        setGameState('won');
      }
    } else {
      setGameState('lost');
      toast.error('Incorrect Answer', { description: 'Try again to master the concept.' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mini-Games</h1>
          <p className="text-zinc-400">Quick puzzles to sharpen your core concepts.</p>
        </div>
        <Badge variant="secondary" className="px-4 py-1">
          <Gamepad2 className="w-4 h-4 mr-2" />
          Arcade Mode
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 bg-zinc-900 border-zinc-800 min-h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle>Loop Master Puzzle</CardTitle>
            <CardDescription>Predict the output of the code snippets.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {gameState === 'idle' ? (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <RefreshCw className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Ready to test your logic?</h3>
                    <p className="text-zinc-400 text-sm">Solve 5 puzzles in a row to earn the 'Loop Master' badge.</p>
                  </div>
                  <Button onClick={startGame} size="lg" className="px-8">Start Game</Button>
                </motion.div>
              ) : gameState === 'playing' ? (
                <motion.div
                  key="playing"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="p-6 bg-zinc-950 rounded-xl border border-zinc-800 font-mono text-sm">
                    <pre className="text-zinc-300">{puzzles[currentPuzzle].code}</pre>
                  </div>
                  <h3 className="text-lg font-medium">{puzzles[currentPuzzle].question}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {puzzles[currentPuzzle].options.map((option) => (
                      <Button
                        key={option}
                        variant={selectedAnswer === option ? (option === puzzles[currentPuzzle].answer ? 'default' : 'destructive') : 'outline'}
                        onClick={() => checkAnswer(option)}
                        disabled={selectedAnswer !== null}
                        className="h-14 text-lg font-bold border-zinc-800 hover:bg-zinc-800"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              ) : gameState === 'won' ? (
                <motion.div
                  key="won"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-green-500">You Won!</h3>
                    <p className="text-zinc-400">You've mastered these loop concepts.</p>
                  </div>
                  <Button onClick={() => { setGameState('idle'); setCurrentPuzzle(0); }} variant="outline">Play Again</Button>
                </motion.div>
              ) : (
                <motion.div
                  key="lost"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500">
                    <XCircle className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-red-500">Game Over</h3>
                    <p className="text-zinc-400">Don't give up! Every mistake is a learning opportunity.</p>
                  </div>
                  <Button onClick={() => { setGameState('idle'); setCurrentPuzzle(0); }} variant="outline">Try Again</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-zinc-400">Daily Bonus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-500">
                  <Zap className="fill-current" />
                </div>
                <div>
                  <p className="font-bold">2x XP Multiplier</p>
                  <p className="text-xs text-zinc-500">Active for 2h 15m</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-zinc-400">Upcoming Games</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between opacity-50">
                <span className="text-sm font-medium">Recursion Runner</span>
                <Badge variant="outline">Locked</Badge>
              </div>
              <div className="flex items-center justify-between opacity-50">
                <span className="text-sm font-medium">Data Structure Duel</span>
                <Badge variant="outline">Locked</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
