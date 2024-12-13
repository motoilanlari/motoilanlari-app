import React, {useState} from 'react';
import {Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Product} from '../models';
import {faTurkishLiraSign} from '@fortawesome/free-solid-svg-icons/faTurkishLiraSign';
import {faTrash} from '@fortawesome/free-solid-svg-icons/faTrash';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../Constants/colors.ts';
import firestore from "@react-native-firebase/firestore";
import colors from "../../Constants/colors.ts";


const {height, width} = Dimensions.get('window');

type favoriteItemProps = {
    product: Product;
};

function Index({product}: favoriteItemProps) {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);

    const handleDelete = async (adId) => {
        try {
            const adRef = firestore().collection('Ads').doc(adId);
            console.log('Deleting ad with ID:', adId);

            await adRef.update({
                deletedAt: firestore.FieldValue.serverTimestamp()
            });
            console.log('Silme işlemi gerçekleştirildi');

            setModalVisible(false);
        } catch (error) {
            console.error('Silme işlemi hatası:', error);
        }
    };
    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignContent: 'center',
            backgroundColor: Colors.motoBoxBackgroundColor,
            borderColor: Colors.motoBoxBackgroundColor,
            borderWidth: 1,
            shadowColor: 'gray',
            shadowOpacity: 0.12,
            padding: 0,
            borderRadius: 10,
            marginBottom: 15,
            height: height * 0.15,
        }}>
            <TouchableOpacity
                onPress={
                    () => navigation.navigate('Profile', {
                        screen: 'MyAdsDetailScreen',
                        params: {
                            product: product}
                    })
                }
                style={{width: '85%'}}
            >
                {/* İlan Detayları */}
                <View style={{
                    flex: 1, // Alanın geri kalanını kaplar
                    flexDirection: 'row', // İçerikte yan yana hizalama

                    justifyContent: 'space-between',
                    display: 'flex'
                }}>
                    {/*İmage Kısmı*/}
                    <View style={{width: '43%'}}>
                        <Image
                            style={{
                                width: '100%',
                                height: '100%',
                                borderTopLeftRadius: 10,
                                borderBottomLeftRadius: 10,
                            }}
                            source={{uri: product.photoUrls[0]}}
                        />
                    </View>

                    {/*Yazı Kısmı*/}
                    <View style={{width: '55%', paddingLeft: 5}}>
                        <Text>{product.name}</Text>

                        <Text style={{fontSize: 14, fontWeight: '500', color: Colors.motoText1}}>
                            {product.title}
                            {/*   {product.description.length > 50 ? `${product.description.substring(0, 50)}...` : product.description} */}
                        </Text>

                        <Text style={{fontWeight: 'bold', fontSize: 24, color: Colors.motoText1}}>
                            {parseFloat(product.price).toLocaleString('tr-TR')}
                            <FontAwesomeIcon size={16} color={Colors.motoText1} icon={faTurkishLiraSign}/>
                        </Text>

                        <Text style={{fontSize: 14, fontWeight: '500', color: Colors.motoText1}}>
                            {product.brand} &nbsp;
                            {product.model}
                            {/*   {product.description.length > 50 ? `${product.description.substring(0, 50)}...` : product.description} */}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Silme Butonu */}
            <TouchableOpacity
                onPress={() => setModalVisible(true)} // Modalı açıyoruz
                style={styles.deleteButton}
            >
                <FontAwesomeIcon size={20} color={'white'} icon={faTrash}/>
            </TouchableOpacity>

            {/* Silme Onay Modali */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)} // Android geri tuşuyla modalı kapatma
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>Silmek istediğinize emin misiniz?</Text>
                        <View style={styles.modalButtons}>
                            {/* Hayır Butonu */}
                            <TouchableOpacity
                                style={styles.noButton}
                                onPress={() => setModalVisible(false)} // Modalı kapatıyoruz
                            >
                                <Text style={styles.buttonText}>Hayır</Text>
                            </TouchableOpacity>

                            {/* Evet Butonu */}
                            <TouchableOpacity
                                style={styles.yesButton}
                                onPress={() => handleDelete(product.id)} // adId parametresini handleDelete fonksiyonuna gönderiyoruz
                            >
                                <Text style={styles.buttonText}>Evet</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default Index;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: Colors.motored, // Buton arka plan rengi
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        height: '100%',
        width: '15%',
        justifyContent: 'center', // Dikey ortalama
        alignItems: 'center', // Yatay ortalama
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Yarı saydam arka plan
    },
    modalContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    noButton: {
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    yesButton: {
        backgroundColor: Colors.motored,
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
