// HomeStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from "../screens/SearchScreen.tsx";
import SearchResultScreen from '../screens/SearchResults/index.tsx';
import Colors from "../../Constants/colors.ts";

const Stack = createNativeStackNavigator();

export default function SearchStack() {
    return (
        <Stack.Navigator initialRouteName="SearchScreen">
            <Stack.Screen
                name="SearchScreen"
                component={SearchScreen}
                options={{ headerShown: false }}  // Header'ı gizle
            />
            <Stack.Screen
                name="SearchResultScreen"
                component={SearchResultScreen}
                options={{
                    headerShown: true,
                    title: 'Arama Sonuçları',
                    headerTintColor: Colors.motoText2,
                    headerStyle: {
                        backgroundColor: Colors.motoBoxBackgroundColor,
                    },
                    contentStyle: {
                        backgroundColor: Colors.motoBackgroundColor,
                    }
                }}  // Header'ı gizle
            />
        </Stack.Navigator>
    );
}
