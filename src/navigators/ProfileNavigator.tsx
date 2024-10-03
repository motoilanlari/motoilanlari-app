import React from "react";
//import {TouchableOpacity, Image, TextInput,Text,SafeAreaView} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProfileDetailScreen from "../screens/ProfileDetailScreen";
import {useNavigation, getFocusedRouteNameFromRoute} from "@react-navigation/native";
import MyAds from "../screens/MyAds";

const Stack = createStackNavigator();

function ProfileNavi({navigation,route}){
    const tabHiddenRoutes = ["ProfileDetailScreen","MyAds"];
    React.useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        console.log("Route Name is ",routeName)
        if(tabHiddenRoutes.includes(routeName)){
            navigation.setOptions({tabBarStyle: {height: 60,display:'none'}});
        }else {
            console.log("Aç ",routeName)
            navigation.setOptions({tabBarStyle: {height: 60,display:'true'}});
        }
    }, [navigation, route]);

    const navigation_user=useNavigation()

    return(
        <Stack.Navigator>
            <Stack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                // options={{
                //     header:()=>(
                //         <MainHeaderComponent/>
                //     )}
                // }
            />

             <Stack.Screen
                name="ProfileDetailScreen"
                component={ProfileDetailScreen}
           />
            <Stack.Screen
                name="MyAds"
                component={MyAds}
            />

        </Stack.Navigator>
    )
}
export default function ProfileNavigator ({navigation,route}){
    return <ProfileNavi navigation={navigation} route={route} />

}
