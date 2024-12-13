import React, { useState } from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Image, Linking, ScrollView} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes, faTurkishLiraSign } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

import Colors from '../../Constants/colors';

import { firebase, auth } from '../../services/firebase';
import ImageCarousel from "./ImageCarousel";

const { width, height } = Dimensions.get('window');

const ProductModal = ({ modalVisible, setModalVisible, selectedProduct }) => {
    const currentUser = auth().currentUser?.uid;

    const handleWhatsappPress = () => {
        const phoneNumber = '905551234567'; // Telefon numarası
        const message = `Merhaba, ${selectedProduct?.title} hakkında bilgi almak istiyorum.`;
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        Linking.openURL(url).catch((err) => console.error('WhatsApp açma hatası:', err));
    };

    const handleChatPress = async () => {
        // Sohbet başlatma mantığı buraya eklenebilir.
        console.log("Sohbet başlatılıyor...");
    };

    if (!selectedProduct) return null;

    selectedProduct.hasDamage = selectedProduct.hasDamage ? 'Var' : 'Yok'
    selectedProduct.hasTradeIn = selectedProduct.hasTradeIn ? 'Var' : 'Yok'

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <ScrollView style={styles.modalContainer}>
                {/* Kapatma İkonu */}
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                >
                    <FontAwesomeIcon icon={faTimes} size={24} color="#fff" />
                </TouchableOpacity>

                {/* Ürün Fotoğrafı */}
                <ImageCarousel style={styles.productImage} images={selectedProduct.photoUrls}/>

                <View style={{paddingVertical: 5, paddingHorizontal: 15}}>
                {/* İlan Başlığı ve WhatsApp Butonu */}
                <View style={{flexDirection: 'row', paddingVertical: 10, justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{fontSize: 22, fontWeight: '600', color: Colors.motoText1}}>
                        {selectedProduct.title}
                    </Text>
                    {!selectedProduct.isNumberView && (
                        <TouchableOpacity onPress={handleWhatsappPress}>
                            <FontAwesomeIcon icon={faWhatsapp} size={40} color={'#25D366'}/>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Fiyat ve Marka Kısmı */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 10,
                    }}
                >
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontSize: 22, fontWeight: 'bold', color: Colors.motored}}>{parseFloat(selectedProduct.price).toLocaleString('tr-TR')}</Text>
                        <FontAwesomeIcon
                            style={{marginLeft: 5}}
                            size={20}
                            color={Colors.motored}
                            icon={faTurkishLiraSign}
                        />
                    </View>
                    <Text style={{color: Colors.motored, marginLeft: 3}}>{selectedProduct.date}</Text>
                </View>

                {/* Rating, Category, Count in Stock */}
                <View style={{marginTop: 20}}>
                    {/* Detayları burada görüntüleyin */}

                    <View style={styles.detailFont}>
                        <Text style={{fontSize: 18, color: Colors.motoText1}}>Marka: {selectedProduct.brand}</Text>
                    </View>
                    <View style={styles.detailFont}>
                        <Text style={{fontSize: 18, color: Colors.motoText1}}>Model: {selectedProduct.model}</Text>
                    </View>
                    <View style={styles.detailFont}>
                        <Text style={{fontSize: 18, color: Colors.motoText1}}>Model Yılı: {selectedProduct.modelYear}</Text>
                    </View>
                    <View style={styles.detailFont}>
                        <Text style={{fontSize: 18, color: Colors.motoText1}}>Cc: {selectedProduct.enginePower}</Text>
                    </View>
                    <View style={styles.detailFont}>
                        <Text style={{fontSize: 18, color: Colors.motoText1}}>Km: {parseFloat(selectedProduct.km).toLocaleString('tr-TR')}</Text>
                    </View>
                    <View style={styles.detailFont}>
                        <Text style={{fontSize: 18, color: Colors.motoText1}}>Hasar Kaydı: {selectedProduct.hasDamage}</Text>
                    </View>
                    <View style={styles.detailFont}>
                        <Text style={{fontSize: 18, color: Colors.motoText1}}>Takas: {selectedProduct.hasTradeIn}</Text>
                    </View>

                    <View style={styles.detailFont}>
                        <Text style={{fontSize: 18, color: Colors.motoText1}}>Şehir: {selectedProduct.city}</Text>
                    </View>
                    <View style={styles.detailFont}>
                        <Text style={{fontSize: 18, color: Colors.motoText1}}>Açıklama: {selectedProduct.description}</Text>
                    </View>
                </View>

                </View>

            </ScrollView>

            <View style={{ backgroundColor: Colors.motoBackgroundColor }}>
            { /* Sohbet Et Butonu */}
            {
                currentUser !== null && currentUser !== selectedProduct.adOwnerId && (
                    <TouchableOpacity
                        style={{
                            position: 'relative',
                            backgroundColor: Colors.motored,
                            paddingVertical: 15,
                            borderRadius: 10,
                            margin: 15
                        }}
                        onPress={handleWhatsappPress}
                    >
                        <Text style={{textAlign: 'center', color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                            Sohbet Et
                        </Text>
                    </TouchableOpacity>
                )
            }
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.motoBackgroundColor,
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        left: 15,
        zIndex: 10,
        backgroundColor: Colors.motored,
        padding: 7,
        borderRadius: 100,
    },
    productImage: {
        width: width,
        height: height * 0.4,
        resizeMode: 'contain',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.motoText1,
    },
    detailsContainer: {
        padding: 20,
        color: Colors.motoText1
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    detailFont: {
        backgroundColor: Colors.motoBoxBackgroundColor, // İçeriklerin arka plan rengi
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    detailText: {
        fontSize: 18,
        marginBottom: 10,
        color: Colors.motoText1,
    },
    detailValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.motoText1,
    },
    chatButton: {
        backgroundColor: Colors.motored,
        paddingVertical: 15,
        marginHorizontal: 20,
        marginTop: 30,
        borderRadius: 10,
        alignItems: 'center',
    },
    chatButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ProductModal;
