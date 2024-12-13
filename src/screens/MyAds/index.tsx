import React, {useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MyAdsItem from '../../MyAdsItem';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faMotorcycle} from "@fortawesome/free-solid-svg-icons";
import Colors from "../../../Constants/colors.ts";

function Index() {
    const [myAdsData, setMyAdsData] = useState([]);
    const [loading, setLoading] = useState(true); // Veri yüklenirken durum

    const [myAdsCount, setMyAdsCount] = useState(0);

    useEffect(() => {
        const user = auth().currentUser;
        if (user) {
            fetchUserAds(user.uid);
        }
        return () => setMyAdsData([]);
    }, []);

    const fetchUserAds = async (uid) => {
        setLoading(true);
        try {
            const snapshot = await firestore()
                .collection('Ads')
                .where('userId', '==', uid) // Kullanıcıya ait ilanları filtrele
                .where('status', '==', 'publish') // Durumu "publish" olanları filtrele
                .where('deletedAt', '==', null) // Silinmemiş olanları filtrele
                .get();

            const userAds = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setMyAdsData(userAds);
        } catch (error) {
            console.error("İlanları çekerken hata oluştu:", error);
        }
        setLoading(false);
    };

    if (myAdsData.length === 0) {
        return (
            <View style={{
                backgroundColor: Colors.motoBackgroundColor,
                display: 'flex',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
                padding: 0,
                borderRadius: 0,
                width: '100%',
                flex: 1
            }}>
                <FontAwesomeIcon icon={faMotorcycle} size={70} color={Colors.motoText1}> </FontAwesomeIcon>
                <Text style={{marginTop: 20, color: Colors.motoText1}}>Henüz hiç ilan yayınlamadınız.</Text>
            </View>
        )
    }

    return (
        <View style={{flex: 1, backgroundColor: Colors.motoBackgroundColor, padding: 15}}>
            {loading ? (
                <Text>Yükleniyor...</Text> // Veriler yüklenirken gösterilecek
            ) : (
                <FlatList
                    data={myAdsData}
                    renderItem={({item}) => (
                        <MyAdsItem product={item}/>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

export default Index;
