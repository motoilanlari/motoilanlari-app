import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LoginScreen from '../LoginScreen/LoginScreen.tsx';
import SignupScreen from '../SignupScreen/SignupScreen.tsx';

const Tab = createMaterialTopTabNavigator();

function AuthTabsScreen() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Giriş Yap" component={LoginScreen} />
            <Tab.Screen name="Kayıt Ol" component={SignupScreen} />
        </Tab.Navigator>
    );
}

export default AuthTabsScreen;
