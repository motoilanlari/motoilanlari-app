import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Linking } from 'react-native';

function Index({ navigation }) {
    const handleInstagramRedirect = () => {
        // Instagram sayfasına yönlendirme
        Linking.openURL('https://www.instagram.com/motoilanlari'); // Instagram linkinizi buraya ekleyin
    };

    return (
        <View style={styles.container}>
            {/* Ekranı kapatma butonu */}
            {/*} <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            */}

            {/* Ekranın kalan kısmı tıklanabilir */}
            <TouchableOpacity style={styles.clickableArea} onPress={handleInstagramRedirect}>
                <Image source={require('../../assets/logo.png')} style={styles.logo} />
                <Text style={styles.message}>
                    Dilerseniz Instagram hesabımızdan da ilan verebilirsiniz
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'transparent',
    },
    closeButtonText: {
        fontSize: 24,
        color: '#FF3E55', // Kapatma butonu rengi
    },
    clickableArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: 300,
        height: 190,
        marginBottom: 20,
    },
    message: {
        fontSize: 18,
        textAlign: 'center',
    },
});

export default Index;
