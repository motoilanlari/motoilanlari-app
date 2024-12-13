import React, {useEffect, useState} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Colors from '../../Constants/colors.ts';

import ProfileScreen from '../screens/ProfileScreen';
import ProfileDetailScreen from "../screens/ProfileDetailScreen";
import MyAdsScreen from "../screens/MyAds";
import MyAdsDetailScreen from '../screens/MyAdsDetails';


import {ActivityIndicator, TouchableOpacity, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {getFocusedRouteNameFromRoute} from "@react-navigation/native";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen/LoginScreen.tsx";
import SignupScreen from "../screens/SignupScreen/SignupScreen.tsx";
import ContactPage from "../screens/ContactPage";
import WelcomeScreenStep2 from "../screens/WelcomeScreenStep2/WelcomeScreenStep2.tsx";

import {auth} from "../../services/firebase";


const Stack = createNativeStackNavigator();

export default function ProfileStack({navigation, route}) {

    const [isAuthenticated, setIsAuthenticated] = useState(null); // Kullanıcı oturum durumu
    const tabHiddenRoutes = ['ProfileDetailScreen', 'MyAds', 'SignupScreen', 'LoginScreen'];

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((user) => {
            if (user) {
                setIsAuthenticated(true);  // Kullanıcı oturum açmış
            } else {
                setIsAuthenticated(false); // Kullanıcı oturum açmamış
            }
        });

        return unsubscribe; // Dinleyici temizleme
    }, []);

    React.useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (tabHiddenRoutes.includes(routeName)) {
            //navigation.setOptions({tabBarStyle: {height: 60, display: 'none'}});
        } else {
            //navigation.setOptions({tabBarStyle: {height: 60, display: 'true'}});
        }
    }, [navigation, route]);

    // Firebase oturum durumunu kontrol ederken bir yükleniyor göstergesi ekleyelim
    if (isAuthenticated === null) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#0000ff"/>
            </View>
        );
    }

    return (
        <Stack.Navigator
            screenOptions={{
                cardStyle: {
                    backgroundColor: Colors.motoBackgroundColor, // Tüm ekranlar için kart arka plan rengi
                },
                headerStyle: {
                    backgroundColor: Colors.motoBoxBackgroundColor, // Tüm ekranların başlık arka plan rengi
                    shadowColor: Colors.motoBoxBackgroundColor,     // iOS için gölge rengi
                    elevation: 4,                                  // Android için gölge yoğunluğu
                },
                headerTintColor: Colors.motoText1,                // Başlık metin ve ikon rengi
            }}
        >
            {isAuthenticated ? (
                <>
                    {/* Authenticated kullanıcılar için */}
                    <Stack.Screen
                        name="ProfileScreen"
                        component={ProfileScreen}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="ProfileDetailScreen"
                        component={ProfileDetailScreen}
                        options={{
                            title: 'Profil Detayları',
                        }}
                    />
                    <Stack.Screen
                        name="MyAdsScreen"
                        component={MyAdsScreen}
                        options={{
                            title: 'İlanlarım',
                            headerBackVisible: true,
                        }}
                    />
                    <Stack.Screen
                        name="MyAdsDetailScreen"
                        component={MyAdsDetailScreen}
                        options={{
                            title: 'İlan Düzenle',
                            headerBackVisible: true,
                        }}
                    />
                </>
            ) : (
                <>
                    {/* Giriş yapmamış kullanıcılar için */}
                    <Stack.Screen
                        name="WelcomeScreen"
                        component={WelcomeScreen}
                        options={{
                            title: 'Hoşgeldiniz',
                            backgroundColor: Colors.motoBackgroundColor, // Tüm ekranlar için kart arka plan rengi
                        }}
                    />
                    <Stack.Screen
                        name="LoginScreen"
                        component={LoginScreen}
                        options={{ title: 'Giriş Yap' }}
                    />
                    <Stack.Screen
                        name="SignupScreen"
                        component={SignupScreen}
                        options={{ title: 'Kayıt Ol' }}
                    />
                    <Stack.Screen
                        name="ContactPage"
                        component={ContactPage}
                        options={{ title: 'Bize Ulaşın' }}
                    />
                    <Stack.Screen
                        name="WelcomeScreenStep2"
                        component={WelcomeScreenStep2}
                        options={{ title: 'Tanışalım' }}
                    />
                </>
            )}
        </Stack.Navigator>
    );


}
