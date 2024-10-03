import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Colors from "../../../Constants/colors"; // Renkleri çağırdığınız yer


function ChatScreen() {
    const [messages, setMessages] = useState<string[]>([]);
    const [inputMessage, setInputMessage] = useState<string>("");

    const sendMessage = () => {
        if (inputMessage.trim()) {
            setMessages([...messages, inputMessage]);
            setInputMessage("");
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
                Sohbet Ekranı
            </Text>

            {/* Mesajları Gösterme Alanı */}
            <ScrollView style={{ flex: 1 }}>
                {messages.map((msg, index) => (
                    <View
                        key={index}
                        style={{
                            alignSelf: "flex-end",
                            backgroundColor: "#e2e6e9",
                            borderRadius: 15,
                            padding: 10,
                            marginVertical: 5,
                            maxWidth: "80%",
                        }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>
                            {msg}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            {/* Mesaj Gönderme Alanı */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 10,
                    borderTopWidth: 1,
                    borderTopColor: "#EAEAEA",
                }}
            >
                <TextInput
                    placeholder="Mesajınız yazın..."
                    value={inputMessage}
                    onChangeText={setInputMessage}
                    style={{
                        borderColor: "#EAEAEA",
                        borderWidth: 1,
                        borderRadius: 20,
                        padding: 10,
                        width: "80%",
                        fontSize: 16,
                        backgroundColor: "#e2e6e9", // Gri arka plan rengi
                    }}
                />

                <TouchableOpacity
                    onPress={sendMessage}
                    style={{
                        marginLeft: 10,
                        borderRadius: 25, // Dikdörtgenin köşelerini yumuşatır
                        backgroundColor: Colors.motored, // Arkaplan rengi
                        padding: 10, // İç boşluk
                        justifyContent: "center", // Simgeyi dikey olarak ortalar
                        alignItems: "center", // Simgeyi yatay olarak ortalar
                        width: 75, // Buton genişliği
                        height: 50, // Buton yüksekliği
                    }}
                >
                    <FontAwesomeIcon
                        size={24}
                        color={"#e2e6e9"} // Simgenin rengi
                        icon={faPaperPlane}
                    />
                </TouchableOpacity>

            </View>
        </View>
    );
}

export default ChatScreen;
