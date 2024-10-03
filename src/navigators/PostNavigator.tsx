import React from "react";
//import {TouchableOpacity, Image, TextInput,Text,SafeAreaView} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import MessageScreen from "../screens/MessageScreen";
import AddListingScreen from "../screens/AddListingScreen";
//import ProductDetailsScreen from "../screens/ProductDetailsScreen";

const Stack = createStackNavigator();

//const MainHeaderComponent = () => {
//    return (
//        <SafeAreaView
//            style={{
//                flexDirection: "row",
//                alignItems: "center",
//                width: "90%",
//                marginHorizontal: "5%",
//                marginBottom: 10,
//            }}
//        >
//            <TouchableOpacity onPress={onLogout}>
//                <Image
//                    style={{ width: 38, height: 38, borderRadius: 19 }}
//                    source={{
//                        uri: "https://www.looper.com/img/gallery/why-the-professor-from-money-heist-looks-so-familiar/intro-1587390568.jpg",
//                    }}
//                />
//            </TouchableOpacity>
//            <TextInput
//                placeholder="Ara..."
//                style={{
//                    backgroundColor: "#e5e5e5",
//                    flex: 1,
//                    marginHorizontal: 10,
//                    height: 35,
//                    borderRadius: 10,
//                    paddingLeft: "32%",
//                    fontSize: 15,
//                }}
//            />
//            <Text style={{ color: "#FF184D", fontSize: 18 }}>Filtrele</Text>
//        </SafeAreaView>
//    );
//};

function HomeNavigator(){
    return(
        <Stack.Navigator initialRouteName="Index">
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                // options={{
                //     header:()=>(
                //         <MainHeaderComponent/>
                //     )}
                // }
            />

             <Stack.Screen
                name="MessageScreen"
                component={MessageScreen}
            />


        </Stack.Navigator>
    )
}
export default HomeNavigator;
