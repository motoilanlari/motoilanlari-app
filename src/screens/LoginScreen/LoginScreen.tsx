import React, {useRef, useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Colors from '../../../Constants/colors.ts';
import Svg, {Path} from 'react-native-svg';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import auth from '@react-native-firebase/auth';

import Toast from 'react-native-toast-message';

function LoginScreen() {
    const [confirm, setConfirm] = useState(null);
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']); // 6 rakam için array
    const inputRefs = useRef([]); // Her bir kutu için referanslar
    const [phoneNumber, setPhoneNumber] = useState('+90 5'); // Telefon numarası
    const [onLoginButton, setOnLoginButtonStatus] = useState(false);
    const maskedPhoneNumber = `${phoneNumber.slice(0, 5)}****${phoneNumber.slice(-2)}`; // Telefon numarası maskeleme

    const handlePhoneNumberChange = (text) => {
        setOnLoginButtonStatus(false);
        if (!text.startsWith('+90 5')) {
            setPhoneNumber('+90 ');
        } else {
            if (text.length === 14) {
                setOnLoginButtonStatus(true);
            }
            setPhoneNumber(text);
        }
    };

    async function onGoogleButtonPress() {
        await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
        const {idToken} = await GoogleSignin.signIn();
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        return auth().signInWithCredential(googleCredential);
    }

    async function signInWithPhoneNumber(phoneNumber) {
        try {
            const confirmation = await auth().signInWithPhoneNumber(phoneNumber, true);
            setConfirm(confirmation);
        } catch (error) {
            console.log(error);
        }
    }

    const handleVerificationCodeChange = (text, index) => {
        if (/^\d$/.test(text)) {
            const newCode = [...verificationCode];
            newCode[index] = text;
            setVerificationCode(newCode);

            if (index < 5 && text) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    async function confirmVerificationCode() {
        try {
            await confirm.confirm(verificationCode.join(''));
            Toast.show({
                type: 'success',
                text1: 'Doğrulama Başarılı',
                text2: 'Telefon numarası doğrulandı.',
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Hatalı Kod!',
                text2: 'Doğrulama kodu hatalı!',
            });

            console.log('Invalid code.');
        }
    }

    if (!confirm) {
        return (
            <View style={styles.container}>
                <Toast/>
                <TextInput
                    placeholder="+90 Telefon numarası"
                    style={styles.input}
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={handlePhoneNumberChange}
                    maxLength={14}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => signInWithPhoneNumber(phoneNumber)}
                    disabled={!onLoginButton}
                >
                    <Text style={styles.buttonText}>Giriş Yap</Text>
                </TouchableOpacity>

                <Text style={styles.orText}>E-Posta veya sosyal medya kullanarak giriş yapın?</Text>
                <View style={styles.separatorContainer}>
                    <View style={styles.separatorLine}/>
                    <Text style={styles.separatorText}>Veya</Text>
                    <View style={styles.separatorLine}/>
                </View>
                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
                >
                    <Svg
                        width="25px"
                        height="25px"
                        viewBox="-3 0 262 262"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="xMidYMid"
                    >
                        <Path
                            d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                            fill="#4285F4"
                        />
                        <Path
                            d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                            fill="#34A853"
                        />
                        <Path
                            d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                            fill="#FBBC05"
                        />
                        <Path
                            d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                            fill="#EB4335"
                        />
                    </Svg>
                    <Text style={styles.googleButtonText}>Google ile Giriş Yap</Text>
                </TouchableOpacity>

                <Text style={styles.termsText}>
                    Kayıt olarak{' '}
                    <Text style={styles.linkText}>Kullanım Şartları</Text> ve{' '}
                    <Text style={styles.linkText}>Gizlilik Politikası</Text>'nı kabul etmiş olursunuz.
                </Text>
            </View>
        );
    } else {
        return (
            <View style={styles.container1}>
                {/* Maskelenmiş telefon numarası */}
                <Text style={styles.phoneNumberText}>{maskedPhoneNumber}</Text>
                <Text style={styles.instructionText}>Numarasına gönderilen onay kodunu giriniz</Text>

                {/* 6 adet giriş kutusu */}
                <View style={styles.codeInputContainer}>
                    {verificationCode.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => inputRefs.current[index] = ref}
                            value={digit}
                            onChangeText={(text) => handleVerificationCodeChange(text, index)}
                            style={styles.codeInput}
                            keyboardType="number-pad"
                            maxLength={1} // Her kutuya sadece tek bir rakam
                            onKeyPress={({nativeEvent}) => {
                                if (nativeEvent.key === 'Backspace') {
                                    const updatedVerificationCode = [...verificationCode]; // Mevcut kodların kopyasını al
                                    updatedVerificationCode[index] = '';
                                    setVerificationCode(updatedVerificationCode);

                                    if (index > 0) {
                                        inputRefs.current[index - 1].focus();
                                    }
                                }
                            }}
                        />
                    ))}
                </View>

                {/* Doğrula butonu */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => confirmVerificationCode()}
                    disabled={verificationCode.some((digit) => digit === '')}
                >
                    <Text style={styles.buttonText}>Onayla</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
    },
    input: {
        width: '100%',
        padding: 15,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#c0c0c0',
    },
    button: {
        backgroundColor: Colors.motored,
        paddingVertical: 15,
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    orText: {
        marginTop: 10,
        color: '#7e7e7e',
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
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
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 15,
        width: '100%',
        borderRadius: 10,
        marginTop: 10,
        justifyContent: 'center',
    },
    googleButtonText: {
        marginLeft: 10,
        fontSize: 18,
        color: '#555',
    },
    termsText: {
        marginTop: 20,
        color: '#7e7e7e',
        textAlign: 'center',
    },
    linkText: {
        color: Colors.primary,
        textDecorationLine: 'underline',
    },
    container1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    phoneNumberText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    instructionText: {
        fontSize: 16,
        marginBottom: 20,
    },
    codeInputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    codeInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        width: 40,
        height: 40,
        textAlign: 'center',
        fontSize: 18,
        marginHorizontal: 5,
    },
});
