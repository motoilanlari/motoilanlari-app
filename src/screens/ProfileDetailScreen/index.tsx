import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons/faEnvelopeOpenText";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import Colors from "../../../Constants/colors"; // Renkleri çağırdığınız yer

export default function ProfilDetailScreen() {
    const navigation = useNavigation();

    const [name, setName] = useState('Kullanıcı Adı');
    const [phone, setPhone] = useState('123-456-7890');
    const [email, setEmail] = useState('user@example.com');

    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);

    const handleApply = () => {
        // Bilgileri güncelleme işlemleri
        setIsEditingName(false);
        setIsEditingPhone(false);
    };

    const handleDeleteAccount = () => {
        // Hesabı silme işlemi
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
                        <FontAwesomeIcon style={styles.editIcon} size={24} color={'#000'} icon={faEdit} />
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
                        <Text style={styles.valueText}>{phone}</Text>
                    )}
                    <TouchableOpacity onPress={() => setIsEditingPhone(!isEditingPhone)}>
                        <FontAwesomeIcon style={styles.editIcon} size={24} color={'#000'} icon={faEdit} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>E-posta</Text>
                <View style={styles.row}>
                    <Text style={styles.valueText}>{email}</Text>
                    {/*<FontAwesomeIcon style={styles.editIcon} size={24} color={'#ccc'} icon={faEdit} />*/}
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
        backgroundColor: 'white',
    },
    section: {
        backgroundColor: '#F5F5F5', // Alanın arka plan rengi
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
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
        color: '#000',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 10,
        backgroundColor: '#fff', // TextInput arka plan rengi
    },
    editIcon: {
        marginLeft: 10,
    },
    button: {
        backgroundColor: Colors.motored,
        paddingVertical: 10,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
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
