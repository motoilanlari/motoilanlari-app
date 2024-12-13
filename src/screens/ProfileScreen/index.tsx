import React, {useEffect, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
    faAddressCard,
    faArrowRightFromBracket,
    faChevronRight,
    faEnvelopeOpenText,
    faNewspaper
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../../Constants/colors.ts';
import Svg, {Path} from "react-native-svg";
import auth from "@react-native-firebase/auth";
import {firebase} from "@react-native-firebase/app";
import firestore from "@react-native-firebase/firestore";

const { width } = Dimensions.get('window');

function ProfileScreen() {
    const navigation = useNavigation();
    const [name, setName] = useState(null);

    // Firestore'da oturum açmış kullanıcıya ait bilgileri getirme
    useEffect(() => {
        const fetchUserInfo = async () => {
            const user = auth().currentUser;
            if (user) {
                const userInfo = await firestore().collection('Users').doc(user.uid).get();
                if (userInfo.exists) {
                    setName(userInfo.data().name);
                }
            }
        };
        fetchUserInfo();
    }, []);

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User logged in already or has just logged in.
            // alert(user.uid);
        } else {
            navigation.navigate('WelcomeScreen');
        }
    });

    function handleLogout() {
        auth()
            .signOut()
            .then(() => {
                console.log('User signed out!');
                // Burada kullanıcıyı çıkış yaptıktan sonra yönlendirme yapabilirsiniz, örneğin login ekranına.
                navigation.navigate('WelcomeScreen');

            })
            .catch(error => {
                console.log('Error signing out: ', error);
            });
    }

    return (
        <ScrollView style={{backgroundColor: Colors.motoBackgroundColor}}>
        <View style={styles.container}>
            {/* Profil Simgesi */}
            <Svg width={120} height={120} viewBox="0 0 45.532 45.532" xmlns="http://www.w3.org/2000/svg">
                <Path
                    d="M22.766,0.001C10.194,0.001,0,10.193,0,22.766s10.193,22.765,22.766,22.765c12.574,0,22.766-10.192,22.766-22.765 S35.34,0.001,22.766,0.001z M22.766,6.808c4.16,0,7.531,3.372,7.531,7.53c0,4.159-3.371,7.53-7.531,7.53 c-4.158,0-7.529-3.371-7.529-7.53C15.237,10.18,18.608,6.808,22.766,6.808z M22.761,39.579c-4.149,0-7.949-1.511-10.88-4.012 c-0.714-0.609-1.126-1.502-1.126-2.439c0-4.217,3.413-7.592,7.631-7.592h8.762c4.219,0,7.619,3.375,7.619,7.592 c0,0.938-0.41,1.829-1.125,2.438C30.712,38.068,26.911,39.579,22.761,39.579z"
                    fill="#ffffff"
                />
            </Svg>

            {/* Kullanıcı Adı */}
            <Text style={styles.username}>
                {name ? name : 'Kullanıcı Adı Bilinmiyor'}
            </Text>
            {/* Profil Detay Butonu */}
            <TouchableOpacity
                style={[styles.button, {flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start"}]}
                onPress={() => navigation.navigate('ProfileDetailScreen')}
            >
                <FontAwesomeIcon style={{marginRight:10}} size={36} color={'white'} icon={faAddressCard} />
                <Text style={styles.buttonText}>Profil Detayları</Text>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <FontAwesomeIcon style={{marginRight: 5}} size={26} color={'white'} icon={faChevronRight}/>
                </View>
            </TouchableOpacity>

            {/* İlanlarım Butonu */}
            <TouchableOpacity
                style={[styles.button, {flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start"}]}
                onPress={() => navigation.navigate('MyAdsScreen')}
            >
                <FontAwesomeIcon style={{marginRight:10}} size={36} color={'white'} icon={faNewspaper} />
                <Text style={styles.buttonText}>İlanlarım</Text>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <FontAwesomeIcon style={{marginRight: 5}} size={26} color={'white'} icon={faChevronRight}/>
                </View>
            </TouchableOpacity>

            {/* İletişim ve Geri Bildirim Butonu */}
            <TouchableOpacity
                style={[styles.button, {flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start"}]}
                onPress={() => navigation.navigate('ContactPage')}

            >
                <FontAwesomeIcon style={{marginRight:10}} size={36} color={'white'} icon={faEnvelopeOpenText} />
                <Text style={styles.buttonText}>İletişim ve Geri Bildirim</Text>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <FontAwesomeIcon style={{marginRight: 5}} size={26} color={'white'} icon={faChevronRight}/>
                </View>
            </TouchableOpacity>

            {/* Çıkış Yap */}
            <TouchableOpacity
                style={{flexDirection: 'row', padding: 10, alignItems: 'center', marginTop: 40}}
                onPress={handleLogout}
            >
                <FontAwesomeIcon style={{marginRight: 10} } size={23} color={Colors.motored} icon={faArrowRightFromBracket} />
                <Text style={styles.logoutText}>Çıkış Yap</Text>
            </TouchableOpacity>

        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 50,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 20,
        color: Colors.motoText1,
    },
    button: {
        width: width * 0.8,
        padding: 15,
        backgroundColor: Colors.motored,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
    },
    logoutText: {
        color: Colors.motored,
        fontSize: 18,
    },
});

export default ProfileScreen;
