import {Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View} from "react-native";
import React, {useEffect, useState} from "react";

import {firestore} from "../../services/firebase";
import colors from "../../Constants/colors";

function BannerSlider() {

    //Slider İşlemleri
    const [sliderPhotos, setSliderPhotos] = useState([]);
    const flatListRef = React.useRef(null);
    const [sliderActiveIndex, setSliderActiveIndex] = useState(0);

    const windowWidth = Dimensions.get("window").width;

    // Firestore'dan görselleri alıyoruz
    useEffect(() => {
        const fetchSliderPhotos = async () => {
            try {
                const doc = await firestore()
                    .collection('Options')
                    .doc('bannerPhotos')
                    .get(); // Belirli dokümanı getir
                if (doc.exists) {
                    setSliderPhotos(doc.data().images || []); // Slider dizisini çek
                }
            } catch (error) {
                console.error('Fotoğraflar alınamadı:', error);
            }
        };
        fetchSliderPhotos();
    }, []);

    // onViewableItemsChanged işlevi ile görünür öğeleri takip et
    const viewabilityConfig = {
        viewAreaCoveragePercentThreshold: 50, // Öğenin %50'si göründüğünde değişiklik sayılır
    };

    const onViewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            // Görünür öğelerin ilk index'ini al
            setSliderActiveIndex(viewableItems[0].index);
        }
    };

    // FlatList'e aktif fotoğrafı göstermek için scrollToIndex kullanıyoruz
    useEffect(() => {
        if (flatListRef.current && sliderPhotos.length > 0) {
            flatListRef.current.scrollToIndex({ index: sliderActiveIndex, animated: true });
        }
    }, [sliderActiveIndex, sliderPhotos.length]);

    return (
        <View style={styles.sliderContainer}>
            {/* Slider */}
            <FlatList
                ref={flatListRef}
                data={sliderPhotos}
                renderItem={({ item }) => (
                    <View
                        style={{
                            width: windowWidth,
                            height: 200,
                            borderRadius: 10,
                            overflow: 'hidden',
                        }}
                    >
                        <Image
                            source={{ uri: item }}
                            style={{
                                width: '100%',
                                height: '100%',
                                resizeMode: 'cover',
                            }}
                        />
                    </View>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={windowWidth} // Ekran genişliği ile hizalama
                snapToAlignment={'center'} // Kaydırmayı merkezde hizalama
                decelerationRate={'fast'} // Daha hızlı kaydırma
                viewabilityConfig={viewabilityConfig} // Görünürlük eşiği
                onViewableItemsChanged={onViewableItemsChanged} // Görünen eleman değişimlerini takip et
                style={{
                    borderRadius: 10,
                    width: windowWidth - 30,
                }}
            />
            <View style={styles.dotsView}>
                {sliderPhotos.map((image, index) => (
                    <TouchableOpacity key={index} onPress={() => setSliderActiveIndex(index)}>
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                { backgroundColor: index === sliderActiveIndex ? colors.motored : '#CBCAD0' },
                            ]}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    sliderContainer: {
        width: '100%',
        height: 200,
        position: 'relative',
        borderRadius: 10,
        padding: 0,
        margin: 0,
    },
    dotsView: {
        position: 'absolute',
        bottom: 12,
        borderRadius: 15,
        left: '45%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginVertical: 6,
        marginHorizontal: 8,
    }
});

export default BannerSlider;
