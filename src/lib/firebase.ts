import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log('Firebase Config:', {
  ...firebaseConfig,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
});

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth =getAuth();
export const storage =getStorage();
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics }