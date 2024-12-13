// AddSctack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddScreen from "../screens/AddScreen";
import InstagramScreen from "../screens/InstagramScreen";

import Colors from "../../Constants/colors.ts";
import {TouchableOpacity} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faAngleLeft, faArrowLeft, faArrowLeftLong, faTimes} from "@fortawesome/free-solid-svg-icons";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
    return (
        <Stack.Navigator initialRouteName="AddScreen">
            <Stack.Screen
                name="AddScreen"
                component={AddScreen}
                options={({ navigation }) => ({
                    title: 'Yeni İlan Ekle',
                    headerTintColor: Colors.motoText1,
                    headerStyle: { backgroundColor: Colors.motoBoxBackgroundColor, },
                    headerShown: true,
                    contentStyle: {
                        backgroundColor: Colors.motoBackgroundColor,
                        color: Colors.motoText1
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={
                                () => navigation.navigate({
                                    'name': 'Home'
                                })
                            }
                            style={{
                                borderWidth: 0,
                                paddingHorizontal: 15,
                                paddingVertical: 15,
                                marginLeft: -10,
                                marginRight: 15
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} size={24} color={Colors.motoText1} />
                        </TouchableOpacity>
                    ),
                })}
            />
            {/* Instagram Bağlantısı */}
            <Stack.Screen
                name="InstagramScreen"
                component={InstagramScreen}
                options={{
                    title: 'Instagram Hesabımız', // Başlık
                }}
            />
        </Stack.Navigator>
    );
}
