import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore/lite';

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
const db = getFirestore(app);

async function getClientes(db) {
    const clientesCollection = collection(db, 'cad_cliente');
    const clienteSnapshot = await getDocs(clientesCollection);
    const clienteList = clienteSnapshot.docs.map(doc => doc.data());
    return clienteList;
}

async function addCliente(db) {
    const docRef = await addDoc(collection(db, "cad_cliente"),data);
    return docRef;
}

export { app, db, getClientes, addCliente };