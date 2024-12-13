import React, {createContext, useContext, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Auth durumunu dinleme
        const unsubscribe = auth().onAuthStateChanged(async user => {
            if (user) {
                try {
                    const {uid, email, phoneNumber, displayName} = user;

                    // FCM token alma
                    const fcmToken = await messaging().getToken();

                    // Firestore'dan kullanıcı verisi alma veya kaydetme
                    const userDoc = await firestore().collection('Users').doc(uid).get();
                    if (userDoc.exists) {
                        const firestoreData = userDoc.data();
                        setCurrentUser({
                            uid,
                            email,
                            phoneNumber,
                            displayName,
                            fcmToken, // Token'ı kullanıcıya ekleme
                            ...firestoreData,
                        });
                    } else {
                        // Firestore'da kullanıcı yoksa yeni bir belge oluştur
                        await firestore().collection('Users').doc(uid).set({
                            email,
                            phoneNumber,
                            displayName,
                            fcmToken, // Token'ı kaydet
                            createdAt: firestore.FieldValue.serverTimestamp(),
                        });

                        setCurrentUser({uid, email, phoneNumber, displayName, fcmToken});
                    }
                } catch (error) {
                    console.error('Kullanıcı verileri alınırken hata oluştu:', error);
                    Alert.alert('Bir hata oluştu', 'Lütfen tekrar deneyin.');
                }
            } else {
                // Kullanıcı çıkış yaptıysa veya yoksa currentUser'ı null yap
                setCurrentUser(null);
            }
        });

        return () => unsubscribe(); // Temizlik için aboneliği iptal et
    }, []);

    return (
        <AuthContext.Provider value={currentUser}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
