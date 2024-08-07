import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDzgIMwq8yaZnR2TsVKGOGOJEzTXSFloHk",
  authDomain: "inventory-management-5aee5.firebaseapp.com",
  projectId: "inventory-management-5aee5",
  storageBucket: "inventory-management-5aee5.appspot.com",
  messagingSenderId: "1007893737710",
  appId: "1:1007893737710:web:7ffa3073e81ec6dc5703ff",
  measurementId: "G-P5BTVW86R0"
};

let app;
let firestore;

if (typeof window !== 'undefined') {
  app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  firestore = getFirestore(app);
}

export { firestore };
