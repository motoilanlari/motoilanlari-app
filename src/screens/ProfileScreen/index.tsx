import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { faAddressCard, faChevronRight, faNewspaper, faEnvelopeOpenText, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../../Constants/colors.ts';

const { width } = Dimensions.get('window');

function ProfileScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Profil Fotoğrafı */}
            <Image
                source={{ uri: 'https://www.looper.com/img/gallery/why-the-professor-from-money-heist-looks-so-familiar/intro-1587390568.jpg' }}
                style={styles.profileImage}
            />

            {/* Kullanıcı Adı */}
            <Text style={styles.username}>Mahmut Yüksel Mert</Text>

            {/* Profil Detay Butonu */}
            <TouchableOpacity
                style={[styles.button, {flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start"}]}
                onPress={() => navigation.navigate('ProfileDetailScreen')}
            >
                <FontAwesomeIcon style={{marginRight:10}} size={36} color={'white'} icon={faAddressCard} />
                <Text style={styles.buttonText}>Profil Detayları</Text>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <FontAwesomeIcon style={{marginRight:10}} size={26} color={'white'} icon={faChevronRight} />
                </View>
            </TouchableOpacity>

            {/* İlanlarım Butonu */}
            <TouchableOpacity
                style={[styles.button, {flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start"}]}
                onPress={() => navigation.navigate('MyAds')}
            >
                <FontAwesomeIcon style={{marginRight:10}} size={36} color={'white'} icon={faNewspaper} />
                <Text style={styles.buttonText}>İlanlarım</Text>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <FontAwesomeIcon style={{marginRight:10}} size={26} color={'white'} icon={faChevronRight} />
                </View>
            </TouchableOpacity>

            {/* İletişim ve Geri Bildirim Butonu */}
            <TouchableOpacity
                style={[styles.button, {flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start"}]}
            >
                <FontAwesomeIcon style={{marginRight:10}} size={36} color={'white'} icon={faEnvelopeOpenText} />
                <Text style={styles.buttonText}>İletişim ve Geri Bildirim</Text>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <FontAwesomeIcon style={{marginRight:10}} size={26} color={'white'} icon={faChevronRight} />
                </View>
            </TouchableOpacity>

            {/* Çıkış Yap */}
            <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center', marginTop: 40}}
            >
                <FontAwesomeIcon style={{marginRight: 10}} size={23} color={Colors.motored} icon={faArrowRightFromBracket} />
                <Text style={styles.logoutText}>Çıkış Yap</Text>
            </TouchableOpacity>

            {/* Yeni Buton */}
            <TouchableOpacity
                style={[styles.button, {marginTop: 30, backgroundColor: '#007BFF'}]}
                onPress={() => navigation.navigate('WelcomeScreen')}
            >
                <Text style={styles.buttonText}>Welcome Ekranına Git</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 50,
        backgroundColor: '#f8f8f8'
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
        marginBottom: 30,
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
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoutText: {
        color: Colors.motored,
        fontSize: 18,
    },
});

export default ProfileScreen;
