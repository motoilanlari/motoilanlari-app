import React from 'react'
import {Text, TouchableOpacity, View} from "react-native"
import { createStackNavigator } from "@react-navigation/stack";
import PostScreen from "../screens/PostScreen"
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faShare} from "@fortawesome/free-solid-svg-icons/faShare";
import {faXmark} from '@fortawesome/free-solid-svg-icons/faXmark';
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import {useNavigation, getFocusedRouteNameFromRoute} from "@react-navigation/native";
import ChatScreen from "../screens/ChatScreen";
import AddListingScreen from "../screens/AddListingScreen";
import ProfileScreen from '../screens/ProfileScreen';
import WelcomeScreen from '../screens/WelcomeScreen/WelcomeScreen.tsx'; // Doğru dosya yolu
import SignupScreen from '../screens/SignupScreen/SignupScreen.tsx';
import LoginScreen from '../screens/LoginScreen/LoginScreen.tsx';
import AuthTabsScreen from "../screens/AuthTabsScreen/AuthTabs.tsx";
import TabViewExample from "../screens/AuthTabsScreen/AuthTabs.tsx";

const Stack= createStackNavigator()


function MyStack({navigation,route}) {
    const tabHiddenRoutes = ["ProductDetailsScreen"];
    React.useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        console.log("Route Name is ",routeName)
        if(tabHiddenRoutes.includes(routeName)){
            navigation.setOptions({tabBarStyle: {height:60, display:'none'}});
        }else {
            console.log("Aç ",routeName)
            navigation.setOptions({tabBarStyle: {height: 60, display:'true'}});
        }
    }, [navigation, route]);

    const navigation_user=useNavigation()
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={PostScreen}
                options={{
                    header:()=>(null)//Headerı Yok eder

                }}
            />
            <Stack.Screen
                name="ProductDetailsScreen"
                component={ProductDetailsScreen}
                options={{
                    headerTransparent:true,
                    headerRight: () =>(
                        <View style={{marginRight:20,backgroundColor:'rgba(0,0,0,0.5)',height:36,width:36,flexDirection:'row',justifyContent:'center',alignItems:'center',borderRadius:18}}>
                            <FontAwesomeIcon size={20} color={'#FEFDFC'} icon={faShare} />

                        </View>

                    ),
                    headerLeft: () => (
                     <TouchableOpacity
                         onPress={()=>navigation_user.goBack()}
                         style={{marginLeft:20,backgroundColor:'rgba(0,0,0,0.5)',height:36,width:36,flexDirection:'row',justifyContent:'center',alignItems:'center',borderRadius:18}}>

                         <FontAwesomeIcon size={20} color={'#FEFDFC'} icon={faXmark} />

                     </TouchableOpacity>
                    ),
                    headerTitle:()=>(null)//Header Yazısını Yok eder
                }}
            />
            <Stack.Screen
                name="ChatScreen"
                component={ChatScreen}
                options={{ title: 'Sohbet' }}
            />
            <Stack.Screen
                name="AddListingScreen"
                component={AddListingScreen}
                options={{ headerShown: false }} // İsteğe bağlı header ayarları
            />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="SignupScreen" component={SignupScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen}/>
            <Stack.Screen name="AuthTabsScreen" component={AuthTabsScreen} />

        </Stack.Navigator>
    )
}
export default function PostNavigation({navigation,route})
{
    return <MyStack navigation={navigation} route={route} />
}
