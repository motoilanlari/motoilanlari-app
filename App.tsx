import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
//import RootNavigator from "./src/navigators/RootNavigator";

import MainNavigator from './src/navigation/MainNavigator';

import Toast from 'react-native-toast-message';
import {AuthProvider} from './src/context/AuthProvider';

import { firebase, auth, firestore, messaging } from './services/firebase'; // Firebase Global

import { useNavigationContainerRef } from '@react-navigation/native';
import { useReduxDevToolsExtension } from '@react-navigation/devtools';

export default function App(props) {

    const navigationRef = useNavigationContainerRef();
    useReduxDevToolsExtension(navigationRef);

    useEffect(() => {

        const requestPermission = async () => {
            try {
                // iOS için izin istemek
                const authorizationStatus = await messaging().requestPermission();

                if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                    authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
                    // İzin verildi
                    const fcmToken = await messaging().getToken();

                    if (fcmToken && auth().currentUser?.uid) {
                        await firestore()
                            .collection('Users') // Kullanıcı koleksiyonu
                            .doc(auth().currentUser?.uid)
                            .set({ fcmToken: fcmToken }, { merge: true });
                    }
                    console.log('FCM Token:', fcmToken);
                } else {
                    console.log('Bildirim izni verilmedi');
                }
            } catch (error) {
                console.error('Permission or token retrieval failed', error);
            }
        };

        requestPermission();

        // Foreground bildirim dinleyici
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            Alert.alert(
                remoteMessage.notification?.title || 'Bildirim',
                remoteMessage.notification?.body || 'Mesaj içeriği yok'
            );
        });

        // Background mesajlarını işlemek için listener ekle
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
            console.log('Message handled in the background!', remoteMessage);
        });

        return () => {
            unsubscribe(); // Dinleyiciyi kaldır
        };
    }, []);

    const logNavigationState = (state) => {
        if (state) {
            const route = state.routes[state.index];
            console.log('Current Screen:', route.name);
            if (route.state) {
                const nestedRoute = route.state.routes[route.state.index];
                console.log('Nested Screen:', nestedRoute.name);
            }
        }
    };

    return (
        <AuthProvider>
            <NavigationContainer
                ref={navigationRef}
                onReady={() => {
                    console.log('Navigation is ready!');
                }}
                onStateChange={(state) => logNavigationState(state)}
            >
                <MainNavigator />
                <Toast />
            </NavigationContainer>
        </AuthProvider>
    );

}
