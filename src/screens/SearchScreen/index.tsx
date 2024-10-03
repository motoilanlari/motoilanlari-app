import React, { useState } from 'react';
import { View, Text, TextInput, Button,  Switch, TouchableOpacity, ScrollView } from 'react-native';
import Colors from "../../../Constants/colors.ts";
import { Picker } from '@react-native-picker/picker';

function SearchScreen() {
    const [city, setCity] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [fuelType, setFuelType] = useState('');
    const [transmission, setTransmission] = useState('');
    const [modelYear, setModelYear] = useState('');
    const [enginePower, setEnginePower] = useState('');
    const [hasDamage, setHasDamage] = useState(false);
    const [hasTradeIn, setHasTradeIn] = useState(false);
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [kmMin, setKmMin] = useState('');
    const [kmMax, setKmMax] = useState('');

    const listResults = () => {
        // Arama sonuçlarını listeleme işlemleri burada yapılacak
        console.log("Arama yapılıyor...");
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Arama Kriterleri</Text>

            {/* Şehir */}
            <TextInput
                placeholder="Şehir"
                value={city}
                onChangeText={setCity}
                style={{ borderColor: '#EAEAEA', borderWidth: 1, borderRadius: 10, padding: 10, marginVertical: 10 }}
            />

            {/* Marka */}
            <TextInput
                placeholder="Marka"
                value={brand}
                onChangeText={setBrand}
                style={{ borderColor: '#EAEAEA', borderWidth: 1, borderRadius: 10, padding: 10, marginVertical: 10 }}
            />

            {/* Model */}
            <TextInput
                placeholder="Model"
                value={model}
                onChangeText={setModel}
                style={{ borderColor: '#EAEAEA', borderWidth: 1, borderRadius: 10, padding: 10, marginVertical: 10 }}
            />

            {/* Yakıt Türü */}
            <Text>Yakıt Türü</Text>
            <Picker selectedValue={fuelType} onValueChange={itemValue => setFuelType(itemValue)}>
                <Picker.Item label="Benzin" value="benzin" />
                <Picker.Item label="Dizel" value="dizel" />
                <Picker.Item label="Elektrik" value="elektrik" />
            </Picker>

            {/* Vites Türü */}
            <Text>Vites Türü</Text>
            <Picker selectedValue={transmission} onValueChange={itemValue => setTransmission(itemValue)}>
                <Picker.Item label="Manuel" value="manuel" />
                <Picker.Item label="Otomatik" value="otomatik" />
            </Picker>

            {/* Model Yılı */}
            <TextInput
                placeholder="Model Yılı"
                value={modelYear}
                onChangeText={setModelYear}
                keyboardType="numeric"
                style={{ borderColor: '#EAEAEA', borderWidth: 1, borderRadius: 10, padding: 10, marginVertical: 10 }}
            />

            {/* Motor Gücü (CC) */}
            <TextInput
                placeholder="Motor Gücü (cc)"
                value={enginePower}
                onChangeText={setEnginePower}
                keyboardType="numeric"
                style={{ borderColor: '#EAEAEA', borderWidth: 1, borderRadius: 10, padding: 10, marginVertical: 10 }}
            />

            {/* Hasar Kaydı */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
                <Text>Hasar Kaydı Var mı?</Text>
                <Switch value={hasDamage} onValueChange={setHasDamage} />
            </View>

            {/* Takas */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
                <Text>Takas Var mı?</Text>
                <Switch value={hasTradeIn} onValueChange={setHasTradeIn} />
            </View>

            {/* Fiyat Aralığı */}
            <TextInput
                placeholder="Min Fiyat"
                value={priceMin}
                onChangeText={setPriceMin}
                keyboardType="numeric"
                style={{ borderColor: '#EAEAEA', borderWidth: 1, borderRadius: 10, padding: 10, marginVertical: 10 }}
            />
            <TextInput
                placeholder="Max Fiyat"
                value={priceMax}
                onChangeText={setPriceMax}
                keyboardType="numeric"
                style={{ borderColor: '#EAEAEA', borderWidth: 1, borderRadius: 10, padding: 10, marginVertical: 10 }}
            />

            {/* Kilometre Aralığı */}
            <TextInput
                placeholder="Min KM"
                value={kmMin}
                onChangeText={setKmMin}
                keyboardType="numeric"
                style={{ borderColor: '#EAEAEA', borderWidth: 1, borderRadius: 10, padding: 10, marginVertical: 10 }}
            />
            <TextInput
                placeholder="Max KM"
                value={kmMax}
                onChangeText={setKmMax}
                keyboardType="numeric"
                style={{ borderColor: '#EAEAEA', borderWidth: 1, borderRadius: 10, padding: 10, marginVertical: 10 }}
            />

            {/* Sonuçları Listele Butonu */}
            <TouchableOpacity
                onPress={listResults}
                style={{
                    backgroundColor: Colors.motored,
                    padding: 15,
                    borderRadius: 10,
                    alignItems: 'center',
                    marginTop: 20,
                }}
            >
                <Text style={{ color: '#FFF', fontSize: 16 }}>Sonuçları Listele</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

export default SearchScreen;
