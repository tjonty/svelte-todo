import { onAuthStateChanged, type User } from "firebase/auth";
import { writable } from "svelte/store";
import { auth, db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";


export const currentUser = writable<User | null>(null);

onAuthStateChanged(auth, (user) => {
  currentUser.set(user);
});

export function listenForDocument(collectionName: string, documentID: string) {
  const docRef = doc(db, collectionName, documentID);

  const subscribe = onSnapshot(docRef, (doc) => {
    if(doc.exists()) {
      console.log(doc)
    } else {
      console.log('doc does not exists!')
    }
  });

  return subscribe;
}