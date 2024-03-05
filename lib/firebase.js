import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAf5UBHhnwrYHkR0xrjy8omI43xfUTMzJo",
  authDomain: "ifthaar-app.firebaseapp.com",
  projectId: "ifthaar-app",
  storageBucket: "ifthaar-app.appspot.com",
  messagingSenderId: "1078435672808",
  appId: "1:1078435672808:web:1401894a0f3d171366cf5d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);