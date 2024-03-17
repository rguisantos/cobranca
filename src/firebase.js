import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyB9I6exmk-TaCRsrZZcLBKMic2oBE5S51w",
    authDomain: "cobranca-95903.firebaseapp.com",
    databaseURL: "https://cobranca-95903-default-rtdb.firebaseio.com", // Add your database URL here
    projectId: "cobranca-95903",
    storageBucket: "cobranca-95903.appspot.com",
    messagingSenderId: "610758249942",
    appId: "1:610758249942:web:e10fbaf962d25806172877",
    measurementId: "G-BNVB2P0BHN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { app, db };