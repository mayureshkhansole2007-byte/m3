import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInWithPopup, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from './lib/firebase';
import { UserProfile } from './types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        // Listen to profile changes
        const unsubProfile = onSnapshot(userDocRef, (docSnap) => {
            // Initialize or update profile
            const now = new Date();
            const lastActiveDate = docSnap.exists() ? new Date(docSnap.data().lastActive) : null;
            let currentStreak = docSnap.exists() ? docSnap.data().streak : 0;

            if (lastActiveDate) {
              const diffDays = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
              if (diffDays === 1) {
                currentStreak += 1;
              } else if (diffDays > 1) {
                currentStreak = 1; // Reset streak but count today
              }
            } else {
              currentStreak = 1; // First day
            }

            if (!docSnap.exists()) {
              const newProfile: UserProfile = {
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName || 'Anonymous',
                photoURL: firebaseUser.photoURL || '',
                level: 1,
                xp: 0,
                streak: currentStreak,
                lastActive: now.toISOString(),
                badges: [],
                completedChallenges: [],
                skills: { logic: 0, syntax: 0, algorithms: 0, debugging: 0 }
              };
              setDoc(userDocRef, newProfile).catch(e => handleFirestoreError(e, OperationType.CREATE, 'users'));
            } else {
              setProfile(docSnap.data() as UserProfile);
              // Update lastActive and streak if it's a new day
              if (!lastActiveDate || lastActiveDate.toDateString() !== now.toDateString()) {
                updateDoc(userDocRef, {
                  lastActive: now.toISOString(),
                  streak: currentStreak
                }).catch(e => handleFirestoreError(e, OperationType.UPDATE, 'users'));
              }
            }
          setLoading(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, 'users');
          setLoading(false);
        });

        return () => unsubProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'users');
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
