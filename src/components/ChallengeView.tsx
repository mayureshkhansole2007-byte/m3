import React, { useState, useEffect } from 'react';
import { useAuth } from '@/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Play, CheckCircle2, AlertCircle, Lightbulb, Rocket } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface ChallengeViewProps {
  challengeId: string | null;
  onBack: () => void;
}

export const ChallengeView: React.FC<ChallengeViewProps> = ({ challengeId, onBack }) => {
  const { profile, updateProfile } = useAuth();
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Mock challenge data
  const challenge = {
    id: 'spaceship-1',
    title: 'Spaceship Engine Debug',
    description: `The spaceship's propulsion system is failing! The loop that calculates thrust is stuck in an infinite loop or returning incorrect values. 
    
    Fix the function \`calculateThrust\` so it returns the sum of all fuel cells in the array.`,
    difficulty: 'Beginner',
    category: 'debugging',
    xpReward: 250,
    initialCode: `function calculateThrust(fuelCells) {
  let total = 0;
  // FIX THIS LOOP
  for (let i = 0; i <= fuelCells.length; i++) {
    total += fuelCells[i];
  }
  return total;
}`,
    hints: [
      "Check the loop condition: `i <= fuelCells.length` might go out of bounds.",
      "Arrays are zero-indexed, so the last index is `length - 1`."
    ]
  };

  useEffect(() => {
    setCode(challenge.initialCode);
  }, [challengeId]);

  const runCode = () => {
    setIsRunning(true);
    setOutput(['> Initializing engine diagnostics...', '> Running test cases...']);
    
    setTimeout(() => {
      try {
        // Simple simulation of code execution
        if (code.includes('i < fuelCells.length') || code.includes('i <fuelCells.length')) {
          setOutput(prev => [...prev, '✓ Test Case 1: [10, 20, 30] -> 60', '✓ Test Case 2: [5, 5, 5] -> 15', '✓ Engine stabilized! Thrust at 100%.']);
          setIsSuccess(true);
          toast.success('Challenge Completed!', {
            description: `You earned ${challenge.xpReward} XP and saved the spaceship!`,
          });
          
          // Update user profile
          if (profile) {
            const newXp = profile.xp + challenge.xpReward;
            const newLevel = Math.floor(newXp / 1000) + 1;
            updateProfile({
              xp: newXp,
              level: newLevel,
              completedChallenges: [...profile.completedChallenges, challenge.id],
              skills: {
                ...profile.skills,
                debugging: Math.min(100, profile.skills.debugging + 10)
              }
            });
          }
        } else {
          setOutput(prev => [...prev, '✖ Error: Cannot read property of undefined (at index 3)', '✖ Engine failure imminent! Check your loop bounds.']);
          setIsSuccess(false);
        }
      } catch (e) {
        setOutput(prev => [...prev, `✖ Runtime Error: ${e instanceof Error ? e.message : 'Unknown error'}`]);
      } finally {
        setIsRunning(false);
      }
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-primary border-primary/20">
            {challenge.difficulty}
          </Badge>
          <span className="text-sm font-bold text-primary">+{challenge.xpReward} XP</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        <div className="flex flex-col gap-6 overflow-hidden">
          <Card className="bg-zinc-900 border-zinc-800 flex-1 overflow-hidden flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-primary" />
                  {challenge.title}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowHint(!showHint)} className="text-zinc-400">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Hint
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto prose prose-invert prose-sm max-w-none">
              <p className="text-zinc-300 whitespace-pre-line">{challenge.description}</p>
              
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg"
                >
                  <p className="font-semibold text-primary mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Hints:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-400">
                    {challenge.hints.map((hint, i) => <li key={i}>{hint}</li>)}
                  </ul>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 h-48">
            <CardHeader className="py-3 border-b border-zinc-800">
              <CardTitle className="text-xs uppercase tracking-widest text-zinc-500">Console Output</CardTitle>
            </CardHeader>
            <CardContent className="p-4 font-mono text-xs overflow-y-auto h-32">
              {output.map((line, i) => (
                <div key={i} className={line.startsWith('✓') ? 'text-green-500' : line.startsWith('✖') ? 'text-red-500' : 'text-zinc-400'}>
                  {line}
                </div>
              ))}
              {output.length === 0 && <span className="text-zinc-600">Run your code to see results...</span>}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-zinc-950 border-zinc-800 flex flex-col overflow-hidden">
          <div className="h-12 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900">
            <span className="text-xs font-medium text-zinc-400">solution.js</span>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                onClick={runCode} 
                disabled={isRunning || isSuccess}
                className="h-8 gap-2"
              >
                {isRunning ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Play className="w-3 h-3" />
                  </motion.div>
                ) : (
                  <Play className="w-3 h-3" />
                )}
                Run Code
              </Button>
            </div>
          </div>
          <div className="flex-1 relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="absolute inset-0 w-full h-full bg-transparent p-6 font-mono text-sm resize-none focus:outline-none text-zinc-300"
              spellCheck={false}
            />
          </div>
          {isSuccess && (
            <div className="p-6 bg-green-500/10 border-t border-green-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3 text-green-500">
                <CheckCircle2 className="w-6 h-6" />
                <div>
                  <p className="font-bold">Mission Accomplished!</p>
                  <p className="text-xs opacity-80">The spaceship is safe thanks to your code.</p>
                </div>
              </div>
              <Button onClick={onBack} variant="outline" className="border-green-500/50 text-green-500 hover:bg-green-500/10">
                Next Mission
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
