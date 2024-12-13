import React, {useEffect, useRef, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../../../Constants/colors.ts';
import Svg, { Path } from 'react-native-svg';
import Toast from 'react-native-toast-message';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faApple } from '@fortawesome/free-brands-svg-icons';

import { auth, firestore } from '../../../services/firebase';
import {
    GoogleSignin,
    statusCodes,
    isErrorWithCode,
    isSuccessResponse,
    isNoSavedCredentialFoundResponse,
} from '@react-native-google-signin/google-signin';


function WelcomeScreen() {
    const [confirm, setConfirm] = useState(null);
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']); // 6 rakam için array
    const inputRefs = useRef([]); // Her bir kutu için referanslar
    const [phoneNumber, setPhoneNumber] = useState('+90 '); // Telefon numarası
    const [onLoginButton, setOnLoginButtonStatus] = useState(false);
    const maskedPhoneNumber = `${phoneNumber.slice(0, 5)}****${phoneNumber.slice(-2)}`; // Telefon numarası maskeleme

    const [SocialDisplayName, setSocialDisplayName] = useState('');
    const [SocialEmail, setSocialEmail] = useState('');

    async function onAuthStateChanged(user) {
        if (user) {
        } else {
            console.log('User Hatası!');
        }
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    //Google SignIn Configure
    GoogleSignin.configure({
        webClientId: '713519532496-jermuanee2ab7s2sgk0vtbggl8vfaobq.apps.googleusercontent.com',
    });

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

    async function onAppleButtonPress() {
        // Start the sign-in request
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            // As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
            // See: https://github.com/invertase/react-native-apple-authentication#faqs
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });

        // Ensure Apple returned a user identityToken
        if (!appleAuthRequestResponse.identityToken) {
            throw new Error('Apple Sign-In failed - no identify token returned');
        }

        // Create a Firebase credential from the response
        const { identityToken, nonce } = appleAuthRequestResponse;
        const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

        // Sign the user in with the credential
        return auth().signInWithCredential(appleCredential);
    }

    const signInWithGoogle = async () => {
        try {
            // Google ile giriş yap
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            // Google ile başarılı bir şekilde giriş yaptıysa, Firebase Authentication'a yönlendir
            const googleCredential = auth.GoogleAuthProvider.credential(userInfo.data?.idToken);

            // Firebase'e giriş yap
            await auth().signInWithCredential(googleCredential);

            console.log(userInfo.data?.user.givenName + ' ' + userInfo.data?.user.familyName);

            //setSocialDisplayName(userInfo.data?.user.givenName + ' ' + userInfo.data?.user.familyName);
            //setSocialEmail(userInfo.data?.user.email);

            const userRef = firestore().collection('Users').doc(auth().currentUser?.uid);
            try {
                const userDoc = await userRef.get();
                const userData = userDoc.data();

                if (!userData?.name) {
                    // Eğer 'name' null veya yoksa, Google girişinden gelen 'displayName' ile güncelle
                    await userRef.set({
                        name: userInfo.data?.user.givenName + ' ' + userInfo.data?.user.familyName,  // Google'dan gelen displayName
                        email: userInfo.data?.user.email,
                    }, {merge: true});  // Merge kullanarak sadece 'name' alanını güncelle
                } else {
                    //console.log('Kullanıcı adı zaten mevcut:', userData.name);
                }
            } catch (error) {
                console.error("Güncelleme hatası: ", error);
                //Alert.alert('Hata', 'Bilgiler güncellenirken bir hata oluştu.');
            }

            // Kullanıcıyı başarılı bir şekilde giriş yaptıktan sonra yönlendirme veya diğer işlemler
            console.log('Kullanıcı başarıyla giriş yaptı:', userInfo);
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('Kullanıcı giriş işleminden vazgeçti');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('Giriş işlemi devam ediyor...');
            } else {
                console.error('Hata:', error);
            }
        }
    };

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
                <Toast />
                {/* Profil Simgesi */}
                <Svg width={100} height={100} viewBox="0 0 45.532 45.532" xmlns="http://www.w3.org/2000/svg">
                    <Path
                        d="M22.766,0.001C10.194,0.001,0,10.193,0,22.766s10.193,22.765,22.766,22.765c12.574,0,22.766-10.192,22.766-22.765 S35.34,0.001,22.766,0.001z M22.766,6.808c4.16,0,7.531,3.372,7.531,7.53c0,4.159-3.371,7.53-7.531,7.53 c-4.158,0-7.529-3.371-7.529-7.53C15.237,10.18,18.608,6.808,22.766,6.808z M22.761,39.579c-4.149,0-7.949-1.511-10.88-4.012 c-0.714-0.609-1.126-1.502-1.126-2.439c0-4.217,3.413-7.592,7.631-7.592h8.762c4.219,0,7.619,3.375,7.619,7.592 c0,0.938-0.41,1.829-1.125,2.438C30.712,38.068,26.911,39.579,22.761,39.579z"
                        fill="#b4b4b4"
                    />
                </Svg>

                {/* Bilgilendirme yazısı */}
                <Text style={styles.infoText}>
                    Tüm uygulama özelliklerine erişmek için oturum açın veya yeni bir hesap oluşturun.
                </Text>

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
                    <Text style={styles.buttonText}>Giriş Yap / Kayıt Ol</Text>
                </TouchableOpacity>

                <View style={styles.separatorContainer}>
                    <View style={styles.separatorLine} />
                    <Text style={styles.separatorText}>Veya</Text>
                    <View style={styles.separatorLine} />
                </View>
                <TouchableOpacity
                    style={styles.appleButton}
                    onPress={() => onAppleButtonPress().then(() => console.log('Apple sign-in complete!'))}
                >
                    <FontAwesomeIcon icon={faApple} size={25} color="#000" />
                    <Text style={styles.appleButtonText}>Apple ile Devam Et</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={() => signInWithGoogle()}
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
                    <Text style={styles.googleButtonText}>Google ile Devam Et</Text>
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
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            value={digit}
                            onChangeText={(text) => {
                                if (text.length > 0) {
                                    const updatedVerificationCode = [...verificationCode];
                                    updatedVerificationCode[index] = text[text.length - 1]; // Sadece son karakteri al
                                    setVerificationCode(updatedVerificationCode);

                                    // Sonraki kutuya geç
                                    if (index < inputRefs.current.length - 1) {
                                        inputRefs.current[index + 1].focus();
                                    }
                                }
                            }}
                            style={styles.codeInput}
                            keyboardType="number-pad"
                            maxLength={1} // Her kutuya sadece tek bir rakam
                            onKeyPress={({ nativeEvent }) => {
                                if (nativeEvent.key === 'Backspace') {
                                    const updatedVerificationCode = [...verificationCode];

                                    // Eğer mevcut kutuda bir değer varsa, önce onu sil
                                    if (updatedVerificationCode[index] !== '') {
                                        updatedVerificationCode[index] = ''; // Mevcut kutuyu temizle
                                        setVerificationCode(updatedVerificationCode);
                                    } else if (index > 0) {
                                        // Mevcut kutu zaten boşsa, bir önceki kutuya git ve onu sil
                                        updatedVerificationCode[index - 1] = '';
                                        setVerificationCode(updatedVerificationCode);

                                        // Bir önceki kutuya odaklan
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

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        paddingTop: 30,
        backgroundColor: Colors.motoBackgroundColor
    },
    input: {
        width: '100%',
        padding: 15,
        borderWidth: 1,
        borderColor: Colors.motoDarkGray,
        borderRadius: 10,
        marginBottom: 20,
        color: Colors.motoText1,
        backgroundColor: Colors.motoBoxBackgroundColor
    },
    button: {
        backgroundColor: Colors.motored,
        paddingVertical: 15,
        width: '80%',
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
    appleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 15,
        width: '100%',
        borderRadius: 10,
        marginTop: 10,
        justifyContent: 'center',
    },
    appleButtonText: {
        marginLeft: 10,
        fontSize: 18,
        color: '#555',
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
        backgroundColor: Colors.motoBackgroundColor
    },
    phoneNumberText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.motoText1,
    },
    instructionText: {
        fontSize: 16,
        marginBottom: 20,
        color: Colors.motoText1,
    },
    codeInputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    codeInput: {
        backgroundColor: Colors.motoBoxBackgroundColor,
        borderWidth: 1,
        borderColor: Colors.motoDarkGray,
        borderRadius: 5,
        width: 40,
        height: 40,
        textAlign: 'center',
        fontSize: 18,
        marginHorizontal: 5,
        color: Colors.motoText1,
    },
    infoText: {
        textAlign: 'center',
        marginBottom: 15,
        fontSize: 16,
        color: '#777',
        marginTop: 15,
    },
});
