import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";  // Yönlendirme için ekledik
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faTurkishLiraSign } from "@fortawesome/free-solid-svg-icons/faTurkishLiraSign";
import Colors from "../../../Constants/colors.ts";

function Index({
                   price,
                   name,
                   description,
               }: {
    price: number;
    name: string;
    description?: string;
}) {
    const navigation = useNavigation();  // Yönlendirme için navigation hook'u ekledik

    return (
        <View style={{ padding: 20 }}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ fontSize: 30, fontWeight: "bold" }}>{price}</Text>
                    <FontAwesomeIcon
                        style={{ marginLeft: 5 }}
                        size={20}
                        color={Colors.motored}
                        icon={faTurkishLiraSign}
                    />
                </View>
            </View>

            {/* İlan Başlığı */}
            <Text style={{ fontSize: 22, fontWeight: "600", marginTop: 6 }}>
                {name}
            </Text>

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 20,
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesomeIcon
                        style={{ marginLeft: 15 }}
                        size={20}
                        color={Colors.motored}
                        icon={faUser}
                    />
                    <Text style={{ color: Colors.motored, marginLeft: 3 }}>58 dk</Text>
                </View>
            </View>

            {/* İlan Açıklaması */}
            <Text style={{ marginTop: 25 }}>{description}</Text>

            {/* Sohbet Et Butonu */}
            <TouchableOpacity
                style={{
                    backgroundColor: Colors.motored,
                    paddingVertical: 15,
                    borderRadius: 10,
                    marginTop: 30,
                    justifyContent: "center",
                    alignItems: "center",
                }}
                onPress={() => navigation.navigate("ChatScreen")}  // Sohbet ekranına yönlendirme
            >
                <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
                    Sohbet Et
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default Index;
