import functions = require('firebase-functions');
import admin = require('firebase-admin');
admin.initializeApp();

exports.sendNotification = functions.database
    .ref('chats/{adId}/{chatId}/messages/{messageId}')
    .onCreate(async (snapshot, context) => {
        const messageData = snapshot.val();
        const { senderId, message } = messageData;

        // Hedef kullanıcının deviceToken'ını alın
        const chatId = context.params.chatId;
        const receiverId = chatId.split('_').find(id => id !== senderId);
        const userRef = admin.database().ref(`users/${receiverId}/deviceToken`);
        const tokenSnapshot = await userRef.once('value');
        const deviceToken = tokenSnapshot.val()?.token;

        if (!deviceToken) {
            console.log('Device token bulunamadı.');
            return null;
        }

        // FCM Bildirimi Gönderme
        const payload = {
            notification: {
                title: 'Yeni Mesajınız Var!',
                body: message,
            },
        };

        try {
            await admin.messaging().sendToDevice(deviceToken, payload);
            console.log('Bildirim gönderildi!');
        } catch (error) {
            console.error('Bildirim gönderme hatası:', error);
        }

        return null;
    });
