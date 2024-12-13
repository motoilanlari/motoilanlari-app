import React, {useState} from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // Yönlendirme için ekledik
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faTurkishLiraSign} from '@fortawesome/free-solid-svg-icons/faTurkishLiraSign';
import {faWhatsapp} from '@fortawesome/free-brands-svg-icons/faWhatsapp'; // WhatsApp ikonu
import Colors from '../../../Constants/colors.ts';
import Toast from "react-native-toast-message";

import {useAuth} from "../../context/AuthProvider";

import {auth, firestore, database} from "../../../services/firebase";
import colors from "../../../Constants/colors.ts";

function Index({
                   adId,
                   title,
                   price,
                   brand,
                   model,
                   modelYear,
                   enginePower,
                   km,
                   hasDamage,
                   hasTradeIn,
                   city,
                   date,
                   description,
                   isNumberView,
                   adOwnerId,
                   adFirstPhoto
}) {

    const navigation = useNavigation();  // Yönlendirme için navigation hook'u ekledik
    const currentUser = useAuth();
    const [adOwnerName, setAdOwnerName] = useState(null);
 const hasDamageValue = (value) => {
     if (hasDamage == true) return 'Var';
     if (hasDamage == false) return 'Yok';

 };
 const hasTradeInValue = (value) => {
     if (hasTradeIn === true) return 'Var';
     if (hasTradeIn === false) return 'Yok';

 };
    // WhatsApp simgesine basıldığında yapılacak işlem
    const handleWhatsappPress = () => {
        const phoneNumber = '905551234567'; // Telefon numarasını ayarla
        const message = `Merhaba, ${title} hakkında bilgi almak istiyorum.`;
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        // WhatsApp'a yönlendirme
        Linking.openURL(url).catch((err) => console.error('WhatsApp açma hatası: ', err));
    };

    async function handlePress() {
        if (currentUser) {
            // Sohbeti başlat veya mevcut sohbeti getir
            const chatId = await getOrCreateChatBox();

            if (chatId) {
                navigation.navigate('ChatScreen', {adId, chatId});
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Mesaj Gönderilmedi!',
                    text2: 'Mesaj gönderilirken bir hata oluştu lütfen tekrar deneyin.',
                });
            }

        } else {
            navigation.navigate('ProfileNavigator');
        }
    }

    // chatId formatı senderId_receiverId
    async function getOrCreateChatBox() {
        try {
            let senderId = auth().currentUser?.uid; // Oturum açan kullanıcı
            let receiverId = adOwnerId; // İlan sahibi
            const chatId = `${senderId}_${receiverId}`;

            // Veritabanındaki chat referansını al
            const chatRef = database().ref(`chats/${adId}/${chatId}`);
            const snapshot = await chatRef.once('value');

            if (snapshot.exists()) {
                // Eğer sohbet varsa, chatId'yi döndür
                return chatId;
            } else {

                // Ad sahibi bilgilerini al
                const adDocOwner = await firestore().collection('Users').doc(adOwnerId).get();
                if (adDocOwner.exists) {
                    let getAdDoc = adDocOwner.data();
                    // @ts-ignore
                    setAdOwnerName(getAdDoc.name);

                    // Eğer sohbet yoksa, yeni sohbet kutusunu oluştur
                    const newChatData = {
                        "adTitle": brand + ' ' + model,
                        "adPhoto": adFirstPhoto,
                        "adOwnerId": receiverId,
                        "adOwnerName": getAdDoc.name,
                        "senderName": currentUser.name,
                        "senderId": senderId,
                        "messages": false // Başlangıçta boş bir dizi
                    };

                    // Yeni sohbet kutusunu veritabanına kaydedelim
                    try {
                        await chatRef.set(newChatData);
                        console.log("Yeni sohbet kutusu başarıyla oluşturuldu.");
                        console.log(chatRef.key);  // Bu, chatId'yi döndürür

                        // Yeni oluşturduğumuz chatId'yi döndürüyoruz
                        return chatRef.key;
                    } catch (error) {
                        console.error("Yeni sohbet kutusu oluşturulurken hata:", error);
                        if (error instanceof Error) {
                            console.log("Hata türü:", error.name);
                            console.log("Hata mesajı:", error.message);
                        }
                        return null; // Hata durumunda null döndürüyoruz
                    }
                }

            }
        } catch (error) {
            console.error('Sohbet kutusu oluşturulurken bir hata oluştu:', error);
            if (error instanceof Error) {
                console.log("Hata türü:", error.name);
                console.log("Hata mesajı:", error.message);
                console.log("Hata yığını:", error.stack);
            } else {
                console.log("Bilinmeyen bir hata oluştu:", error);
            }
            return null; // Hata durumunda null döndürüyoruz
        }
    }

    return (
        <View style={{padding: 0}}>
            {/* İlan Başlığı ve WhatsApp Butonu */}
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={{fontSize: 22, fontWeight: '600', color: Colors.motoText1}}>
                    {title}
                </Text>
                {!isNumberView && (
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
                    marginTop: 30,
                }}
            >
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: 22, fontWeight: 'bold', color: Colors.motored}}>{parseFloat(price).toLocaleString('tr-TR')}</Text>
                    <FontAwesomeIcon
                        style={{marginLeft: 5}}
                        size={20}
                        color={Colors.motored}
                        icon={faTurkishLiraSign}
                    />
                </View>
                <Text style={{ color: Colors.motoText1 }}>{date}</Text>
            </View>

            {/* Rating, Category, Count in Stock */}
            <View style={{marginTop: 20}}>
                {/* Detayları burada görüntüleyin */}

                <View style={styles.detailFont}>
                    <Text style={{fontSize: 18, color: Colors.motoText1}}>Marka: {brand}</Text>
                </View>
                <View style={styles.detailFont}>
                    <Text style={{fontSize: 18, color: Colors.motoText1}}>Model: {model}</Text>
                </View>
                <View style={styles.detailFont}>
                    <Text style={{fontSize: 18, color: Colors.motoText1}}>Model Yılı: {modelYear}</Text>
                </View>
                <View style={styles.detailFont}>
                    <Text style={{fontSize: 18, color: Colors.motoText1}}>Cc: {enginePower}</Text>
                </View>
                <View style={styles.detailFont}>
                    <Text style={{fontSize: 18, color: Colors.motoText1}}>Km: {parseFloat(km).toLocaleString('tr-TR')}</Text>
                </View>
                <View style={styles.detailFont}>
                    <Text style={{fontSize: 18, color: Colors.motoText1}}>Hasar Kaydı: {hasDamage}</Text>
                </View>
                <View style={styles.detailFont}>
                    <Text style={{fontSize: 18, color: Colors.motoText1}}>Takas: {hasTradeIn}</Text>
                </View>

                <View style={styles.detailFont}>
                    <Text style={{fontSize: 18, color: Colors.motoText1}}>Şehir: {city}</Text>
                </View>
                <View style={styles.detailFont}>
                    <Text style={{fontSize: 18, color: Colors.motoText1}}>Açıklama: {description}</Text>
                </View>
            </View>

            { /* Sohbet Et Butonu */}
            {
                currentUser != null && currentUser.uid !== null && currentUser.uid != adOwnerId && (
                    <View style={{ position: 'static', backgroundColor: Colors.motoBackgroundColor }}>
                        <TouchableOpacity
                            style={{

                                backgroundColor: Colors.motored,
                                paddingVertical: 15,
                                borderRadius: 10,
                                marginTop: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={handlePress}
                        >
                            <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                                Sohbet Et
                            </Text>
                        </TouchableOpacity>
                    </View>
                )
            }

        </View>
    );
}

const styles = StyleSheet.create({
    detailFont: {
        backgroundColor: Colors.motoBoxBackgroundColor, // İçeriklerin arka plan rengi
        color: Colors.motoText1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    }
});

export default Index;
