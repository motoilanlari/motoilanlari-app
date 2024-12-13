import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Alert} from 'react-native';
import Colors from '../../Constants/colors.ts';
import {Picker} from '@react-native-picker/picker';
import cities from '../assets/cities.json';
import {useNavigation} from '@react-navigation/native';

import { getBrandAndModelsData } from '../utils/brandAndModelsUtils';

import {firestore, storage} from '../../services/firebase';
import colors from "../../Constants/colors.ts";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faSearch, faTimes, faTrashRestore} from "@fortawesome/free-solid-svg-icons";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import Toast, {ErrorToast} from "react-native-toast-message";

function SearchScreen(query: Query<AppModelType, DbModelType>, ...queryConstraints: QueryConstraint[]) {

    const [city, setCity] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [fuelType, setFuelType] = useState('');
    const [transmission, setTransmission] = useState('');
    const [modelYear, setModelYear] = useState('');
    const [enginePower, setEnginePower] = useState('');
    const [hasDamage, setHasDamage] = useState(null);
    const [hasTradeIn, setHasTradeIn] = useState(null);
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [kmMin, setKmMin] = useState('');
    const [kmMax, setKmMax] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // Arama çubuğu için state
    const [brands, setBrands] = useState([]); // Markalar
    const [models, setModels] = useState([]); // Modeller
    const [selectedBrand, setSelectedBrand] = useState(''); // Seçilen marka
    const [selectedModel, setSelectedModel] = useState(''); // Seçilen model

    const clearAllFilters = () => {
        setCity('');
        setBrand('');
        setModel('');
        setFuelType('');
        setTransmission('');
        setModelYear('');
        setEnginePower('');
        setHasDamage(null);
        setHasTradeIn(null);
        setPriceMin('');
        setPriceMax('');
        setKmMin('');
        setKmMax('');
        setSelectedModel('');
        setSelectedBrand('');
        setSearchQuery('');
    };

    // Markaları yükleme
    useEffect(() => {
        const fetchBrands = async () => {
            const data = await getBrandAndModelsData();

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

    const listResults = () => {
        // Arama sonuçlarını listeleme işlemleri burada yapılacak
        // console.log('Arama yapılıyor...');
    };
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);

    // Yıllar listesini dinamik olarak oluşturuyoruz.
    const years = [];
    for (let year = currentYear; year >= 1960; year--) {
        years.push(year);
    }

    const formatNumberWithDots = (text) => {
        // Sadece sayıları kabul eder ve binlik basamakları noktayla ayırır
        const cleanText = text.replace(/[^0-9]/g, '');  // Sadece sayıları al
        return cleanText.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Binlikleri nokta ile ayır
    };

    const handlePriceMaxChange = (text) => {
        setPriceMax(formatNumberWithDots(text));
    };
    const handlePriceMinChange = (text) => {
        setPriceMin(formatNumberWithDots(text));
    };

    const handleKmMaxChange = (text) => {
        setKmMax(formatNumberWithDots(text));
    };
    const handleKmMinChange = (text) => {
        setKmMin(formatNumberWithDots(text));
    };

    //firestore().collection('Ads')
    //    // Filter results
    //    .where('price', '>=', 5)
    //    .get()
    //    .then(function(querySnapshot){
    //       querySnapshot.forEach(function(doc) {
    //           console.log("----");
    //           console.log("Fiyat: " + doc.data().price);
    //           console.log("------");
    //       })
    //    });

    const navigation = useNavigation();

    const [data, setData] = useState([]);

    // Veriyi çekmek için bileşen yüklendiğinde veri çekme işlemi
    useEffect(() => {
        //  getData();
    }, []);

    const getData = async () => {
        // Fiyat ve KM alanlarını noktalarından arındır
        const numericPriceMax = parseInt(priceMax.replace(/\./g, ''), 10); // Noktaları kaldırıp tam sayı olarak kaydedin
        const numericPriceMin = parseInt(priceMin.replace(/\./g, ''), 10); // Noktaları kaldırıp tam sayı olarak kaydedin
        const numericKmMax = parseInt(kmMax.replace(/\./g, ''), 10);       // Noktaları kaldırıp tam sayı olarak kaydedin
        const numericKmMin = parseInt(kmMin.replace(/\./g, ''), 10);       // Noktaları kaldırıp tam sayı olarak kaydedin

        try {
            let adsRef = firestore().collection('Ads');
            // Durum filtresi
            adsRef = adsRef.where("status", "==", 'publish');
            adsRef = adsRef.where("deletedAt", "==", null);
            // Şehir filtresi
            if (city.length > 1) {
                adsRef = adsRef.where("city", "==", city);
            }

            // Marka filtresi
            if (selectedBrand.length > 1) {
                adsRef = adsRef.where("brand", "==", selectedBrand);
            }

            // Model filtresi
            if (selectedModel.length > 1) {
                adsRef = adsRef.where("model", "==", selectedModel);
            }

            // Yakıt türü filtresi
            if (fuelType.length > 1) {
                adsRef = adsRef.where("fuelType", "==", fuelType.toLowerCase());
            }

            // Vites türü filtresi
            if (transmission.length > 1) {
                adsRef = adsRef.where("transmission", "==", transmission.toLowerCase());
            }

            // Model yılı filtresi
            if (modelYear.toString().length == 4) {
                adsRef = adsRef.where("modelYear", "==", parseInt(modelYear));
            }

            // Motor gücü filtresi
            if (enginePower.length >= 2) {
                adsRef = adsRef.where("enginePower", "==", parseInt(enginePower));
            }

            // Hasar kaydı filtresi
            if (hasDamage !== null) {
                if (hasDamage == 1) {
                    adsRef = adsRef.where("hasDamage", "==", true);
                } else {
                    console.log("hasDamage"+hasDamage)

                    adsRef = adsRef.where("hasDamage", "==", false);
                }
                // console.log("hasDamage"+hasDamage)
            }

            // Takas seçeneği filtresi
            if (hasTradeIn !== "" && hasTradeIn !== null) {
                if (hasTradeIn == 1) {
                    adsRef = adsRef.where("hasTradeIn", "==", true);
                } else {
                    adsRef = adsRef.where("hasTradeIn", "==", false);
                }
                console.log("hastradein"+hasTradeIn)
            }
            // Fiyat aralığı filtresi
            if (parseInt(numericPriceMin) >= 1) {
                adsRef = adsRef.where("price", ">=", parseInt(numericPriceMin));
            }

            if (parseInt(numericPriceMax) >= 1) {
                adsRef = adsRef.where("price", "<=", parseInt(numericPriceMax));
            }

            // Kilometre aralığı filtresi
            if (numericKmMin.length > 0 || numericKmMax.length > 0) {
                if (numericKmMin) {
                    adsRef = adsRef.where("km", ">=", parseInt(numericKmMin));
                }
                if (numericKmMax) {
                    adsRef = adsRef.where("km", "<=", parseInt(numericKmMax));
                }
            }

            // Veriyi Firestore'dan çek
            const querySnapshot = await adsRef.get();
            const dataList = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

            // Elde edilen veriyi duruma kaydet
            setData(dataList);
            //console.log('burası dataList' + dataList);
            navigation.navigate('SearchResultScreen', { adsData: dataList });

        } catch (error) {
            console.error("Veri çekme hatası:", error);
        }
    };

    const getDataSearchTerm = async () => {
        if (searchQuery.length > 1) {
            console.log('Aranıyor... ' + searchQuery.trim());

            const searchTerm = searchQuery.trim();
            const searchTermLowerCase = searchTerm.toLowerCase('tr-TR');

            // Firestore referansını al
            let adsRef = firestore().collection('Ads');

            // Durum filtresi
            adsRef = adsRef.where("status", "==", 'publish');
            adsRef = adsRef.where("deletedAt", "==", null);

            try {
                const querySnapshot = await adsRef.get();

                let results = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const matches =
                        data.brand.toLowerCase().includes(searchTerm.toLowerCase('tr-TR')) ||
                        data.model.toLowerCase().includes(searchTerm.toLowerCase('tr-TR')) ||
                        data.title.toLowerCase().includes(searchTerm.toLowerCase('tr-TR')) ||
                        data.brand.includes(searchTerm) ||
                        data.model.includes(searchTerm) ||
                        data.title.includes(searchTerm);

                    if (matches) {
                        results.push({ id: doc.id, ...data });
                    }
                });

                setData(results);
                navigation.navigate('SearchResultScreen', { adsData: results });

            } catch (error) {
                console.error('Hata: ', error);
            }

            // Farklı alanlar için ayrı sorgular yap
            //let brandQuery = adsRef.where('brand', '==', lowerCaseQuery);
            //let modelQuery = adsRef.where('model', '==', lowerCaseQuery);
            //let titleQuery = adsRef.where('title', '==', lowerCaseQuery);

            // Farklı sorguları paralel olarak çalıştır
            /*try {
                const [brandSnapshot, modelSnapshot, titleSnapshot] = await Promise.all([
                    brandQuery.get(),
                    modelQuery.get(),
                    titleQuery.get(),
                ]);

                // Sonuçları birleştir
                let combinedResults = [];

                // Her bir snapshot'tan veriyi al
                brandSnapshot.forEach((doc) => {
                    combinedResults.push({ id: doc.id, ...doc.data() });
                });
                modelSnapshot.forEach((doc) => {
                    combinedResults.push({ id: doc.id, ...doc.data() });
                });
                titleSnapshot.forEach((doc) => {
                    combinedResults.push({ id: doc.id, ...doc.data() });
                });

                // Duplicate (tekrar eden) sonuçları filtrele
                combinedResults = Array.from(
                    new Set(combinedResults.map((a) => a.id)) // ID'leri baz alarak eşsiz hale getiriyoruz
                ).map((id) => combinedResults.find((a) => a.id === id));

                // Elde edilen veriyi duruma kaydet
                setData(combinedResults);

                // Veriyi SearchResultScreen'e gönder
                navigation.navigate('SearchResultScreen', { adsData: combinedResults });

            } catch (error) {
                console.error('Hata: ', error);
            }
             */
        } else {
            Toast.show({
                type: 'error',
                text2: 'Lütfen aramak için marka, model ya da ilan başlığı yazın.'
            });
        }
    }

    function goToHome(){
        navigation.navigate('Home', {Screen: 'HomeScreen'});
    }

    return (
        <ScrollView contentContainerStyle={{
            backgroundColor: Colors.motoBackgroundColor,
            paddingHorizontal: 15,
            paddingTop: 20,
            paddingBottom: 40
        }}>

            <View style={{position: 'relative', marginTop: 0, marginBottom: 15, display: 'flex', flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={goToHome}
                    style={{
                    backgroundColor: Colors.motored,
                    padding: 10,
                    borderRadius: 100,
                    alignItems: 'center',
                }}>
                    <FontAwesomeIcon icon={faTimes} size={22} color={Colors.motoText2} />
                </TouchableOpacity>

                {/* Tüm Filtreleri Temizle Butonu */}
                <TouchableOpacity
                    onPress={clearAllFilters}
                    style={{
                        backgroundColor: Colors.motored,
                        marginLeft: 15,
                        padding: 10,
                        borderRadius: 100,
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'row'
                    }}
                >
                    <FontAwesomeIcon icon={faTrash} size={14} color={Colors.motoText2} />
                    <Text style={{color: Colors.motoText2, marginLeft: 5}}>Filitreleri Temizle</Text>
                </TouchableOpacity>
            </View>

            <View style={{position: 'relative', marginBottom: 10}}>
                <TextInput
                    style={styles.input}
                    placeholder="Marka, model veya istediğin gibi ara..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor={Colors.motoText3}
                />
                <TouchableOpacity
                    onPress={getDataSearchTerm}
                    style={{
                        backgroundColor: Colors.motoBoxBackgroundColor,
                        borderWidth: 0,
                        position: 'absolute',
                        right: 4,
                        top: 12,
                        padding: 15,
                        borderRadius: 0
                    }}
                >
                    <FontAwesomeIcon icon={faSearch} size={14} color={Colors.motoText2} />
                </TouchableOpacity>
            </View>

            <Text style={{fontSize: 18, fontWeight: 'bold', color: Colors.motoText2}}>Arama Kriterleri</Text>

            {/* Şehir Seçimi */}
            <View style={styles.row}>
                <Text style={styles.label}>Şehir</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={city}
                        onValueChange={(itemValue) => setCity(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Şehir Seçin" value=""/>
                        {cities.map((item, index) => (
                            <Picker.Item key={index} label={item.name} value={item.name}/>
                        ))}
                    </Picker>
                </View>
            </View>

            {/* Marka Picker */}
            <View style={styles.row}>
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
            <View style={styles.row}>
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
            <View style={styles.row}>
                <Text style={styles.label}>Yakıt Türü</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={fuelType}
                        onValueChange={itemValue => setFuelType(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Yakıt Türü Seçin" value={null}/>
                        <Picker.Item label="Benzin" value="benzin"/>
                        <Picker.Item label="Elektrik" value="elektrik"/>
                    </Picker>
                </View>
            </View>

            {/* Vites Türü */}
            <View style={styles.row}>
                <Text style={styles.label}>Vites Türü</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={transmission}
                        onValueChange={itemValue => setTransmission(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Vites Türü Seçin" value=""/>
                        <Picker.Item label="Manuel" value="manuel"/>
                        <Picker.Item label="Otomatik" value="otomatik"/>
                    </Picker>
                </View>
            </View>

            {/* Model Yılı */}
            <View style={styles.row}>
                <Text style={styles.label}>Model Yılı</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={modelYear}
                        style={styles.picker}
                        onValueChange={(itemValue) => setModelYear(itemValue)} // Değeri doğrudan kaydediyoruz
                    >
                        <Picker.Item label="Model Yılı Seçin" value=""/>
                        {years.map((year) => (
                            <Picker.Item key={year} label={year.toString()} value={year.toString()}/>
                        ))}
                    </Picker>
                </View>
            </View>

            {/* Motor Gücü (CC) */}
            <View style={styles.row}>
                <Text style={styles.label}>Motor Gücü (cc)</Text>
                <TextInput
                    placeholder="Motor Gücü (cc)"
                    placeholderTextColor={Colors.motoText2}
                    value={enginePower}
                    onChangeText={setEnginePower}
                    keyboardType="numeric"
                    style={styles.input}
                />
            </View>

            {/* Hasar Kaydı */}
            <View style={styles.row}>
                <Text style={styles.label}>Hasar Kaydı</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={hasDamage}
                        onValueChange={itemValue => setHasDamage(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Hasar Kaydı Var mı?" value={null}/>
                        <Picker.Item label="Var" value="1"/>
                        <Picker.Item label="Yok" value="0"/>
                    </Picker>
                </View>
            </View>

            {/* Takas */}
            <View style={styles.row}>
                <Text style={styles.label}>Takas</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={hasTradeIn}
                        onValueChange={itemValue => setHasTradeIn(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Takas Var mı?" value={null}/>
                        <Picker.Item label="Var" value="1"/>
                        <Picker.Item label="Yok" value="0"/>

                    </Picker>
                </View>
            </View>

            <View style={styles.row}>
                {/* Fiyat Aralığı */}
                <Text style={styles.label}>Fiyat Aralığı</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TextInput
                        placeholder="Min Fiyat"
                        placeholderTextColor={Colors.motoText2}
                        value={priceMin}
                        onChangeText={(text) => handlePriceMinChange(text)} // Değeri doğrudan kaydediyoruz
                        keyboardType="numeric"
                        blurOnSubmit={false} // Klavye kapanmasını engeller
                        style={[styles.input2column]}
                    />
                    <TextInput
                        placeholder="Max Fiyat"
                        placeholderTextColor={Colors.motoText2}
                        value={priceMax}
                        onChangeText={(text) => handlePriceMaxChange(text)}
                        keyboardType="numeric"
                        blurOnSubmit={false} // Klavye kapanmasını engeller
                        style={styles.input2column}
                    />
                </View>
            </View>
            <View style={styles.row}>
                {/* Kilometre Aralığı */}
                <Text style={styles.label}>Kilometre Aralığı</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TextInput
                        placeholder="Min KM"
                        placeholderTextColor={Colors.motoText2}
                        value={kmMin}
                        onChangeText={handleKmMinChange}
                        keyboardType="numeric"
                        style={styles.input2column}
                    />
                    <TextInput
                        placeholder="Max KM"
                        placeholderTextColor={Colors.motoText2}
                        value={kmMax}
                        onChangeText={handleKmMaxChange}
                        keyboardType="numeric"
                        style={styles.input2column}
                    />
                </View>
            </View>

            {/* Sonuçları Listele Butonu */}
            <TouchableOpacity
                onPress={getData}
                style={{
                    backgroundColor: Colors.motored,
                    marginTop: 15,
                    padding: 15,
                    borderRadius: 10,
                    alignItems: 'center',
                }}
            >
                <Text style={{color: '#FFF', fontSize: 16}}>Sonuçları Listele</Text>
            </TouchableOpacity>
        </ScrollView>

    );
}

// @ts-ignore
const styles = StyleSheet.create({
    SelectBorder: {
        marginVertical: 10,  // Araya boşluk eklemek için
    },
    row: {
        marginBottom: 5,
        marginTop: 10,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        color: Colors.motoText2
    },
    pickerWrapper: {
        backgroundColor: Colors.motoBoxBackgroundColor,
        borderWidth: 0,            // Sınır ekleme
        borderRadius: 10,          // Kenarların yuvarlatılması
        overflow: 'hidden',        // Kenar dışı taşan içeriği gizlemek için
    },
    picker: {
        height: 50,
        width: '100%',
        color: colors.motoText2
    },
    input: {
        backgroundColor: Colors.motoBoxBackgroundColor,
        borderColor: Colors.motoBoxBackgroundColor,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        color: Colors.motoText3,
    },
    input2column: {
        backgroundColor: Colors.motoBoxBackgroundColor,
        borderColor: Colors.motoBoxBackgroundColor,
        borderRadius: 10,
        padding: 10,
        width: '48%',
    },
    searchBar: {
        backgroundColor: Colors.motoBoxBackgroundColor,
        borderRadius: 10,
        padding: 10,
        color: Colors.motoText3,
    }
});
export default SearchScreen;
