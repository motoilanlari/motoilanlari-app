import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {formatTimestamp} from "../../utils/dateUtils";

import {useAuth} from '../../context/AuthProvider';
import Colors from "../../../Constants/colors.ts";
import colors from "../../../Constants/colors.ts";

type MessageItemProps = {
    item: {
        adId: string;
        chatId: string;
        adTitle: string;
        adPhoto: string;
        senderId: string;
        adOwnerId: string;
        adOwnerName: string;
        latestMessage: string;
        latestMessageTimestamp: number | null;
        unreadCount: number; // Unread count tanımlandı
    };
};

function MessageItem({ item }: MessageItemProps) {
    const navigation = useNavigation();
    const currentUser = useAuth();

    const handlePress = () => {
        if (!navigation) {
            console.warn('Navigation object is not available');
            return;
        }

        // @ts-ignore
        navigation.navigate('ChatScreen', {
            adId: item.adId,
            adTitle: item.adTitle,
            chatId: item.chatId,
            senderId: item.senderId,
        });
    };

    return (
        <TouchableOpacity style={styles.messageItem} onPress={handlePress}>
            <View>
                <Image
                    source={{uri: item.adPhoto || 'https://via.placeholder.com/85'}}
                    style={styles.image}
                    onError={() => console.warn("Image load failed")}
                />
            </View>
            <View style={{flex: 1, marginLeft: 10}}>
                <View style={{
                    display: 'flex',
                    alignItems: 'center',
                    alignContent: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <Text style={{marginBottom: 5,color: Colors.motoText2}}>{item.adOwnerName}</Text>
                    {item.unreadCount > 0 && (
                        <View style={styles.unreadCountContainer}>
                            <Text style={styles.unreadCountText}>{item.unreadCount}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>
                        {item.adTitle.length > 17 ? item.adTitle.substring(0, 17) + '...' : item.adTitle}
                    </Text>
                </View>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Text style={styles.latestMessageText}>
                        {item.latestMessage.length > 13 ? item.latestMessage.substring(0, 13) + '...' : item.latestMessage}
                    </Text>
                    <Text style={styles.timestampText}>
                        {formatTimestamp(item.latestMessageTimestamp * 1000)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    messageItem: {
        padding: 12,
        borderTopWidth: 0.3,
        borderBottomWidth: 0.3,
        borderColor: colors.motoGray,
        backgroundColor: Colors.motoBoxBackgroundColor,
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 90,
        height: 80,
        borderRadius: 12,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleText: {
        fontWeight: '600',
        fontSize: 16,
        color: Colors.motoText1,
    },
    timestampText: {
        color: colors.motoText2,
        fontWeight: '500',
        marginTop: 6,
    },
    latestMessageText: {
        fontSize: 15,
        marginTop: 6,
        color: colors.motoText3,
    },
    unreadCountContainer: {
        backgroundColor: "red",
        borderRadius: 100,
        width: 23,
        height: 23,
        marginTop: 5,
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',

    },
    unreadCountText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 12,
    },
});

export default MessageItem;
