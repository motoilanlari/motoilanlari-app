// HomeStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen/index.tsx';
import HomeDetailScreen from '../screens/HomeDetailScreen.tsx';
import MessagesScreen from "../screens/MessageScreen";
import ChatScreen from "../screens/ChatScreen";
import Colors from "../../Constants/colors.ts";
import WelcomeScreen from "../screens/WelcomeScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false, contentStyle: {
                backgroundColor: Colors.motoBackgroundColor
            }}}  // Header'ı gizle
      />
      <Stack.Screen
        name="HomeDetailScreen"
        component={HomeDetailScreen}
        options={{
            headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
