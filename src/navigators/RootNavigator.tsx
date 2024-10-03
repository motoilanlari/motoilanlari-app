import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faSearch, faMessage, faUser, faMotorcycle } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import Colors from "../../Constants/colors";
import HomeNavigator from "./HomeNavigator";
import ProfileNavigator from "./ProfileNavigator";
import SearchScreen from "../screens/SearchScreen";
import AddListingScreen from "../screens/AddListingScreen";
import ChatNavigator from "./ChatNavigator.tsx";
const Tab = createBottomTabNavigator();

function RootNavigator() {
    const navigation = useNavigation();

    const CustomTabBarButton = () => {
        return (
            <TouchableOpacity
                style={{
                    width: 70,
                    height: 70,
                    backgroundColor: Colors.motored,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 70,
                    borderWidth: 10,
                    borderColor: 'white',
                    marginTop: -20,
                }}
                onPress={() => navigation.navigate("AddListingScreen")} // Yönlendirme işlemi
            >
                <FontAwesomeIcon size={40} color={'white'} icon={faPlus} />
            </TouchableOpacity>
        );
    };

    return (
        <Tab.Navigator
            initialRouteName="Ana Sayfa"
            screenOptions={{
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: true,
                tabBarActiveTintColor: Colors.motored,
                tabBarInactiveTintColor: "#959595",
                headerShown: false,
                tabBarStyle: { height: 60 },
                tabBarLabelPosition: 'below-icon',
                tabBarLabelStyle: { marginBottom: 5, fontSize: 15 },
                tabBarIconStyle: { marginBottom: -10 },
            }}
        >
            <Tab.Screen
                name="Ana Sayfa"
                component={HomeNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <View>
                            <FontAwesomeIcon size={36} color={color} icon={faMotorcycle} />
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Ara"
                component={SearchScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <View>
                            <FontAwesomeIcon size={26} color={color} icon={faSearch} />
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="İlan Ver"
                component={AddListingScreen}
                options={{
                    tabBarButton: () => <CustomTabBarButton />
                }}
            />
            <Tab.Screen
                name="Mesajlar"
                component={ChatNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <View>
                            <FontAwesomeIcon size={26} color={color} icon={faMessage} />
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Profil"
                component={ProfileNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <View>
                            <FontAwesomeIcon size={26} color={color} icon={faUser} />
                        </View>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default RootNavigator;
