import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    FlatList,
    Image,
    RefreshControl,
    Text,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Platform, StatusBar, SafeAreaView, ActivityIndicator, Modal, Button
} from 'react-native';
import products from '../../assets/products.ts';
import {Product} from '../../models';
import Colors from '../../../Constants/colors.ts';
import {db} from '../../../services/firebase';
import HomeItem from '../../HomeItem';

import ProductItem from '../HomeItem/HomeItem.tsx';

import {useFocusEffect} from "@react-navigation/native";
import ImageCarousel from "../../components/ImageCarousel";

import BannerSlider from "../../components/BannerSlider";
import colors from "../../../Constants/colors.ts";
import {Header} from "@rneui/themed";
import styles from "../../components/FavoriteProductItem/styles.ts";

//import {where} from "firebase/firestore";

import { firestore } from "../../../services/firebase";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {Color} from "@react-native-google-signin/google-signin/lib/typescript/src/buttons/statics";
//import ProductModal from "../../components/HomeDetailModal";
import HomeDetailScreen from "../HomeDetailScreen.tsx";

function Index({ navigation }: { navigation: any }) {

    ///
    /*
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [lastVisible, setLastVisible] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);

     */

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [lastVisible, setLastVisible] = useState(null);
    const [refreshing, setRefreshing] = useState(false);


    const { width, height } = Dimensions.get('window');

    // Veriyi çekmek için bileşen yüklendiğinde veri çekme işlemi
    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            let adsRef = firestore().collection('Ads');

            // Durum filtresi
            adsRef = adsRef.where("status", "==", 'publish');
            adsRef = adsRef.where("deletedAt", "==", null);

            // Sadece ilk 5 veriyi çekiyoruz
            adsRef = adsRef.limit(5);

            const querySnapshot = await adsRef.get();

            const newDataList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            if (newDataList.length > 0) {
                setData(newDataList);
                setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
            }
        } catch (error) {
            console.error('Veri çekme hatası:', error);
        } finally {
            setLoading(false);
        }
    };


    const loadMoreData = async () => {
        if (loadingMore || !lastVisible) return; // Yükleme devam ediyorsa veya daha fazla veri yoksa çık
        setLoadingMore(true);

        try {

            let nextQuery = firestore().collection('Ads');

            // Durum filtresi
            nextQuery = nextQuery.where("status", "==", 'publish');
            nextQuery = nextQuery.where("deletedAt", "==", null);
            nextQuery = nextQuery.startAfter(lastVisible);

            nextQuery = nextQuery.limit(3);

            const querySnapshot = await nextQuery.get();

            const newDataList = querySnapshot.docs.map((doc) => ({
                id: doc.id, // Firestore'un otomatik oluşturduğu benzersiz ID
                ...doc.data(),
            }));

            setData((prevData) => [...prevData, ...newDataList]);

            // Son görünen belgeyi güncelle
            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        } catch (error) {
            console.error('Daha fazla veri yükleme hatası:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    // Sayfa yenileme işlemi
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchInitialData().then(() => setRefreshing(false));  // Verileri yenile
    }, []);

    /*
    const getData = async () => {
        try {
            let adsRef = firestore().collection('Ads');

            // Durum filtresi
            adsRef = adsRef.where("status", "==", 'publish');
            adsRef = adsRef.where("deletedAt", "==", null);


            // Veriyi Firestore'dan çek
            const querySnapshot = await adsRef.get();
            const dataList = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

            // Elde edilen veriyi duruma kaydet
            setData(dataList);
            //console.log( 'burası dataList'+dataList);
            // navigation.navigate('SearchResults', { adsData: dataList });

        } catch (error) {
            console.error("Veri çekme hatası:", error);
        }
    };


    const loadMoreData = async () => {
        if (loadingMore || !lastVisible) return;
        setLoadingMore(true);

        try {
            // @ts-ignore
            const nextQuery = firestore().query(
                collection('Ads'),
                orderBy('createdAt', 'desc'),
                startAfter(lastVisible),
                limit(10)
            );

            const querySnapshot = await getDocs(nextQuery);
            const newDataList = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
            // @ts-ignore
            setData((prevData) => [...prevData, ...newDataList]);

            // Son dökümanı güncelle
            // @ts-ignore
            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        } catch (error) {
            console.error("Daha fazla veri yükleme hatası:", error);
        } finally {
            setLoadingMore(false);
        }
    };
    */
    //
    const [favoriteProducts, setFavoriteProducts] = useState<Product[]>(
        []
    );

    useEffect(() => {
        setFavoriteProducts(products);
        return () => {
            setFavoriteProducts([]);
        };
    }, []);

    // FlatList için header bileşeni
    const renderHeader = () => (
        <View style={{marginBottom: 5}}>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
                //borderBottomWidth: 1,
                //borderBottomColor: '#EAEAEA',
                shadowColor: '#000',
                shadowRadius: 1,
                shadowOpacity: 1,
                shadowOffset: 10,
                width: '100%',
                marginBottom: 0,
                height: 80,
            }}>
                <Image
                    source={require('../../assets/logoM.png')} // Resim yolu
                    style={{width: 40, height: 30}} // Resmin boyutları
                />
                <Text style={{fontSize: 24, fontWeight: 'bold', color: colors.motored, marginLeft: 5}}>
                    Motoilanlari
                </Text>
            </View>

            <BannerSlider />

            {/* "Son İlanlar" Başlığı */}
            <Text style={{
                fontSize: 23,
                fontWeight: 'bold',
                color: Colors.motored,
                marginLeft: 5,
                marginTop: 15,
                marginBottom:5
            }}>
                Son İlanlar
            </Text>
        </View>
    );

    /*
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getData().then(() => setRefreshing(false));
    }, []);


                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
     */

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null); // Seçilen ürün bilgisi

    // Modal'ı aç ve seçili ürünü ayarla
    const handleProductPress = (product) => {
        setSelectedProduct(product);
        setModalVisible(true);
    };

    return (
        <>
            {/* <SafeAreaView>
           <Header backgroundColor={Colors.motoDarkGray} containerStyle={{
               ...Platform.select({
                   ios: {
                       shadowColor: '#000',
                       shadowOpacity: 0.1,
                       shadowRadius: 3,
                       shadowOffset: { width: 0, height: 3 },
                   },
                   android: {
                       elevation: 3, // Android gölgesi
                   },
               }),
               marginBottom: 10,
               height: 85,
           }} centerComponent={
                       <View style={{
                           flexDirection: 'row',
                           alignItems: 'center', // Dikeyde ortalama
                           justifyContent: 'center', // Yatayda ortalama
                       }}>
                           <Image
                               source={require('../../assets/logoM.png')} // Resim yolu
                               style={{ width: 40, height: 30, marginRight: 10 }} // Resim boyutları
                           />
                           <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.motored }}>
                               Motoilanlari
                           </Text>
                       </View>
                   }>
           </Header>
       </SafeAreaView>*/}
        <View>
            <FlatList
                style={{paddingVertical:0, paddingHorizontal: 15, marginBottom: 0, paddingBottom: 0}}
                data={data}
                renderItem={({item}) => (
                    <HomeItem product={item} />
                )}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id || `${item.createdAt}-${Math.random()}`}
                ListHeaderComponent={renderHeader}
                onEndReached={loadMoreData}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    loadingMore ? <ActivityIndicator size="small" color={Colors.motored} /> : null
                }
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
        </>
    );
}

export default Index;
