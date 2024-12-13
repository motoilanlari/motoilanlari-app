import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCamera, faCircleInfo, faImages, faTimes} from '@fortawesome/free-solid-svg-icons';
import {Picker} from '@react-native-picker/picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Colors from '../../../Constants/colors.ts';
import cities from '../../assets/cities.json';
import {useNavigation} from '@react-navigation/native';
import {addDoc, collection, deleteDoc, doc, getDocs, updateDoc} from '@react-native-firebase/firestore';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';

import {auth, storage, firestore} from '../../../services/firebase';
import { getBrandAndModelsData } from '../../utils/brandAndModelsUtils';
import colors from "../../../Constants/colors.ts";

function AddScreen() {

    const navigation = useNavigation();
    const [photoUris, setPhotoUris] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [city, setCity] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedModel, setSelectedModel] = useState('');

    const [fuelType, setFuelType] = useState('');
    const [transmission, setTransmission] = useState('');
    const [enginePower, setEnginePower] = useState('');
    const [hasDamage, setHasDamage] = useState(false);
    const [hasTradeIn, setHasTradeIn] = useState(false);
    const [isNumberView, setIsNumberView] = useState(false);
    const [price, setPrice] = useState('');
    const [km, setKm] = useState('');
    const [category, setCategory] = useState('Motorcycle');
    const [status, setStatus] = useState('publish');
    const [payment, setPayment] = useState('free');
    const [userId, setUserId] = useState<string | boolean>(false);
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: currentYear - 1960 + 1}, (_, i) => currentYear - i);
    const [deletedAt, setDeletedAt] = useState<string | null>(null);
    // const [modelYear, setModelYear] = useState(currentYear);

    useEffect(() => {
        const user = auth().currentUser;
        if (user) {
            setUserId(user.uid);
        } else {
            navigation.navigate('ProfileScreen');
        }
    }, []);

    const [modelYear, setModelYear] = useState(""); // Varsayılan olarak boş bir değer

    const formatNumberWithDots = (text) => {
        // Sadece sayıları kabul eder ve binlik basamakları noktayla ayırır
        const cleanText = text.replace(/[^0-9]/g, '');  // Sadece sayıları al
        return cleanText.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Binlikleri nokta ile ayır
    };

    const handlePriceChange = (text) => {
        setPrice(formatNumberWithDots(text));
    };

    const handleKmChange = (text) => {
        setKm(formatNumberWithDots(text));
    };

    // Form alanlarını sıfırlama fonksiyonu
    const resetFormFields = () => {
        setTitle('');
        setDescription('');
        setCity('');
        setBrand('');
        setModel('');
        setFuelType('');
        setTransmission('');
        setModelYear('');
        setEnginePower('');
        setHasDamage(false);
        setHasTradeIn(false);
        setIsNumberView(false);
        setPrice('');
        setKm('');
        setCategory('Motorcycle');
        setStatus('publish');
        setPayment('free');
        setUserId(false);
        setPhotoUris([]);
        setDeletedAt(null);
        setSelectedModel('');
        setSelectedBrand('')
    };

    const [brands, setBrands] = useState([]); // Markalar
    const [models, setModels] = useState([]); // Modeller

    // Markaları yükleme
    useEffect(() => {
        const fetchBrands = async () => {
            const data = await getBrandAndModelsData();
            console.log(data);
            if (data) {
                setBrands(data);
            }
        };
        fetchBrands();
    }, []);

    // Marka seçildiğinde modelleri filtreleme
    useEffect(() => {
        if (selectedBrand) {
            const brandData = brands.find((brand) => brand.brand === selectedBrand);
            setModels(brandData ? brandData.models : []);
        } else {
            setModels([]);
        }
    }, [selectedBrand, brands]);

    // Veriyi çekmek için useEffect kullanarak bileşen yüklendiğinde veri çekme işlemi yapılır.
    useEffect(() => {
        getData();
    }, []);
    //Firebase Veri Güncelleme
    const updateData = async () => {
        try {
            const docRef = firestore().collection('Ads').doc('48NKf6zzyO2NQ7YB6psf');
            await docRef.update({
                content: 'Yamaha',
            });
            console.log('Veri başarıyla güncellendi.');
        } catch (error) {
            console.error('Veri güncelleme hatası:', error);
        }
    };

    //Firebase Veri Silme
    const deleteData = async () => {
        await deleteDoc(doc(db, 'Ads', '1scfN27WJ2LJNSegm3LQ'));
    };
    //Firebase Veri Çekme
    const [data, setData] = useState([]);

    // Veriyi çekmek için useEffect kullanarak bileşen yüklendiğinde veri çekme işlemi yapılır.
    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const querySnapshot = await firestore().collection('Ads').get();
            const dataList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setData(dataList);
        } catch (error) {
            console.error("Veri çekme hatası:", error);
        }
    };

    // const renderItem = ({ item }) => (
    //     <View style={styles.itemContainer}>
    //         <Text style={styles.itemTitle}>{item.title}</Text>
    //         <Text style={styles.itemContent}>İçerik: {item.content}</Text>
    //         <Text style={styles.itemPrice}>Fiyat: {item.price}</Text>
    //     </View>
    // );
    //Firebase Fotoğraf Yükleme
    const handleUploadPhotos = async () => {
        if (photoUris.length === 0) {
            Alert.alert('Hata', 'Lütfen en az bir fotoğraf seçin.');
            return;
        }

        try {
            const uploadedUrls = [];

            for (let i = 0; i < photoUris.length; i++) {
                const uri = photoUris[i];
                console.log(`Yükleniyor: ${uri}`);

                // Fotoğrafı fetch ile al
                const response = await fetch(uri);
                const blob = await response.blob(); // Blob formatına dönüştür

                // Firebase Storage referansı oluştur
                const timestamp = new Date().getTime();
                const storageRef = storage().ref(`ilanlar/${timestamp}_${i}.jpg`);

                // Fotoğrafı Storage'a yükle
                await storageRef.put(blob);

                // Yükleme sonrası indirme bağlantısını al
                const downloadURL = await storageRef.getDownloadURL();
                console.log(`Yükleme tamamlandı: ${downloadURL}`);

                // URL'yi kaydet
                uploadedUrls.push(downloadURL);
            }

            return uploadedUrls; // Tüm URL'leri döndür
        } catch (error) {
            console.error('Fotoğraf yükleme hatası:', error);
            throw error;
        }
    };

    // Firebase Veri Gönderme
    const sendData = async () => {
        // İlan verilecek bilgileri console.log ile kontrol edebiliriz
        console.log({
            title,
            description,
            city,
            brand,
            model,
            fuelType,
            transmission,
            modelYear,
            enginePower,
            hasDamage,
            hasTradeIn,
            isNumberView,
            price,
            km,
            photoUris,
            category,
            status,
            payment,
            userId,
            deletedAt,
            selectedModel,
            selectedBrand,
        });
        // Formu kontrol et, eksik bilgi varsa fonksiyonu sonlandır
        if (!validateForm()) return;

        if (userId == null) return;

        // Yükleniyor animasyonunu göster
        setLoading(true);

        // Fiyat ve KM alanlarını noktalarından arındır
        const numericPrice = parseInt(price.replace(/\./g, ''), 10); // Noktaları kaldırıp tam sayı olarak kaydedin
        const numericKm = parseInt(km.replace(/\./g, ''), 10);       // Noktaları kaldırıp tam sayı olarak kaydedin

        try {
            // Fotoğrafları Storage'a yükle
            const photoUrls = await handleUploadPhotos();
            // İlan bilgilerini Firebase'e gönder
            const docRef = await firestore().collection('Ads').add({
                userId,           // Giriş yapan kullanıcı id'si
                title,            // Başlık
                description,      //İlan açıklaması
                city,             // Şehir
                brand: selectedBrand,            // Marka
                model: selectedModel,            // Model
                fuelType,         // Yakıt Türü
                transmission,     // Vites Türü
                modelYear,        // Model Yılı
                enginePower,      // Motor Gücü (cc)
                hasDamage,        // Hasar Kaydı var mı?
                hasTradeIn,       // Takas var mı?
                isNumberView,     // Telefon Numarası Gizlensin mi?
                price: numericPrice,  // Noktaları kaldırılmış Fiyat
                km: numericKm,        // Noktaları kaldırılmış KM
                photoUrls,        // Fotoğraflar
                category,         // Kategori
                status,           // İlan Durumu
                payment,          // İlan Ödemesi
                deletedAt,        //Silinme tarihi
                createdAt: new Date(), // Oluşturulma tarihi
            });
            console.log('Document written with ID: ', docRef.id);
            Alert.alert('Başarılı', 'İlan başarıyla kaydedildi.');
            // Formu sıfırlama işlemi
            resetFormFields();
            // İlan verildikten sonra kullanıcıyı başka bir sayfaya yönlendirme
            navigation.navigate('InstagramScreen');
        } catch (e) {
            console.error('Error adding document: ', e);
            Alert.alert('Hata', 'İlan kaydedilirken bir hata oluştu.');
        } finally {
            // Yükleniyor animasyonunu kapat
            setLoading(false);
        }
    };

    const handleChoosePhotos = () => {
        launchImageLibrary({
            mediaType: 'photo',
            selectionLimit: 10 - photoUris.length,
        }, (response) => {
            if (!response.didCancel && !response.error) {
                const uris = response.assets.map(asset => asset.uri);
                setPhotoUris(prevUris => [...prevUris, ...uris].slice(0, 10));
            }
        });
    };

    const handleTakePhoto = () => {
        launchCamera({mediaType: 'photo'}, (response) => {
            if (!response.didCancel && !response.error) {
                const uri = response.assets[0].uri;
                setPhotoUris(prevUris => [...prevUris, uri].slice(0, 10));
            }
        });
    };

    const handleDeletePhoto = (uri) => {
        setPhotoUris(prevUris => prevUris.filter(photoUri => photoUri !== uri));
    };

    const validateForm = () => {
        if (!title || !city || !selectedModel || !selectedBrand || !fuelType || !transmission || !modelYear || !enginePower || !price || !km) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        // İlan verilecek bilgileri console.log ile kontrol edebiliriz
        console.log({
            title,
            description,
            city,
            selectedBrand,
            selectedModel,
            fuelType,
            transmission,
            modelYear,
            enginePower,
            hasDamage,
            hasTradeIn,
            isNumberView,
            price,
            km,
            photoUris,
            category,
            status,
            payment,
            userId,
            deletedAt,
        });

        // İlan verilecek sayfaya yönlendirme yapabiliriz
        navigation.navigate('InstagramScreen', {
            title,
            city,
            selectedBrand,
            selectedModel,
            fuelType,
            transmission,
            modelYear,
            enginePower,
            hasDamage,
            hasTradeIn,
            isNumberView,
            price,
            km,
            photoUris,
            category,
            status,
            payment,
            userId,
            deletedAt
        });
    };
    const [loading, setLoading] = useState(false);

    const [showInfo, setShowInfo] = useState(false);

    // Bilgi simgesine basılınca bilgi mesajını göster
    const handleInfoPress = () => {
        setShowInfo(true);
    };

    // Modal dışında bir yere tıklanınca kapat
    const closeInfoModal = () => {
        setShowInfo(false);
    };

    const handleDescriptionChange = (text) => {
        if (text.length <= 2000) {
            setDescription(text);
        }
    };
    return (

        <View style={{flex: 1}}>
        {/* Sol üstte çıkış butonu */}

        <ScrollView contentContainerStyle={{ padding: 20, marginTop: 0 }}>
            {/*  <View style={styles.container}>
               <FlatList
                   data={data}
                   keyExtractor={(item) => item.id}
                   renderItem={renderItem}
                   ListEmptyComponent={<Text>Veri bulunamadı</Text>} // Eğer veri yoksa gösterilecek mesaj
               />
           </View>*/}
            <Text style={styles.title}>Fotoğraflar</Text>

            <View style={styles.photoButtonsContainer}>
                <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
                    <FontAwesomeIcon icon={faCamera} size={40} color={Colors.motored} />
                    <Text style={styles.buttonText}>Fotoğraf Çek</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoButton} onPress={handleChoosePhotos}>
                    <FontAwesomeIcon icon={faImages} size={40} color={Colors.motored} />
                    <Text style={styles.buttonText}>Fotoğrafları Seç</Text>
                </TouchableOpacity>
            </View>

            {photoUris.length > 0 && (
                <View style={styles.imageGrid}>
                    {photoUris.map((uri, index) => (
                        <View key={index} style={styles.imageWrapper}>
                            <Image source={{uri}} style={styles.imagePreview}/>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePhoto(uri)}>
                                <FontAwesomeIcon icon={faTimes} size={20} color={Colors.motored}/>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}
            {/* Yükleniyor animasyonu ve sayfa engelleyici */}
            {loading && (
                <Modal transparent={true} animationType="fade">
                    <View style={styles.overlay}>
                        <ActivityIndicator size="large" color="#ffffff"/>
                        <Text style={styles.loadingText}>Yükleniyor...</Text>
                    </View>
                </Modal>
            )}

            {/* İlan Başlığı */}
            <Text style={styles.label}>İlan Başlığı</Text>
            <TextInput
                placeholder="İlan Başlığı"
                placeholderTextColor={colors.motoText3}

                value={title}
                onChangeText={setTitle}
                keyboardType="default"
                style={styles.input}
            />

            {/* Şehir Seçimi */}
            <View>
                <Text style={styles.label}>Şehir</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={city}
                        onValueChange={(itemValue) => setCity(itemValue)}
                        style={styles.picker}
                        dropdownIconColor={colors.motoText3}
                    >
                        <Picker.Item label="Şehir Seçin" value=""/>
                        {cities.map((item, index) => (
                            <Picker.Item key={index} label={item.name} value={item.name}/>
                        ))}
                    </Picker>
                </View>
            </View>

                {/* Marka Picker */}
                <View>
                    <Text style={styles.label}>Marka</Text>
                    <View style={styles.pickerWrapper}>

                    <Picker
                        selectedValue={selectedBrand}
                        onValueChange={(value) => setSelectedBrand(value)}
                        style={styles.picker}
                        dropdownIconColor={colors.motoText3}
                    >
                        <Picker.Item label="Marka Seçin" value="" />
                        {brands.map((brand, index) => (
                            <Picker.Item key={index} label={brand.brand} value={brand.brand} />
                        ))}
                    </Picker>
                </View>
                </View>

                {/* Model Picker */}
                <View>
                    <Text style={styles.label}>Model</Text>
                    <View style={styles.pickerWrapper}>

                    <Picker
                        selectedValue={selectedModel}
                        onValueChange={(value) => setSelectedModel(value)}
                        style={styles.picker}
                        dropdownIconColor={colors.motoText3}
                        enabled={models.length > 0} // Model yoksa disable
                    >
                        <Picker.Item label="Model Seçin" value="" />
                        {models.map((model, index) => (
                            <Picker.Item key={index} label={model} value={model} />
                        ))}
                    </Picker>
                </View>
                </View>


            {/* Yakıt Türü */}
            <View>
                <Text style={styles.label}>Yakıt Türü</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={fuelType}
                        onValueChange={itemValue => setFuelType(itemValue)}
                        style={styles.picker}
                        dropdownIconColor={colors.motoText3}
                    >
                        <Picker.Item label="Yakıt Türü Seçin" value=""/>
                        <Picker.Item label="Benzin" value="benzin"/>
                        <Picker.Item label="Elektrik" value="elektrik"/>
                    </Picker>
                </View>
            </View>

            {/* Vites Türü */}
            <View>
                <Text style={styles.label}>Vites Türü</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={transmission}
                        onValueChange={itemValue => setTransmission(itemValue)}
                        style={styles.picker}
                        dropdownIconColor={colors.motoText3}
                    >
                        <Picker.Item label="Vites Türü Seçin" value=""/>
                        <Picker.Item label="Manuel" value="manuel"/>
                        <Picker.Item label="Otomatik" value="otomatik"/>
                    </Picker>
                </View>
            </View>

            {/* Model Yılı */}
            <View>
                <Text style={styles.label}>Model Yılı</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={modelYear}
                        style={styles.picker}
                        dropdownIconColor={colors.motoText3}
                        onValueChange={(itemValue) => setModelYear(itemValue)} // Değeri doğrudan kaydediyoruz
                    >
                        <Picker.Item label="Model Yılı Seçin" value=""/>
                        {years.map((year) => (
                            <Picker.Item key={year} label={year.toString()} value={year.toString()}/>
                        ))}
                    </Picker>
                </View>
            </View>

            {/* Motor Gücü */}
            <Text style={styles.label}>Motor Gücü (cc)</Text>
            <TextInput
                placeholder="Motor Gücü Giriniz"
                placeholderTextColor={colors.motoText3}

                value={enginePower.toString()}  // Değeri string olarak gösteriyoruz
                onChangeText={(text) => setEnginePower(parseFloat(text) || 0)}  // Sayıya çeviriyoruz, boşsa 0 yapıyoruz
                keyboardType="numeric"    // Sayısal klavye açmak için
                style={styles.input}
            />

            {/* Fiyat */}
            <Text style={styles.label}>Fiyat</Text>
                <TextInput
                    placeholder="Fiyat giriniz"
                    placeholderTextColor={colors.motoText3}

                    value={price}
                    onChangeText={handlePriceChange}
                    keyboardType="numeric"
                    style={styles.input}
                />

            {/* Kilometre */}
            <Text style={styles.label}>Kilometre (KM)</Text>
                <TextInput
                    placeholder="Kilometre Giriniz"
                    placeholderTextColor={colors.motoText3}

                    value={km}
                    onChangeText={handleKmChange}
                    keyboardType="numeric"
                    style={styles.input}
                />

            {/* Açıklama */}
            <Text style={styles.labelDes}>Açıklama</Text>
            <TextInput
                placeholder="İlan Açıklaması"
                placeholderTextColor={colors.motoText3}

                value={description}
                onChangeText={handleDescriptionChange}
                keyboardType="default"
                style={styles.inputDes}
                multiline={true}
                maxLength={2000} // Kullanıcıya karakter sınırlamasını gösterir
            />
            <Text style={styles.characterCount}>{description.length} / 2000</Text>


            {/* Hasar Kaydı */}
            <View style={styles.switchContainer}>
                <Text style={styles.label}>Hasar Kaydı Var mı?</Text>
                <Switch value={hasDamage} onValueChange={setHasDamage} trackColor={{true: 'white'}} thumbColor={colors.motoText1} />
            </View>

            {/* Takas */}
            <View style={styles.switchContainer}>
                <Text style={styles.label}>Takas Var mı?</Text>
                <Switch value={hasTradeIn} onValueChange={setHasTradeIn} trackColor={{true: 'white'}} thumbColor={colors.motoText1}/>
            </View>

            {/* Telefon Numarası Gizle */}
            <View style={styles.switchContainerr}>
                <Text style={styles.label}>Telefon Numarası Gizlensin mi?</Text>

                {/* Bilgi simgesi olarak FontAwesome ikonu */}
                <TouchableOpacity onPress={handleInfoPress} style={styles.infoIcon}>
                    <FontAwesomeIcon icon={faCircleInfo} size={20} color="gray"/>
                </TouchableOpacity>
                <Switch value={isNumberView} onValueChange={setIsNumberView} trackColor={{true: 'white'}} thumbColor={colors.motoText1}/>
            </View>
            {/* Bilgi Modalı */}
            <Modal
                transparent={true}
                visible={showInfo}
                animationType="fade"
                onRequestClose={closeInfoModal}
            >
                <TouchableOpacity style={styles.modalOverlay} onPress={closeInfoModal}>
                    <View style={[styles.infoBox]}>
                        <FontAwesomeIcon icon={faCircleInfo} size={20} color="#ff3333" style={{marginRight: 8}}/>
                        <Text>Bu alanı aktif ederseniz telefon numaranız kullanıcılardan gizlenecektir.</Text>
                    </View>
                </TouchableOpacity>

            </Modal>

            <TouchableOpacity style={styles.submitButton} onPress={sendData}>
                <Text style={styles.submitButtonText}>İlan Ver</Text>

            </TouchableOpacity>
        </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.motoText3,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: Colors.motored,
        padding: 10,
        borderRadius:100,
    },
    photoButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    photoButton: {
        alignItems: 'center',
        padding: 10,
        backgroundColor: Colors.motoBoxBackgroundColor,
        borderRadius: 10,
        width: '45%',
    },
    buttonText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.motoText3,
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    imageWrapper: {
        position: 'relative',
        width: '48%',
        height: 120,
        marginBottom: 10,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 5,
    },
    SelectBorder: {
        borderColor: colors.motoBoxBackgroundColor,
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 10,
        padding: 10,
    },
    label: {
        marginBottom: 5,
        marginTop: 10,
        color: Colors.motoText3,
    },
    picker: {
        width: '100%',
        color: Colors.motoText3,
        borderWidth: 0,
        backgroundColor: Colors.motoBoxBackgroundColor,
        padding:0,
    },
    input: {
        borderColor: colors.motoBoxBackgroundColor,
        borderWidth: 0,
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        placeholderColor: colors.motoText3,
        color: Colors.motoText3,
        backgroundColor: colors.motoBoxBackgroundColor
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    switch: {
      color: Colors.motoText2,
    },
    submitButton: {
        backgroundColor: Colors.motored,
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    pickerWrapper: {
        borderWidth: 1,            // Sınır ekleme
        borderColor: Colors.motoBoxBackgroundColor,    // Sınır rengi
        color: Colors.motoText3,
        borderRadius: 10,          // Kenarların yuvarlatılması
        overflow: 'hidden',        // Kenar dışı taşan içeriği gizlemek için
        padding:0
    },
    container: {
        flex: 1,
        padding: 20,
    },
    itemContainer: {
        padding: 10,
        borderWidth: 1,
        borderColor: colors.motoBoxBackgroundColor,
        borderRadius: 10,
        marginVertical: 10,
    },
    itemTitle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    itemContent: {
        marginTop: 5,
    },
    itemPrice: {
        marginTop: 5,
        fontWeight: 'bold',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Yarı şeffaf gri katman
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#ffffff',
        marginTop: 10,
        fontSize: 16,
    },
    switchContainerr: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        justifyContent: 'space-between'
    },
    infoIcon: {
        marginLeft: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoBox: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },

    labelDes: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: Colors.motoGray,
    },
    inputDes: {
        height: 100,
        borderColor: colors.motoBoxBackgroundColor,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 14,
        textAlignVertical: 'top',
        backgroundColor: colors.motoBoxBackgroundColor,
        color: colors.motoText3
    },
    characterCount: {
        marginTop: 5,
        fontSize: 12,
        color: '#888',
    },
});

export default AddScreen;
