import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDNjxHLWrXe4k1yQKV4dqQ_P3uEbNlFnig",
  authDomain: "ssan-57670.firebaseapp.com",
  projectId: "ssan-57670",
  storageBucket: "ssan-57670.firebasestorage.app",
  messagingSenderId: "20306625121",
  appId: "1:20306625121:web:48c3e732455220f2846020",
  measurementId: "G-0YF7EJK9YP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services so you can use them in your components
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;