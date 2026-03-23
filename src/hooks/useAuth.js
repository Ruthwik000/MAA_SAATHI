import { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        // Fetch custom profile from Firestore
        const profileRef = doc(db, 'users', authUser.uid);
        const profileSnap = await getDoc(profileRef);
        
        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        } else {
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const loggedInUser = result.user;
      const profileRef = doc(db, 'users', loggedInUser.uid);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        return { isNewUser: false, profile: profileSnap.data() };
      } else {
        return { isNewUser: true, user: loggedInUser };
      }
    } catch (error) {
      console.error("Google Sign In Error:", error);
      throw error;
    }
  };

  const setupRole = async (role) => {
    if (!user) throw new Error("No user authenticated");
    
    const profileData = {
      uid: user.uid,
      name: user.displayName || 'Unknown User',
      email: user.email || '',
      photoURL: user.photoURL || '',
      role: role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const profileRef = doc(db, 'users', user.uid);
    await setDoc(profileRef, profileData);
    
    setProfile(profileData);
    return profileData;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateProfile = async (data) => {
    if (!user) return;
    const profileRef = doc(db, 'users', user.uid);
    await setDoc(profileRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    // Refresh local profile
    const profileSnap = await getDoc(profileRef);
    setProfile(profileSnap.data());
  };

  return { user, profile, loading, loginWithGoogle, setupRole, logout, updateProfile };
}
