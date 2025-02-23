import { onAuthStateChanged, type User } from "firebase/auth";
import { writable } from "svelte/store";
import { auth, db } from "./firebase";
import { arrayUnion, doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";


export const currentUser = writable<User | null>(null);

onAuthStateChanged(auth, async (user) => {
  currentUser.set(user);

  if(user) {
    const userRef = doc(db, 'users', user.uid);

    await setDoc(userRef, {
      email: user.email || '',
      displayName: user.displayName || '',
      lastUpdated: new Date().toLocaleString(),
      device: navigator.userAgent
    }, { merge: true });
  }
});