import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Colors from '../../../Constants/colors.ts';

function WelcomeScreenStep2({navigation}) { // navigation propunu ekleyin
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const handleSave = () => {
        // Kaydetme işlemleri burada yapılabilir
        console.log('Kullanıcı Adı:', username);
        console.log('E-posta Adresi:', email);
        alert('Bilgiler kaydedildi!');

        // ProfileScreen'e yönlendirme
        navigation.navigate('ProfileScreen'); // Yönlendirme işlemi
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Kendinizden daha fazla bahsedin</Text>

            <TextInput
                style={styles.input}
                placeholder="Ad Soyad"
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="E-posta"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}>
                <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderColor: '#EAEAEA',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: Colors.motored, // Butonun arka plan rengi
        padding: 15,                // Butonun iç boşluğu
        borderRadius: 10,           // Butonun kenar yuvarlama
        alignItems: 'center',       // Yazıyı ortalamak için
        justifyContent: 'center',   // Dikey hizalama için
        width: '100%',              // Butonun genişliği
        marginTop: 20,              // Butonun üst boşluğu
    },
    saveButtonText: {
        color: '#FFF',              // Yazı rengi
        fontSize: 18,               // Yazı boyutu
        fontWeight: 'bold',         // Yazı kalınlığı
    },
});

export default WelcomeScreenStep2;
