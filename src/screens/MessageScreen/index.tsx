import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import MessageItem from '../../components/MessageItem';
import {Message} from '../../models';

import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome"; // Realtime Database
import {faComments} from "@fortawesome/free-solid-svg-icons";

import { auth, firestore, database, messaging } from '../../../services/firebase';
import Colors from "../../../Constants/colors.ts";
import {color} from "@rneui/base";
import colors from "../../../Constants/colors.ts";

function Index() {
        const [messages, setMessages] = useState([]);
        const [loading, setLoading] = useState(true);
        const currentUserId = auth().currentUser?.uid;

        useEffect(() => {
            if (!currentUserId) {
                setLoading(false);
                return;
            }

            const messagesRef = database().ref('chats');

            // Gerçek zamanlı dinleme
            const unsubscribe = messagesRef.on('value', (snapshot) => {
                if (!snapshot.exists()) {
                    setMessages([]);
                    setLoading(false);
                    return;
                }

                const fetchedMessages = [];

                snapshot.forEach((adSnapshot) => {
                    const adId = adSnapshot.key;
                    const chats = adSnapshot.val();

                    Object.keys(chats).forEach((chatId) => {
                        const chat = chats[chatId];

                        if (!chat || !chat.messages) return;

                        const latestMessageObj = Object.values(chat.messages).slice(-1)[0];

                        // Kullanıcıya ait olmayan sohbetleri atla
                        const [user1, user2] = chatId.split('_');
                        if (user1 !== currentUserId && user2 !== currentUserId) return;

                        // Görülmemiş mesajları say
                        const unreadCount = Object.values(chat.messages).filter(
                            (msg) => !msg.seen && msg.senderId !== currentUserId
                        ).length;

                        fetchedMessages.push({
                            adId,
                            chatId,
                            adTitle: chat.adTitle || 'İlan Başlığı Yok',
                            adPhoto: chat.adPhoto || null,
                            adOwnerName: chat.adOwnerName || 'Kullanıcı',
                            senderId: chat.senderId,
                            latestMessage: latestMessageObj.message || '',
                            latestMessageTimestamp: latestMessageObj.timestamp || 0,
                            unreadCount,
                        });
                    });
                });

                // Mesajları zaman damgasına göre sırala
                fetchedMessages.sort((a, b) => b.latestMessageTimestamp - a.latestMessageTimestamp);

                setMessages(fetchedMessages);
                setLoading(false);
            });

            // Temizleme işlemi
            return () => messagesRef.off('value', unsubscribe);
        }, [currentUserId]);

        if (loading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        }

        if (messages.length === 0) {
            return (
                <View style={{
                    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10,
                    backgroundColor: Colors.motoBackgroundColor,
                    color: Colors.motoText3
                }}>
                    <FontAwesomeIcon icon={faComments} size={70} color={colors.motoText3} />
                    <Text style={{ marginTop: 20 , color: Colors.motoText3}}>Henüz hiçbir konuşma başlatılmadı.</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={messages}
                renderItem={({ item }) => <MessageItem item={item} />}
                keyExtractor={(item) => item.chatId}
                style={{ backgroundColor: Colors.motoBackgroundColor }}
            />
        );
    }

export default Index;
