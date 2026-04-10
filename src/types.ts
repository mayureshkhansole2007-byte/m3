export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL?: string;
  level: number;
  xp: number;
  streak: number;
  lastActive: string;
  badges: string[];
  completedChallenges: string[];
  skills: {
    logic: number;
    syntax: number;
    algorithms: number;
    debugging: number;
  };
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'loops' | 'recursion' | 'data-structures' | 'debugging' | 'security';
  xpReward: number;
  initialCode: string;
  solution: string;
  hints: string[];
  testCases: {
    input: any;
    expected: any;
  }[];
}

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  photoURL?: string;
  xp: number;
  level: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  participants: string[];
  status: 'active' | 'completed';
  targetXp: number;
  currentXp: number;
}
