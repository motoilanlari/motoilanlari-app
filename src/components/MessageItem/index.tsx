import React from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import { Message } from "../../models";

import { useNavigation } from '@react-navigation/native';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import Colors from "../../../Constants/colors.ts";
import { faExclamation, faCheck } from "@fortawesome/free-solid-svg-icons"; // useNavigation hook'u

type MessageItemProps = {
    item: Message;
};

function MessageItem({ item }: MessageItemProps) {
    const navigation = useNavigation();  // navigation nesnesini aldık

    return (
        <TouchableOpacity
            style={styles.messageItem}
            onPress={() => navigation.navigate("ChatScreen")}  // Sohbet ekranına yönlendirme
        >
            <View>
                <Image
                    source={{ uri: item.image }}
                    style={{ width: 85, height: 85, borderRadius: 12 }}
                />
                <View
                    style={{
                        height: 36,
                        width: 36,
                        borderRadius: 18,
                        backgroundColor: "#A3CE72",
                        position: "absolute",
                        bottom: 0,
                        right: -16,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>S</Text>
                </View>
            </View>
            <View style={{ flex: 1, marginLeft: 20, flexDirection: "column" }}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontWeight: "600", fontSize: 16 }}>
                        {item.productName.length > 25
                            ? item.productName.substring(0, 22) + "..."
                            : item.productName}
                    </Text>
                    <Text style={{ color: "#8B8B8B", fontWeight: '500' }}>+1 ay</Text>
                </View>
                <Text style={{ fontSize: 15, marginTop: 5 }}>{item.sellerName}</Text>
                {item.situation == "Satıldı" ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                        <FontAwesomeIcon style={{ marginRight: 1 }} color="#A0A0A0" icon={faExclamation} />

                        <Text style={{ fontSize: 15, color: '#777777' }}>Artık mevcut değil</Text>
                    </View>
                ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                        <FontAwesomeIcon style={{ marginRight: 1 }} color={Colors.motored} icon={faCheck} />
                        <Text style={{ fontSize: 15, color: '#F24E61', fontWeight: '500' }}>Satıldı</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    messageItem: {
        padding: 15,
        borderBottomWidth: 1.5,
        borderColor: "#e2e2e2",
        flexDirection: "row",
        alignItems: "center",
    },
});

export default MessageItem;
