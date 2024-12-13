import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Switch, Image, Alert, FlatList,Modal, ActivityIndicator, } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {faCamera, faImages, faTimes, faCircleInfo, faMotorcycle} from '@fortawesome/free-solid-svg-icons';
import { Picker } from '@react-native-picker/picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Colors from '../../../Constants/colors.ts';
import cities from '../../assets/cities.json';
import { useNavigation } from '@react-navigation/native';

//import {collection, addDoc, getDocs, doc, deleteDoc, updateDoc} from '@react-native-firebase/firestore';
//import { ref, uploadBytes, getDownloadURL} from 'firebase/storage';

import {auth, firestore, storage} from '../../../services/firebase';
import {getBrandAndModelsData} from "../../utils/brandAndModelsUtils";
import colors from "../../../Constants/colors.ts";

function Index({ route }) {

    const navigation = useNavigation();
    const [photoUris, setPhotoUris] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [city, setCity] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
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
    const years = Array.from({ length: currentYear - 1960 + 1 }, (_, i) => currentYear - i);
    const [deletedAt, setDeletedAt] = useState<string | null>(null);

    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const { product } = route.params;
    const [productDetails, setProductDetails] = useState(product);

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
            setSelectedModel('');
            const brandData = brands.find((brand) => brand.brand === selectedBrand);
            setModels(brandData ? brandData.models : []);
        } else {
            setModels([]);
        }
    }, [selectedBrand, brands]);

    useEffect(() => {
        // You can perform any logic on the data here if needed
        console.log('Received Product:', productDetails);
    }, [productDetails]);

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


    //Firebase Veri Silme
    const deleteData = async ()=>{
        //await deleteDoc(doc(db, 'Ads', '1scfN27WJ2LJNSegm3LQ'));
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
            const dataList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setData(dataList);
        } catch (error) {
            console.error("Veri çekme hatası:", error);
        }
    };

    //Firebase Fotoğraf Yükleme
    const handleUploadPhotos = async () => {
        if (photoUris.length === 0) {
            Alert.alert('Hata', 'Lütfen en az bir fotoğraf seçin.');
            return;
        }

        const uploadedUrls = [];

        for (let i = 0; i < photoUris.length; i++) {
            const uri = photoUris[i];
            console.log(uri);
            const response = await fetch(uri);
            const blob = await response.blob(); // Fotoğrafı blob formatına çeviriyoruz
            const storageRef = storage().ref(`ilanlar/${new Date().getTime()}_${i}.jpg`);
            await storageRef.put(blob); // Firebase Storage'a yükleme işlemi
            const downloadURL = await storageRef.getDownloadURL(); // Yükleme sonrası URL alma işlemi
            uploadedUrls.push(downloadURL); // URL'yi kaydetme
        }

        return uploadedUrls;
    };

    const updateAd = async () => {
        const adRef = firestore().collection('Ads').doc(product.id); // product.id, güncellemek istediğiniz ilanın ID'si
        // Fiyat ve KM alanlarını noktalarından arındır
        const numericPrice = parseInt(price.replace(/\./g, ''), 10); // Noktaları kaldırıp tam sayı olarak kaydedin
        const numericKm = parseInt(km.replace(/\./g, ''), 10);       // Noktaları kaldırıp tam sayı olarak kaydedin

        try {
            // Güncellenen alanları içeren obje
            const updatedData = {
                title: title,
                description: description,
                city: city,
                brand: setBrand,
                model: selectedModel,
                fuelType: fuelType,
                transmission: transmission,
                modelYear: modelYear,
                enginePower: enginePower,
                hasDamage: hasDamage,
                hasTradeIn: hasTradeIn,
                isNumberView: isNumberView,
                price: numericPrice,  // Noktaları kaldırılmış Fiyat
                km: numericKm,        // Noktaları kaldırılmış KM
                photoUrls: photoUris, // Fotoğraf URL'leri
            };

            // Güncelleme işlemi
            await adRef.update(updatedData);

            Alert.alert('Başarılı', 'İlan başarıyla güncellendi!');
        } catch (error) {
            console.error("Güncelleme hatası: ", error);
            Alert.alert('Hata', 'İlan güncellenirken bir hata oluştu.');
        }
    };
    const updateData = async () => {
        // Formu kontrol et, eksik bilgi varsa fonksiyonu sonlandır
        if (!validateForm()) return;

        if (userId == null || !productDetails.id) return;

        // Yükleniyor animasyonunu göster
        setLoading(true);

        // Fiyat ve KM alanlarını noktalarından arındır
        const numericPrice = parseInt(price.replace(/\./g, ''), 10); // Noktaları kaldırıp tam sayı olarak kaydedin
        const numericKm = parseInt(km.replace(/\./g, ''), 10);       // Noktaları kaldırıp tam sayı olarak kaydedin

        try {
          // Fotoğrafları Storage'a yükle
            const photoUrls = await handleUploadPhotos();

            console.log(photoUrls);
            return photoUrls;

            // Yalnızca değişen alanları bir nesnede toplayın
            const updatedFields = {};

            if (title !== productDetails.title) updatedFields.title = title;
            if (description !== productDetails.description) updatedFields.description = description;
            if (city !== productDetails.city) updatedFields.city = city;
            if (brand !== productDetails.brand) updatedFields.brand = brand;
            if (model !== productDetails.model) updatedFields.model = model;
            if (fuelType !== productDetails.fuelType) updatedFields.fuelType = fuelType;
            if (transmission !== productDetails.transmission) updatedFields.transmission = transmission;
            if (modelYear !== productDetails.modelYear) updatedFields.modelYear = modelYear;
            if (enginePower !== productDetails.enginePower) updatedFields.enginePower = enginePower;
            if (hasDamage !== productDetails.hasDamage) updatedFields.hasDamage = hasDamage;
            if (hasTradeIn !== productDetails.hasTradeIn) updatedFields.hasTradeIn = hasTradeIn;
            if (isNumberView !== productDetails.isNumberView) updatedFields.isNumberView = isNumberView;
            if (price !== productDetails.price) updatedFields.price = numericPrice;
            if (km !== productDetails.km) updatedFields.km = numericKm;
            if (JSON.stringify(photoUrls) !== JSON.stringify(productDetails.photoUrls)) {
                updatedFields.photoUrls = photoUrls;
            }
            if (category !== productDetails.category) updatedFields.category = category;
            if (status !== productDetails.status) updatedFields.status = status;
            if (payment !== productDetails.payment) updatedFields.payment = payment;
            if (deletedAt !== productDetails.deletedAt) updatedFields.deletedAt = deletedAt;

            // Veritabanındaki belgeyi güncelle
            const icerikguncelle = firestore().collection('Ads').doc(productDetails.id);  // Dinamik olarak ilan id'sini kullan
            console
            await updateDoc(icerikguncelle, {
                ...updatedFields,
                updatedAt: new Date()  // Güncellenme tarihi ekle
            });

            console.log("Veriler başarıyla güncellendi!");
            Alert.alert('Başarılı', 'İlan başarıyla güncellendi.');
            // Güncelleme işleminden sonra istenirse yönlendirme
            navigation.navigate('InstagramScreen');
        } catch (e) {
            console.error('Veri güncelleme hatası:', e);
            Alert.alert('Hata', 'İlan güncellenirken bir hata oluştu.');
        } finally {
            // Yükleniyor animasyonunu kapat
            setLoading(false);
        }
    };
    // Firebase Veri Gönderme
    const sendData = async () => {

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
                brand,            // Marka
                model,            // Model
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
                console.log("bu ilk foto "+photoUris)
            }
        });
    };

    const handleTakePhoto = () => {
        launchCamera({ mediaType: 'photo' }, (response) => {
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
        if (!title || !city || !selectedBrand || !selectedModel || !fuelType || !transmission || !modelYear || !enginePower || !price || !km || !photoUris) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validateForm()) {return;}

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
        });

        // İlan verilecek sayfaya yönlendirme yapabiliriz
        navigation.navigate('InstagramScreen', {title, city, selectedBrand, selectedModel, fuelType, transmission, modelYear, enginePower, hasDamage, hasTradeIn,isNumberView, price, km, photoUris,category, status, payment, userId, deletedAt });
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

    //Veritabanından verileri yerlerine koyuyoruz
    useEffect(() => {
        if (productDetails) {
            setTitle(productDetails.title || '');
            setDescription(productDetails.description || '');
            setCity(productDetails.city || '');
            setSelectedBrand(productDetails.brand || '');
            setSelectedModel(productDetails.model || '');
            setFuelType(productDetails.fuelType || '');
            setTransmission(productDetails.transmission || '');
            setModelYear(productDetails.modelYear || '');
            setEnginePower(productDetails.enginePower || '');
            setHasDamage(productDetails.hasDamage || false);
            setHasTradeIn(productDetails.hasTradeIn || false);
            setIsNumberView(productDetails.isNumberView || false);
            setPrice(productDetails.price || '');
            console.log(productDetails.price);
            setKm(productDetails.km || '');
            setPhotoUris(productDetails.photoUrls || []);
        }
    }, [productDetails]);


    // Güncelleme Fonksiyonu
    const updateData2 = async () => {
        if (!validateForm()) return;

        setLoading(true);  // Yükleniyor durumunu başlat

        try {
            // Güncellenecek dokümanın referansı
            const adDocRef = firestore().collection('Ads').doc(product.id);

            const updatedFields = {};

            // Alanlar arasında değişiklik kontrolü
            if (title !== product.title) updatedFields.title = title;
            if (description !== product.description) updatedFields.description = description;
            if (city !== product.city) updatedFields.city = city;
            if (selectedBrand !== product.brand) updatedFields.brand = selectedBrand;
            if (selectedModel !== product.model) updatedFields.model = selectedModel;
            if (fuelType !== product.fuelType) updatedFields.fuelType = fuelType;
            if (transmission !== product.transmission) updatedFields.transmission = transmission;
            if (modelYear !== product.modelYear) updatedFields.modelYear = modelYear;
            if (enginePower !== product.enginePower) updatedFields.enginePower = enginePower;
            if (hasDamage !== product.hasDamage) updatedFields.hasDamage = hasDamage;
            if (hasTradeIn !== product.hasTradeIn) updatedFields.hasTradeIn = hasTradeIn;
            if (isNumberView !== product.isNumberView) updatedFields.isNumberView = isNumberView;
            if (price !== product.price) updatedFields.price = numericPrice;
            if (km !== product.km) updatedFields.km = numericKm;

            const photoUrls = await handleUploadPhotos();

            if (photoUris.length >= 1) {
                if (JSON.stringify(photoUris) !== JSON.stringify(productDetails.photoUrls)) {
                    updatedFields.photoUrls = photoUris;
                }
            } else {
                return Alert.alert('Lütfen en az bir fotoğraf seçin!');
            }

            // Eğer güncellenecek alanlar varsa
            if (Object.keys(updatedFields).length > 0) {
                await adDocRef.update(updatedFields); // Firestore güncelleme işlemi
                console.log('Doküman başarıyla güncellendi!');
            } else {
                console.log('Hiçbir alan güncellenmedi.');
            }

            // Güncelleme tamamlandığında yeni veriyi çekin
            await fetchProductData();
        } catch (error) {
            console.log("Error updating document:", error);
        } finally {
            setLoading(false);  // Yükleniyor durumunu kapat
        }
    };

    // Veritabanından güncel veriyi çekme fonksiyonu
    const fetchProductData = async () => {
        try {
            const docRef = firestore().collection('Ads').doc(product.id);
            const docSnap = await docRef.get();

            if (docSnap.exists) {
                setProductDetails(docSnap.data());
                console.log("Product data:", docSnap.data());
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.log("Error fetching document:", error);
        }
    };

    useEffect(() => {
        // Bileşen yüklendiğinde veriyi çekin
        fetchProductData();
    }, []);

    return (
        <ScrollView contentContainerStyle={{ backgroundColor: Colors.motoBackgroundColor, padding: 20 }}>
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
                            <Image source={{ uri }} style={styles.imagePreview} />
                            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePhoto(uri)}>
                                <FontAwesomeIcon icon={faTimes} size={20} color={Colors.motored} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}
            {/* Yükleniyor animasyonu ve sayfa engelleyici */}
            {loading && (
                <Modal transparent={true} animationType="fade">
                    <View style={styles.overlay}>
                        <ActivityIndicator size="large" color="#ffffff" />
                        <Text style={styles.loadingText}>Yükleniyor...</Text>
                    </View>
                </Modal>
            )}

            {/* İlan Başlığı */}
            <Text style={styles.label}>İlan Başlığı</Text>
            <TextInput
                placeholder="İlan Başlığı"
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
                    >
                        <Picker.Item label="Şehir Seçin" value="" />
                        {cities.map((item, index) => (
                            <Picker.Item key={index} label={item.name} value={item.name} />
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
                    >
                        <Picker.Item label="Yakıt Türü Seçin" value="" />
                        <Picker.Item label="Benzin" value="benzin" />
                        <Picker.Item label="Elektrik" value="elektrik" />
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
                    >
                        <Picker.Item label="Vites Türü Seçin" value="" />
                        <Picker.Item label="Manuel" value="manuel" />
                        <Picker.Item label="Otomatik" value="otomatik" />
                    </Picker>
                </View>
            </View>

            {/* Model Yılı */}
            <View>
                <Text style={styles.label}>Model Yılı</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={modelYear.toString()}
                        style={styles.picker}
                        onValueChange={(itemValue) => setModelYear(itemValue)} // Değeri doğrudan kaydediyoruz
                    >
                        <Picker.Item label="Model Yılı Seçin" value="" />
                        {years.map((year) => (
                            <Picker.Item key={year} label={year.toString()} value={year.toString()} />
                        ))}
                    </Picker>
                </View>
            </View>

            <Text style={styles.label}>Motor Gücü (cc)</Text>
            <TextInput
                placeholder="Motor Gücü Giriniz"
                value={enginePower.toString()}  // Değeri string olarak gösteriyoruz
                onChangeText={(text) => setEnginePower(parseFloat(text) || 0)}  // Sayıya çeviriyoruz, boşsa 0 yapıyoruz
                keyboardType="numeric"    // Sayısal klavye açmak için
                style={styles.input}
            />

            <Text style={styles.label}>Fiyat</Text>
            <TextInput
                placeholder="Fiyat giriniz"
                value={price.toString()}
                onChangeText={handlePriceChange}
                keyboardType="numeric"
                style={styles.input}
            />

            <Text style={styles.label}>Kilometre (KM)</Text>
            <TextInput
                placeholder="Kilometre Giriniz"
                value={km.toString()}
                onChangeText={handleKmChange}
                keyboardType="numeric"
                style={styles.input}
            />

            <Text style={styles.labelDes}>Açıklama</Text>
            <TextInput
                placeholder="İlan Açıklaması"
                value={description}
                onChangeText={handleDescriptionChange}
                keyboardType="default"
                style={styles.inputDes}
                multiline={true}
                maxLength={2000} // Kullanıcıya karakter sınırlamasını gösterir
            />
            <Text style={styles.characterCount}>{description.length} / 2000</Text>


            <View style={styles.switchContainer}>
                <Text style={styles.label}>Hasar Kaydı Var mı?</Text>
                <Switch value={hasDamage} onValueChange={setHasDamage} />
            </View>
            <View style={styles.switchContainer}>
                <Text style={styles.label}>Takas Var mı?</Text>
                <Switch value={hasTradeIn} onValueChange={setHasTradeIn} />
            </View>

            <View style={styles.switchContainerr}>
                <Text style={styles.label}>Telefon Numarası Gizlensin mi?</Text>

                {/* Bilgi simgesi olarak FontAwesome ikonu */}
                <TouchableOpacity onPress={handleInfoPress} style={styles.infoIcon}>
                    <FontAwesomeIcon icon={faCircleInfo} size={20} color="gray" />
                </TouchableOpacity>

                <Switch style={{flex: 1}} value={isNumberView} onValueChange={setIsNumberView} />
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
                        <FontAwesomeIcon icon={faCircleInfo} size={20} color="#ff3333" style={{ marginRight: 8 }} />
                        <Text>Bu alanı aktif ederseniz telefon numaranız kullanıcılardan gizlenecektir.</Text>
                    </View>
                </TouchableOpacity>

            </Modal>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />  // Yükleniyor göstergesi
            ) : (
                <View>
                    <TouchableOpacity style={styles.submitButton} onPress={updateData2}>
                        <Text style={styles.submitButtonText}>İlanı Güncelle</Text>

                    </TouchableOpacity>
                </View>
            )}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.motoText1
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
        color: Colors.motoText1
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
        borderColor: Colors.motoText2,
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 10,
        padding: 10,
    },
    label: {
        marginBottom: 5,
        marginTop: 10,
        color: Colors.motoText1,
    },
    picker: {
        height: 50,
        width: '100%',
        color: Colors.motoText2
    },
    input: {
        backgroundColor: Colors.motoBoxBackgroundColor,
        borderColor: Colors.motoBoxBackgroundColor,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        color: Colors.motoText1
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
        //color: Colors.motoGray,
    },
    submitButton: {
        backgroundColor: Colors.motored,
        borderRadius: 10,
        padding: 15,
        marginTop: 10,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    pickerWrapper: {
        borderWidth: 1,            // Sınır ekleme
        borderColor: Colors.motoBoxBackgroundColor,    // Sınır rengi
        borderRadius: 10,          // Kenarların yuvarlatılması
        overflow: 'hidden',        // Kenar dışı taşan içeriği gizlemek için
    },
    container: {
        flex: 1,
        padding: 20,
    },
    itemContainer: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#EAEAEA',
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
        fontWeight: '400',
        marginBottom: 5,
        color: Colors.motoText1,
    },
    inputDes: {
        backgroundColor: Colors.motoBoxBackgroundColor,
        height: 100,
        borderColor: Colors.motoBoxBackgroundColor,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 14,
        textAlignVertical: 'top',
        color: Colors.motoText2,
    },
    characterCount: {
        marginTop: 5,
        fontSize: 12,
        color: '#888',
    },
    item: {
        fontSize: 18,
        marginBottom: 10,
    },

});

export default Index;
