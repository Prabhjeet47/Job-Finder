import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAxu-mNOTRHKdbmXElMaZatMuDS1Ouh_vM",
  authDomain: "jobfinder-32064.firebaseapp.com",
  projectId: "jobfinder-32064",
  storageBucket: "jobfinder-32064.appspot.com",
  messagingSenderId: "306066184763",
  appId: "1:306066184763:web:e36b05ab4d49e8ea4a5a1e",
  storageBucket: "gs://jobfinder-32064.appspot.com"
};

export const app = initializeApp(firebaseConfig);