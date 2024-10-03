import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,useWindowDimensions } from 'react-native';
import Colors from "../../../Constants/colors.ts";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faFacebook} from "@fortawesome/free-brands-svg-icons";
import { SceneMap } from 'react-native-tab-view';

const FirstRoute = () => (
    <View style={{ flex: 1, backgroundColor: '#ff4081' }} />
);

const SecondRoute = () => (
    <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
);

const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
});

function SignupScreen() {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'First' },
        { key: 'second', title: 'Second' },
    ]);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [referralCode, setReferralCode] = useState('');

    return (

        <View style={styles.container}>
            <TextInput
                placeholder="+90 Telefon numarası"
                style={styles.input}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
            />
            <TextInput
                placeholder="Referans Kodu (Opsiyonel)"
                style={styles.input}
                value={referralCode}
                onChangeText={setReferralCode}
            />
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Kayıt Ol</Text>
            </TouchableOpacity>
            <View style={styles.separatorContainer}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>Veya</Text>
                <View style={styles.separatorLine} />
            </View>
            <TouchableOpacity style={styles.fbButton}>
                <FontAwesomeIcon icon={faFacebook} size={20} color="white" />
                <Text style={styles.fbButtonText}>Facebook ile Kayıt Ol</Text>
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
        paddingTop: 50, // Üstten boşluk
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
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#919191FF',
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
        justifyContent: 'center', // İçeriği hem yatay hem dikeyde ortalar
    },
    fbButtonText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10,
        fontWeight: 'bold',
        textAlign: 'center',
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

export default SignupScreen;
