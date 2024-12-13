import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import {initializeApp} from "firebase/app";
import {getStorage} from "firebase/storage";
import {getDatabase} from 'firebase/database'; // Firebase Realtime Database

// Firebase uygulamasının başlatılması
export const firebaseConfig = {
    apiKey: "AIzaSyAhLPgeK2MHkTPmED7F-4Sot-U-JY9nNZ8",
    authDomain: "motoilanlari-f83d3.firebaseapp.com",
    projectId: "motoilanlari-f83d3",
    storageBucket: "motoilanlari-f83d3.appspot.com",
    messagingSenderId: "713519532496",
    appId: "1:713519532496:web:691e36c7f6e6fb52e711d5"
};
const app = initializeApp(firebaseConfig);

// Firebase'in başlatılıp başlatılmadığını kontrol etmenize gerek yok.
// React Native Firebase kendisi başlatma işlemini halleder.
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Firestore'u ve Auth'u dışa aktarıyoruz
const db = firestore();
const storage = getStorage(app);
const realtimeDb = getDatabase(app); // Realtime Database'i başlatıyoruz

export {db, storage, realtimeDb, firebase, auth};
