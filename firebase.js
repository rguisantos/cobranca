import firebase from 'firebase/app';
import 'firebase/database'; // If using Firebase database

const firebaseConfig = {
    apiKey: "AIzaSyB9I6exmk-TaCRsrZZcLBKMic2oBE5S51w",
    authDomain: "cobranca-95903.firebaseapp.com",
    projectId: "cobranca-95903",
    storageBucket: "cobranca-95903.appspot.com",
    messagingSenderId: "610758249942",
    appId: "1:610758249942:web:e10fbaf962d25806172877",
    measurementId: "G-BNVB2P0BHN"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;