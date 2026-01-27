// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBOpd3rydF_v9wVnxaFyXtpMgVmgqnZ9vw",
  authDomain: "quizdot-52c4b.firebaseapp.com",
  databaseURL: "https://quizdot-52c4b-default-rtdb.firebaseio.com",
  projectId: "quizdot-52c4b",
  storageBucket: "quizdot-52c4b.firebasestorage.app",
  messagingSenderId: "152127384776",
  appId: "1:152127384776:web:e22647e566fd11bcb109fd",
  measurementId: "G-NSLDFGT7NV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
