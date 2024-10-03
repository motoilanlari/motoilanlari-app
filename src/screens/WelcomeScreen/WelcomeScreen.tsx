import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from "@react-navigation/native";
import Colors from "../../../Constants/colors.ts";

function WelcomeScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Profil Simgesi */}
            <Svg width={300} height={300} viewBox="0 0 45.532 45.532" xmlns="http://www.w3.org/2000/svg">
                <Path
                    d="M22.766,0.001C10.194,0.001,0,10.193,0,22.766s10.193,22.765,22.766,22.765c12.574,0,22.766-10.192,22.766-22.765 S35.34,0.001,22.766,0.001z M22.766,6.808c4.16,0,7.531,3.372,7.531,7.53c0,4.159-3.371,7.53-7.531,7.53 c-4.158,0-7.529-3.371-7.529-7.53C15.237,10.18,18.608,6.808,22.766,6.808z M22.761,39.579c-4.149,0-7.949-1.511-10.88-4.012 c-0.714-0.609-1.126-1.502-1.126-2.439c0-4.217,3.413-7.592,7.631-7.592h8.762c4.219,0,7.619,3.375,7.619,7.592 c0,0.938-0.41,1.829-1.125,2.438C30.712,38.068,26.911,39.579,22.761,39.579z"
                    fill="#b4b4b4"
                />
            </Svg>
            {/* Oturum açmadınız yazısı */}
            <Text style={styles.titleText}>Oturum açmadınız...</Text>

            {/* Bilgilendirme yazısı */}
            <Text style={styles.infoText}>
                Tüm uygulama özelliklerine erişmek için oturum açın veya yeni bir hesap oluşturun.
            </Text>

            {/* Giriş Yap ve Kayıt Ol Butonları */}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={styles.buttonText}>Giriş Yap</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.signupButton]}
                              onPress={() => navigation.navigate('SignupScreen')}>
                <Text style={styles.buttonText}>Kayıt Ol</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 20,
        paddingTop: 50,
    },
    titleText: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        marginTop: 15,
    },
    infoText: {
        textAlign: "center",
        marginBottom: 30,
        fontSize: 16,
        color: "#777",
        marginTop: 15,
    },
    button: {
        backgroundColor: Colors.motored,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginBottom: 15,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },
    signupButton: {
        backgroundColor: "#4CAF50",
    }
});

export default WelcomeScreen;
