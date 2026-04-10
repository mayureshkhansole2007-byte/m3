import React from 'react';
import { useAuth } from '../AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { Rocket, Shield, Brain, Code, ArrowRight, Star } from 'lucide-react';

interface DashboardProps {
  onStartChallenge: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartChallenge }) => {
  const { profile } = useAuth();

  if (!profile) return null;

  const xpToNextLevel = profile.level * 1000;
  const progress = (profile.xp % 1000) / 10;

  const skills = [
    { name: 'Logic', value: profile.skills.logic, icon: Brain, color: 'text-blue-500' },
    { name: 'Syntax', value: profile.skills.syntax, icon: Code, color: 'text-green-500' },
    { name: 'Algorithms', value: profile.skills.algorithms, icon: Star, color: 'text-yellow-500' },
    { name: 'Debugging', value: profile.skills.debugging, icon: Shield, color: 'text-red-500' },
  ];

  const recentChallenges = [
    { id: 'spaceship-1', title: 'Spaceship Engine Debug', difficulty: 'Beginner', category: 'debugging', xp: 250 },
    { id: 'network-1', title: 'Secure the Firewall', difficulty: 'Intermediate', category: 'security', xp: 500 },
    { id: 'loop-1', title: 'Infinite Loop Escape', difficulty: 'Beginner', category: 'loops', xp: 150 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1 bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-primary" />
              Level {profile.level} Progress
            </CardTitle>
            <CardDescription>
              {profile.xp} / {xpToNextLevel} XP to Level {profile.level + 1}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        <Card className="md:w-72 bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-400">Current Streak</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-4xl font-bold">{profile.streak} Days</span>
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-500">
              <Star className="fill-current" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {skills.map((skill) => (
          <Card key={skill.name} className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-zinc-800 ${skill.color}`}>
                  <skill.icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold">{skill.value}%</span>
              </div>
              <p className="text-sm font-medium text-zinc-400">{skill.name} Mastery</p>
              <Progress value={skill.value} className="h-1.5 mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold">Recommended Challenges</h2>
          <div className="grid gap-4">
            {recentChallenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                whileHover={{ x: 4 }}
                className="group p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-primary/50 transition-all"
                onClick={() => onStartChallenge(challenge.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Code className="w-6 h-6 text-zinc-400 group-hover:text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{challenge.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                        {challenge.difficulty}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                        {challenge.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-primary">+{challenge.xp} XP</span>
                  <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-primary transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Your Badges</h2>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              {profile.badges.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {profile.badges.map((badge) => (
                    <div key={badge} className="aspect-square bg-zinc-800 rounded-xl flex items-center justify-center">
                      <Star className="w-8 h-8 text-yellow-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-zinc-500 text-sm">No badges earned yet.</p>
                  <p className="text-zinc-400 text-xs mt-1">Complete challenges to unlock them!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
