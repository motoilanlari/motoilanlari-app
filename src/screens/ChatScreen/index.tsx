import React, {useEffect, useRef, useState} from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Image
} from "react-native";

import {useFocusEffect, useNavigation} from '@react-navigation/native'; // useFocusEffect'yi ekledik
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowLeft, faArrowRight, faPaperPlane, faLocationDot} from "@fortawesome/free-solid-svg-icons";

import {useAuth} from "../../context/AuthProvider";

import { auth, firestore, database, messaging } from '../../../services/firebase';

import {formatTimestamp} from "../../utils/dateUtils";
import Svg, {G, Path} from "react-native-svg";
import Toast from "react-native-toast-message";
import Colors from "../../../Constants/colors.ts";
import colors from "../../../Constants/colors.ts";

type MessageType = {
    message: string;
    senderId: string;
    seen: boolean;
    timestamp: number;
};

function ChatScreen({route}) {

    const {adId, chatId, adTitle} = route.params;
    const currentUser = useAuth();

    const navigation = useNavigation(); // Navigation objesini alıyoruz

    const [messageBoxData, setMessageBoxData] = useState();
    const [messages, setMessages] = useState([]);

    const [inputMessage, setInputMessage] = useState("");

    const scrollViewRef = useRef();

    const senderId = chatId.split('_')[0];
    const adOwnerId = chatId.split('_')[1];
    const currentUserId = auth().currentUser?.uid;

    const [keyboardVisible, setKeyboardVisible] = useState(false);

    const [adData, setAdData] = useState(null);

    useEffect(() => {
        const fetchAdData = async () => {
            try {
                const doc = await firestore().collection('Ads').doc(adId).get();
                if (doc.exists) {
                    setAdData(doc.data());
                } else {
                    console.log('Belge bulunamadı.');
                }
            } catch (error) {
                console.error('Veri alma hatası:', error);
            }
        };

        fetchAdData();
    }, [adId]);

    useEffect(() => {
        const userName = messageBoxData
            ? currentUserId === adOwnerId
                ? messageBoxData.senderName || "Bilinmeyen Kullanıcı"
                : messageBoxData.adOwnerName || "Bilinmeyen Kullanıcı"
            : "Yükleniyor...";

        // Başlığı dinamik olarak ayarlayın
        navigation.setOptions({
            headerTitle: route.params?.chatTitle || userName,
        });
    }, [route.params?.chatTitle, messageBoxData, currentUserId, adOwnerId, navigation]);

    useEffect(() => {
        if (adData) {
            //console.log('Fotoğraf URL\'leri:', adData.photoUrls);
        }
    }, [adData]);


    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
                console.log("Klavye açıldı!");
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
                console.log("Klavye kapandı!");
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);


    useFocusEffect(
        React.useCallback(() => {
            // Ekran odaklandığında (yani sohbet sayfasına girdiğimizde)

            // Dinleyici ekleme
            const messageBoxRef = database().ref(`chats/${adId}/${senderId}_${adOwnerId}`);

            const unsubscribe = messageBoxRef.on('value', (snapshot) => {
                if ( snapshot.exists() ) {
                    const getMessageBoxData = snapshot.val();
                    const getMessagesAll = getMessageBoxData?.messages || {}; // Mesajlar

                    if (getMessagesAll) {
                        setMessageBoxData(getMessageBoxData);

                        // Mesajları sıralamak ve formatlamak
                        const formattedMessages = Object.entries(getMessagesAll)
                            .map(([key, value]) => ({
                                id: key,
                                ...value,
                            }))
                            .sort((a, b) => a.timestamp - b.timestamp); // Timestamp'e göre sıralama

                        setMessages(formattedMessages);

                        // Görülmemiş mesajları güncelle
                        const updatePromises = [];
                        Object.entries(getMessagesAll).forEach(([key, message]) => {
                            if (message.senderId !== currentUserId && !message.seen) {
                                const messageRefUpdate = database().ref(`chats/${adId}/${senderId}_${adOwnerId}/messages/${key}`);
                                updatePromises.push(
                                    messageRefUpdate.update({seen: true})
                                );
                            }
                        });

                        Promise.all(updatePromises)
                            .then(() => console.log("Görülmemiş mesajlar güncellendi."))
                            .catch((err) => console.error("Mesaj güncelleme hatası:", err));
                    }
                } else {
                    console.log("Veri yok veya hatalı.");
                }
            });

            // Unsubscribe işlemi, ekran kaybolduğunda (geri gidildiğinde) yapılacak
            return () => {
                messageBoxRef.off(); // Dinleyiciyi kaldır
            };

        }, [adId, senderId, adOwnerId, currentUserId])
    );

    // Mesaj gönderme fonksiyonu
    const sendMessage = async () => {
        if (inputMessage.length >= 2) {
            const newMessage = {
                message: inputMessage,
                senderId: currentUserId,
                timestamp: database.ServerValue.TIMESTAMP,
                seen: false,
            };

            const messagesRef = database().ref(`chats/${adId}/${senderId}_${adOwnerId}/messages`);

            try {
                await messagesRef.push(newMessage);
                setInputMessage("");

                // Bildirim Gönderimi
                /*
                const notification = {
                    notification: {
                        title: "Yeni Mesaj",
                        body: `${inputMessage}`,
                    },
                    data: {
                        chatId,
                        adId,
                    },
                    token: receiverToken, // Kullanıcının FCM token'ı burada olmalı
                };

                // Firebase Messaging'i çağır
                await messaging().send(notification);

                 */
            } catch (error) {
                console.error("Mesaj gönderme hatası:", error);
            }
        } else {
            Toast.show({
                type: "error",
                text1: "Mesajınız Gönderilemedi!",
                text2: "Lütfen göndermek için bir şeyler yazın!",
            });
        }
    };

    useEffect(() => {
        if (scrollViewRef.current || keyboardVisible) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages, keyboardVisible]);

    const navigateToAdDetails = async (adId) => {
        try {
            const adDoc = await firestore()
                .collection('Ads') // Firestore koleksiyon adı
                .doc(adId) // Belge ID'si
                .get();

            if (adDoc.exists) {
                const adData = {id: adDoc.id, ...adDoc.data()};

                //console.log(adData);
                // Detay sayfasına navigasyon
                navigation.navigate('Home', {
                    screen: 'HomeDetailScreen',
                    params: {
                        product: adData}
                });
            } else {
                console.log('Belirtilen ID ile ilan bulunamadı.');
            }
        } catch (error) {
            console.error('İlan bilgisi sorgulama hatası:', error);
        }
    };

    //console.log(messageBoxData);

    // @ts-ignore
    return (
        <View style={{flex: 1}}>

            <View style={{
                backgroundColor: Colors.motoText2,
                paddingHorizontal: 10,
                paddingVertical: 15,
                borderBottomLeftRadius: 30,
                borderBottomRightRadius: 30,
                // iOS için gölge
                shadowColor: Colors.motoDarkGray,  // Siyah gölge
                shadowOffset: { width: 0, height: 2 }, // Gölge konumu
                shadowOpacity: 0.2, // Daha koyu ve belirgin gölge
                shadowRadius: 10, // Gölgenin yayılma boyutu
                // Android için gölge
                elevation: 5, // Android için gölge derinliği
            }}>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between', // Ana düzenlemeyi bu satırda yapıyoruz
                    width: '100%',
                    paddingLeft: 10,
                }}>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        {adData && adData.photoUrls && adData.photoUrls.length > 0 ? (
                            <Image
                                source={{ uri: adData.photoUrls[0] }}
                                style={{ width: 90, height: 60, borderRadius: 2, objectFit: 'center' }} // Görüntü boyutunu belirtin
                            />
                        ) : (
                            <Text>Fotoğraf yükleniyor...</Text> // Veriler yüklenmeden önce bir yedek durum gösterin
                        )}
                        <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingLeft: 10,}}>
                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <FontAwesomeIcon icon={faLocationDot} size={13} color={'#2b2e2f'} />
                                <Text style={{color: 'black', fontWeight: '300', marginLeft: 3 }}>
                                    {adData && adData.city ? (
                                        adData.city
                                    ) : (
                                        "Yükleniyor..."
                                    )}
                                </Text>
                            </View>
                            <Text style={{color: 'black', fontWeight: 'bold'}}>
                                {adData && adData.brand && adData.model ? (
                                    adData.brand + ' ' + adData.model
                                ) : (
                                    "Yükleniyor..."
                                )}
                            </Text>
                            <Text style={{color: 'black', fontWeight: '500'}}>
                                <Text style={{fontWeight: '300'}}>Fiyat: </Text> {adData && adData.price ? (
                                    parseFloat(adData.price).toLocaleString('tr-TR') + '₺'
                                ) : (
                                    "Yükleniyor..."
                                )}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={{
                            justifyContent: 'center', // Yatay hizalama
                            alignItems: 'center', // Dikey hizalama
                            paddingHorizontal: 10,
                        }}
                        onPress={() => navigateToAdDetails(adId)}
                    >
                        <FontAwesomeIcon icon={faArrowRight} size={24} color={'#000'} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Mesaj Listeleme */}
            <ScrollView ref={scrollViewRef}
                        style={{flex: 1}}
                        contentContainerStyle={{
                            paddingRight: 10,
                            paddingLeft: 10,
                            paddingBottom: 10
            }}>
                {messages.map((msg, index) => (
                    <View
                        key={index}
                        style={{
                            alignSelf: msg.senderId === currentUserId ? "flex-end" : "flex-start",
                            backgroundColor: msg.senderId === currentUserId ? colors.motoBoxBackgroundColor : colors.motoGray,
                            borderRadius: 15,
                            paddingTop: 5,
                            paddingLeft: 10,
                            paddingRight: 10,
                            paddingBottom: 5,
                            marginVertical: 5,
                            maxWidth: "100%",
                        }}
                    >
                        <Text style={{
                            fontSize: 14,
                            color: msg.senderId === currentUserId ? colors.motoText3 : colors.motoText2,
                        }}>{msg.message}</Text>
                        <View style={{flexDirection: "row", alignItems: "center", alignSelf: "flex-end"}}>
                            <Text style={{fontSize: 10, color: colors.motoText3, marginRight: 4}}>
                                {formatTimestamp(msg.timestamp)}
                            </Text>
                            <View>
                                {msg.senderId == currentUserId && msg.seen == false && (
                                    <Svg
                                        width="24px"
                                        height="24px"
                                        viewBox="-2.4 -2.4 28.80 28.80"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        stroke="#000"
                                        strokeWidth={0.00024000000000000003}
                                    >
                                        <G fillRule="evenodd" clipRule="evenodd" fill="#bababa">
                                            <Path
                                                d="M15.493 6.935a.75.75 0 01.072 1.058l-7.857 9a.75.75 0 01-1.13 0l-3.143-3.6a.75.75 0 011.13-.986l2.578 2.953 7.292-8.353a.75.75 0 011.058-.072zM20.517 7.02c.3.285.312.76.026 1.06l-8.571 9a.75.75 0 01-1.14-.063l-.429-.563a.75.75 0 011.076-1.032l7.978-8.377a.75.75 0 011.06-.026z"/>
                                        </G>
                                    </Svg>
                                )}
                                {msg.senderId == currentUserId && msg.seen == true && (
                                    <Svg
                                        width="24px"
                                        height="24px"
                                        viewBox="-2.4 -2.4 28.80 28.80"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        stroke="#000"
                                        strokeWidth={0.00024000000000000003}
                                    >
                                        <G fillRule="evenodd" clipRule="evenodd" fill="#ff1822">
                                            <Path
                                                d="M15.493 6.935a.75.75 0 01.072 1.058l-7.857 9a.75.75 0 01-1.13 0l-3.143-3.6a.75.75 0 011.13-.986l2.578 2.953 7.292-8.353a.75.75 0 011.058-.072zM20.517 7.02c.3.285.312.76.026 1.06l-8.571 9a.75.75 0 01-1.14-.063l-.429-.563a.75.75 0 011.076-1.032l7.978-8.377a.75.75 0 011.06-.026z"/>
                                        </G>
                                    </Svg>
                                )}
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Mesaj Gönderme Alanı */}
            <View style={{
                backgroundColor: Colors.motoBackgroundColor,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 0,
                paddingBottom: 5,
                paddingHorizontal: 10,
                borderTopWidth: 0,
                borderTopColor: "#EAEAEA",
            }}>
                <TextInput
                    placeholder="Mesajınızı yazın..."
                    placeholderTextColor="#646464"
                    value={inputMessage}
                    onChangeText={setInputMessage}
                    style={{
                        backgroundColor: Colors.motoBoxBackgroundColor,
                        borderColor: Colors.motoGray,
                        borderWidth: 0,
                        //borderRadius: 30,
                        borderTopLeftRadius: 30,
                        borderBottomLeftRadius: 0,
                        borderTopRightRadius: 30,
                        borderBottomRightRadius: 0,
                        padding: 10,
                        width: "84%",
                        fontSize: 16,
                        height: 50,
                        color: Colors.motoText1,
                    }}
                />
                <TouchableOpacity onPress={sendMessage} style={{
                    marginLeft: 0,
                    //borderRadius: 25,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderTopRightRadius: 30,
                    borderBottomRightRadius: 30,
                    backgroundColor: colors.motored,
                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    width: "16%",
                    height: 50,
                    marginRight: 0
                }}>
                    <FontAwesomeIcon size={22} color={"#e2e6e9"} icon={faPaperPlane}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default ChatScreen;
