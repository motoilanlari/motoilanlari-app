import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Firebase Storage JSON dosyası URL'si
const BRANDS_URL =
    'https://firebasestorage.googleapis.com/v0/b/motoilanlari-f83d3.appspot.com/o/storage%2Fbrands_with_models.json?alt=media&token=6e27eb9f-e3b9-491e-b2fd-e4a2d1657ea6';

// JSON'u indir ve cihazda sakla
const getBrandAndModelsData = async () => {
    try {
        const response = await axios.get(BRANDS_URL, { responseType: 'json' });
        const jsonContent = JSON.stringify(response.data);

        // JSON dosyasını cihazda kaydet
        //await RNFS.writeFile(BRAND_FILE_PATH, jsonContent, 'utf8');
        //console.log('JSON başarıyla indirildi ve cihazda saklandı.');

        // AsyncStorage'e "indirildi" bilgisini kaydet
        //await AsyncStorage.setItem('brandsDownloaded', 'true');

        return response.data;
    } catch (error) {
        console.error('JSON indirilirken hata:', error);
        throw new Error('Veri indirilemedi.');
    }
};

// Kullanım
export { getBrandAndModelsData };
