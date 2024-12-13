import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons/faEdit";
import Colors from "../../../Constants/colors"; // Renkleri çağırdığınız yer
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";

export default function ProfilDetailScreen() {
    const navigation = useNavigation();

    const [name, setName] = useState('Kullanıcı Adı');
    const [phone, setPhone] = useState('+90 5xx xxx xxxx');
    const [email, setEmail] = useState('sizin@mailadresiniz.com');

    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);

    // Firestore'da oturum açmış kullanıcıya ait bilgileri getirme
    useEffect(() => {
        const fetchUserInfo = async () => {
            const user = auth().currentUser;
            if (user) {
                const userInfo = await firestore().collection('Users').doc(user.uid).get();
                if (userInfo.exists) {
                    setName(userInfo.data().name);
                    setPhone(userInfo.data().phone);
                    setEmail(userInfo.data().email);
                }
            }
        };
        fetchUserInfo();
    }, []);

    // Kullanıcı bilgilerini veritabanına kaydetme (Güncelleme veya Ekleme)
    const handleApply = async () => {
        const user = auth().currentUser;
        if (!user) {
            Alert.alert('Hata', 'Giriş yapmadınız.');
            return;
        }
     // Alanların doldurulup doldurulmadığını kontrol et
        if (!name || !phone || !email) {
            Alert.alert('Hata', 'Lütfen bütün alanları doldurun.');
            return;
        }

        const userRef = firestore().collection('Users').doc(user.uid);

        try {
            // Kullanıcı bilgilerini güncelleme
            await userRef.set({
                name: name,
                phone: phone,
                email: email,
            }, {merge: true});

            Alert.alert('Başarılı', 'Bilgiler başarıyla güncellendi!');
            navigation.navigate('Profile', {screen: 'ProfileScreen'});
            navigation.navigate('Profile', {screen: 'ProfileDetailScreen'});
        } catch (error) {
            console.error("Güncelleme hatası: ", error);
            Alert.alert('Hata', 'Bilgiler güncellenirken bir hata oluştu.');
        }
    };

    const handleDeleteAccount = () => {
        // Onay penceresi göster
        Alert.alert(
            'Hesabı Sil', // Başlık
            'Hesabı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.', // Mesaj
            [
                {
                    text: 'Hayır', // İptal butonu
                    style: 'cancel',
                },
                {
                    text: 'Evet', // Onay butonu
                    onPress: async () => {
                        try {
                            const user = auth().currentUser;
                            if (!user) {
                                Alert.alert('Hata', 'Giriş yapmadınız.');
                                return;
                            }

                            // Kullanıcı hesabını sil
                            await user.delete();
                            console.log('Successfully deleted user');
                            Alert.alert('Başarılı', 'Hesabınız silindi.');
                        } catch (error) {
                            console.error('Hesap silme hatası:', error);
                            Alert.alert('Hata', 'Hesap silinirken bir hata oluştu.');
                        }
                    },
                },
            ],
            { cancelable: false } // Kullanıcının boş alana tıklayarak uyarıyı kapatmasını engelle
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.label}>İsim</Text>
                <View style={styles.row}>
                    {isEditingName ? (
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="İsim"
                        />
                    ) : (
                        <Text style={styles.valueText}>{name}</Text>
                    )}
                    <TouchableOpacity onPress={() => setIsEditingName(!isEditingName)}>
                        <FontAwesomeIcon style={styles.editIcon} size={24} color={Colors.motoGray} icon={faEdit} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Telefon Numarası</Text>
                <View style={styles.row}>
                    {isEditingPhone ? (
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Telefon Numarası"
                            keyboardType="phone-pad"
                        />
                    ) : (
                        <Text style={styles.valueText}>{ phone ? phone : '-' }</Text>
                    )}
                    <TouchableOpacity onPress={() => setIsEditingPhone(!isEditingPhone)}>
                        <FontAwesomeIcon style={styles.editIcon} size={24} color={Colors.motoGray} icon={faEdit} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>E-posta</Text>
                <View style={styles.row}>
                    {isEditingEmail ? (
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="E-posta"
                            keyboardType="email-address"
                        />
                    ) : (
                        <Text style={styles.valueText}>{email}</Text>
                    )}
                    <TouchableOpacity onPress={() => setIsEditingEmail(!isEditingEmail)}>
                        <FontAwesomeIcon style={styles.editIcon} size={24} color={Colors.motoGray} icon={faEdit}/>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleApply}>
                <Text style={styles.buttonText}>Uygula</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteContainer} onPress={handleDeleteAccount}>
                <FontAwesomeIcon style={{ marginRight: 10 }} size={30} color={Colors.motored} icon={faXmark} />
                <Text style={styles.deleteText}>Hesabı Sil</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.motoBackgroundColor
    },
    section: {
        backgroundColor: Colors.motoBoxBackgroundColor,
        color: Colors.motoText1,
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.motoGray,
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    valueText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.motoText2,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: Colors.motoGray,
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 10,
        backgroundColor: Colors.motoGray, // TextInput arka plan rengi
        color: Colors.motoText1,
    },
    editIcon: {
        marginLeft: 10,
    },
    button: {
        backgroundColor: Colors.motored,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: Colors.motoText1,
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },
    deleteText: {
        color: Colors.motored,
        fontSize: 20,
    },
});
