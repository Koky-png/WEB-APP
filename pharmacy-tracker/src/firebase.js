import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDoHq5ZxC9yiUZ184OyGl65PfJzjVAGT5A",
  authDomain: "medi-mart-8f9a1.firebaseapp.com",
  projectId: "medi-mart-8f9a1",
  storageBucket: "medi-mart-8f9a1.firebasestorage.app",
  messagingSenderId: "728499491395",
  appId: "1:728499491395:web:bd2d52ae3850607fdefaf6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();