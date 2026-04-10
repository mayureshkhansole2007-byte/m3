import React from 'react';
import { useAuth } from '@/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Flame, Star, Trophy, Calendar, Mail, ShieldCheck } from 'lucide-react';

export const Profile: React.FC = () => {
  const { profile, logout } = useAuth();

  if (!profile) return null;

  const stats = [
    { label: 'Total XP', value: profile.xp, icon: Star, color: 'text-yellow-500' },
    { label: 'Level', value: profile.level, icon: Trophy, color: 'text-primary' },
    { label: 'Streak', value: `${profile.streak} Days`, icon: Flame, color: 'text-orange-500' },
    { label: 'Solved', value: profile.completedChallenges.length, icon: ShieldCheck, color: 'text-green-500' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-purple-500/20" />
        <CardContent className="relative pt-0 px-8 pb-8">
          <div className="flex flex-col md:flex-row items-end gap-6 -mt-12 mb-6">
            <Avatar className="h-32 w-32 border-4 border-zinc-950 shadow-xl">
              <AvatarImage src={profile.photoURL} />
              <AvatarFallback className="text-4xl">{profile.displayName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 pb-2">
              <h1 className="text-3xl font-bold">{profile.displayName}</h1>
              <p className="text-zinc-400">Level {profile.level} Programmer</p>
            </div>
            <div className="flex gap-3 pb-2">
              <Button variant="outline" className="border-zinc-800">Edit Profile</Button>
              <Button variant="destructive" onClick={logout}>Logout</Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Skill Mastery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(profile.skills).map(([skill, value]) => (
                <div key={skill} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize font-medium">{skill}</span>
                    <span className="text-zinc-400">{value}%</span>
                  </div>
                  <Progress value={value} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {profile.badges.length > 0 ? (
                  profile.badges.map(badge => (
                    <Badge key={badge} className="px-4 py-2 bg-primary/10 text-primary border-primary/20">
                      {badge}
                    </Badge>
                  ))
                ) : (
                  <p className="text-zinc-500 text-sm">Keep coding to earn achievements!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg">Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <Calendar className="w-4 h-4" />
                Joined April 2026
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <ShieldCheck className="w-4 h-4" />
                Verified Programmer
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
