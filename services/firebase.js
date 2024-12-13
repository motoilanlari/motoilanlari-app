import firebase from '@react-native-firebase/app';
import Config from 'react-native-config';
import {config} from "@fortawesome/fontawesome-svg-core";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import messaging from '@react-native-firebase/messaging';
import storage from "@react-native-firebase/storage";
import database from "@react-native-firebase/database";

const firebaseConfig = {
    apiKey: Config.FIREBASE_API_KEY,
    authDomain: Config.FIREBASE_AUTH_DOMAIN,
    databaseURL: Config.FIREBASE_DATABASE_URL,
    projectId: Config.FIREBASE_PROJECT_ID,
    storageBucket: Config.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: Config.FIREBASE_MESSAGING_SENDER_ID,
    appId: Config.FIREBASE_APP_ID,
    measurementId: Config.FIREBASE_MEASUREMENT_ID,
};

// Firebase'i başlatıyoruz, sadece bir kez yapılmalı
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

//console.log('Firebase Başlatıldı');
export {firebase, auth, firestore, messaging, storage, database }; // FirebaseApp'i dışarıya aktar
