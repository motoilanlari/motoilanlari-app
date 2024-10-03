import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import Colors from "../../../Constants/colors.ts";

function LoginScreen() {
    const [phoneNumber, setPhoneNumber] = useState('');

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="+90 Telefon numarası"
                style={styles.input}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
            />
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Giriş Yap</Text>
            </TouchableOpacity>
            <Text style={styles.orText}>E-Posta veya sosyal medya kullanarak giriş yapın?</Text>
            <View style={styles.separatorContainer}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>Veya</Text>
                <View style={styles.separatorLine} />
            </View>
            <TouchableOpacity style={styles.fbButton}>
                <FontAwesomeIcon icon={faFacebook} size={20} color="white" />
                <Text style={styles.fbButtonText}>Facebook ile Giriş Yap</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}>
                Kayıt olarak{' '}
                <Text style={styles.linkText}>Kullanım Şartları</Text> ve{' '}
                <Text style={styles.linkText}>Gizlilik Politikası</Text>'nı kabul etmiş olursunuz.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start', // İçeriği yukarı hizalar
        alignItems: 'center',
        padding: 20,
        paddingTop: 50, // Üstten boşluk bırakır
    },
    input: {
        width: '100%',
        padding: 15,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor:'#c0c0c0',
    },
    button: {
        backgroundColor: Colors.motored,
        paddingVertical: 15,
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    orText: {
        fontSize: 16,
        color: '#777',
        marginVertical: 10,
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#919191',
    },
    separatorText: {
        marginHorizontal: 10,
        fontSize: 17,
        color: '#777',
    },
    fbButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1877F2',
        padding: 15,
        width: '100%',
        borderRadius: 10,
        marginTop:10,
        alignItems: 'center', // Buton içindeki tüm içeriği yatayda ortalar
        justifyContent: 'center', // Buton içindeki tüm içeriği dikeyde ortalar
    },
    fbButtonText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10,
        fontWeight: 'bold',
        textAlign: 'center', // Metni yatayda ortalar
    },
    termsText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#777',
        marginTop: 20,
    },
    linkText: {
        color: Colors.motored,
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;
