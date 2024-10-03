import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../../src/screens/WelcomeScreen/WelcomeScreen.tsx';  // Dosya yolu
import AuthTabs from '../screens/AuthTabsScreen/AuthTabs.tsx';
import AuthTabsScreen from "../screens/AuthTabsScreen/AuthTabs.tsx";  // Dosya yolu

const Stack = createStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="WelcomeScreen">
                <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="AuthTabs" component={AuthTabsScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
