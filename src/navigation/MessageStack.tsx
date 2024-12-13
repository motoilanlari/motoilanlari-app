// ChatStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ChatScreen from '../screens/ChatScreen/index.tsx';
import ChatItemScreen from '../screens/MessageScreen/index.tsx';
import MessagesScreen from "../screens/MessageScreen";
import {Text, View} from "react-native";
import Colors from "../../Constants/colors.ts";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function MessageStack() {
    return (
        <Stack.Navigator screenOptions={{
            cardStyle: {
                backgroundColor: Colors.motoBackgroundColor, // Tüm ekranlar için kart arka plan rengi
            },
            headerStyle: {
                backgroundColor: Colors.motoBoxBackgroundColor,
                shadowColor: Colors.motoBoxBackgroundColor,
                elevation: 4,
            },
            headerTintColor: Colors.motoText1,                // Başlık metin ve ikon rengi
        }} initialRouteName={'Messages'}>
            {/* Sohbet Ana Sayfası */}
            <Stack.Screen
                name="Messages" // Benzersiz bir isim kullanın
                component={MessagesScreen}
                options={{
                    headerBackVisible: true,
                    headerTitle: 'Mesajlar'
                }}
            />
            {/* Sohbet Detay Sayfası */}
            <Stack.Screen
                name="ChatScreen"
                component={ChatScreen}
                options={{
                    headerBackVisible: true,
                    headerTitle: 'Mesaj',
                    headerStyle: {
                        backgroundColor: Colors.motoBoxBackgroundColor
                    }, // Özel header stili
                    contentStyle: {
                        backgroundColor: Colors.motoBackgroundColor,
                    }
                }}
            />
        </Stack.Navigator>
    );
}
