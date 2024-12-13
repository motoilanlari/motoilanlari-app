import React, {useEffect, useState} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeStack from './HomeStack.tsx';
import SearchScreen from '../screens/SearchScreen.tsx';
import AddStack from './AddStack.tsx';
import MessageStack from './MessageStack.tsx';
import ProfileStack from './ProfileStack.tsx';

//import SearchScreen from '../../../menuTest/src/screens/SearchScreen.tsx';
//import CreateListingScreen from '../../../menuTest/src/screens/CreateListingScreen.tsx';
import {getFocusedRouteNameFromRoute, useNavigation} from "@react-navigation/native";
import Colors from "../../Constants/colors.ts";
//import HomeNavigator from "../navigators/HomeNavigator.tsx";
import {TouchableOpacity, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faMessage, faMotorcycle, faPlus, faSearch, faUser} from "@fortawesome/free-solid-svg-icons";
import SearchNavigator from "../navigators/SearchNavigator.tsx";
import AddNavigator from "../navigators/AddNavigator.tsx";
import ChatNavigator from "../navigators/ChatNavigator.tsx";
import ChatScreen from "../screens/ChatScreen";
import MessageScreen from "../screens/MessageScreen";
//import ProfileNavigator from "../navigators/ProfileNavigator.tsx";

import LoginStack from "./LoginStack.tsx";

import {useAuth} from "../context/AuthProvider";
import {Color} from "@react-native-google-signin/google-signin/lib/typescript/src/buttons/statics";
import SearchStack from "./SearchStack.tsx";
import {auth} from "../../services/firebase.js";

const Tab = createBottomTabNavigator();

export default function MainNavigator() {

    const navigation = useNavigation();

    const userIsAuth = useAuth();
    const [newMessage, setNewMessage] = useState(false);

    const hiddenRoutes = [
        'HomeDetailScreen',
        'MyAds',
        'ProfileDetailScreen',
        'MyAdsDetailScreen',
        'ChatScreen',
        'AddScreen',
    ]; // Tab bar'ın gizlenmesi gereken ekranlar

    const shouldTabBarBeVisible = (route) => {
        const routeName = getFocusedRouteNameFromRoute(route) || '';
        return !hiddenRoutes.includes(routeName); // Tab bar'ın görünürlüğü
    };

    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarStyle: shouldTabBarBeVisible(route) ? {
                        position: 'relative',
                        borderRadius: 0,
                        paddingVertical: 10,
                        marginTop: 0,
                        marginBottom: 0,
                        height: 50,
                        backgroundColor: Colors.motoTabBackgroundColor,
                    }
                    : { display: 'none' }, // Tab bar gizleniyor
                tabBarActiveTintColor: Colors.motoTabActiveColor,
                tabBarInactiveTintColor: Colors.motoTabInActiveColor,
                tabBarLabelStyle: {
                    fontSize: 12, // Yazı boyutu (isteğe bağlı)
                    marginBottom: 0,
                    paddingHorizontal: 0,
                    paddingVertical: 3,
                },
                tabBarIconStyle: {
                    marginBottom: 3,
                },
                headerShown: false,
                cardStyle: {
                    backgroundColor: Colors.motoBackgroundColor, // Genel arka plan rengi
                }
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{
                    tabBarLabel: 'Ana Sayfa',
                    tabBarIcon: ({color}) => (
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <FontAwesomeIcon
                                size={32}
                                color={color}
                                icon={faMotorcycle} />
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Search"
                component={SearchStack}
                options={{
                    tabBarLabel: 'Ara',
                    tabBarIcon: ({color}) => (
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <FontAwesomeIcon size={24}
                                             color={color}
                                             icon={faSearch} />
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Add"
                component={userIsAuth ? AddStack : ProfileStack} //
                options={{
                    tabBarLabel: 'İlan Ver',
                    tabBarIcon: ({color}) => (
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <TouchableOpacity
                                style={{
                                    width: 50,
                                    height: 50,
                                    backgroundColor: Colors.motored,
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 70,
                                    borderWidth: 5,
                                    borderColor: Colors.motoTabAdPlusIconColor,
                                    marginTop: -30,
                                    // Gölge stil özellikleri
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.15,
                                    shadowRadius: 3.5,
                                    elevation: 5,
                                }}
                                onPress={() => navigation.navigate('Add', { screen: 'AddScreen' })} // Nested navigator'a geçiş
                            >
                                <FontAwesomeIcon size={40}
                                                 color={color}
                                                 icon={faPlus} />
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Message"
                component={userIsAuth ? MessageStack : ProfileStack}
                options={{
                    tabBarLabel: 'Mesajlar',
                    tabBarIcon: ({color}) => (
                        <TouchableOpacity
                            onPress={ () =>
                                userIsAuth ? navigation.navigate('Message') : navigation.navigate('Profile')
                            }
                        >
                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <FontAwesomeIcon
                                        size={24}
                                        color={color}
                                        icon={faMessage} />
                            </View>
                        </TouchableOpacity>
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={userIsAuth ? ProfileStack : ProfileStack}
                options={{
                    tabBarLabel: 'Profil',
                    tabBarIcon: ({color}) => (
                        <TouchableOpacity
                            onPress={ () =>
                                userIsAuth ? navigation.navigate('Messages') : navigation.navigate('Profile')
                            }
                        >
                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                <FontAwesomeIcon
                                    size={24}
                                    color={color}
                                    icon={faUser} />
                            </View>
                        </TouchableOpacity>
                    ),
                }}
            />
        </Tab.Navigator>
    );

}
