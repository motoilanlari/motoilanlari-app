import React from "react";
import { Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import MessagesScreen from "../screens/MessageScreen";

const Stack = createStackNavigator();

function ChatNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={MessagesScreen}
                options={{
                    headerStyle: { backgroundColor: "#F1F1F1" },
                    headerTitle: () => (
                        <Text style={{ fontSize: 16 }}>Sohbet - Hepsi</Text>
                    ),
                    headerRight: () => (
                        <View style={{ flexDirection: "row", alignItems: "center",marginRight:18 }}>
                        </View>
                    ),
                }}
            />
        </Stack.Navigator>
    );
}

export default ChatNavigator;
