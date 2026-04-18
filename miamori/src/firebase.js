import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAkC-9xg9OJ5HeyZeVU8I5KLQF00AmY0LQ",
  authDomain: "miamori-app.firebaseapp.com",
  databaseURL: "https://miamori-app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "miamori-app",
  storageBucket: "miamori-app.firebasestorage.app",
  messagingSenderId: "537849787697",
  appId: "1:537849787697:web:73170b6228e90c7c06ac10"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);