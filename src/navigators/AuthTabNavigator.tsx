// src/navigation/AuthTabNavigator.tsx
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LoginScreen from '../screens/LoginScreen/LoginScreen.tsx';
import SignupScreen from '../screens/SignupScreen/SignupScreen.tsx';
import Colors from "../../Constants/colors.ts";

const Tab = createMaterialTopTabNavigator();

function AuthTabNavigator() {
    return (
        <Tab.Navigator
            initialRouteName="Giriş Yap"
            screenOptions={{
                tabBarActiveTintColor: Colors.motored,
                tabBarInactiveTintColor: '#777',
                tabBarIndicatorStyle: {
                    backgroundColor: Colors.motored,
                },
                tabBarLabelStyle: {
                    fontSize: 16,
                },
                tabBarStyle: {
                    backgroundColor: '#F8F8F8',
                },
            }}
        >
            <Tab.Screen name="Giriş Yap" component={LoginScreen} />
            <Tab.Screen name="Kayıt Ol" component={SignupScreen} />
        </Tab.Navigator>
    );
}

export default AuthTabNavigator;
