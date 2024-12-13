import React, {useEffect, useState} from 'react';
import { View, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity, Modal, Text, Button } from 'react-native';
import Share from 'react-native-share'; // react-native-share kütüphanesini ekleyin
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import WatermarkImage from "react-native-watermark-image";
import WatermarkImageFull from '../../components/WaterMark.tsx';

const { width, height } = Dimensions.get('window');

function Index({ images }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Tam ekran modda görüntülenen resim indeksi

    // Resim URL'lerini burada tanımlıyorsunuz
    /*
    const images = [
        'https://motoilanlari.com/wp-content/uploads/2024/08/IMG_20240821_210630_757-767x1024.jpg',
        'https://motoilanlari.com/wp-content/uploads/2024/08/IMG_20240821_210638_454-767x1024.jpg',
        'https://motoilanlari.com/wp-content/uploads/2024/08/IMG_20240821_210636_975-767x1024.jpg',
    ];
    */

    const onViewRef = React.useRef((viewableItems) => {
        if (viewableItems.viewableItems.length > 0) {
            setActiveIndex(viewableItems.viewableItems[0].index || 0);
        }
    });

    const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

    // Resimlere tıklanınca tam ekran modalı açar ve tıklanan resmin indeksini set eder
    const handleImagePress = (index) => {
        setCurrentImageIndex(index);
        setModalVisible(true);
    };

    // Paylaşma fonksiyonu
    const handleShare = async () => {
        try {
            const shareOptions = {
                title: 'Sayfayı Paylaş',
                message: 'Bu sayfayı sosyal medyada paylaş!',
                url: 'https://motoilanlari.com', // Paylaşılacak sayfa linki
            };
            await Share.open(shareOptions);
        } catch (error) {
            console.log('Paylaşım hatası:', error);
        }
    };

    const flatListRef = React.useRef(null);
    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;

    // onViewableItemsChanged işlevi ile görünür öğeleri takip et
    const viewabilityConfig = {
        viewAreaCoveragePercentThreshold: 50, // Öğenin %50'si göründüğünde değişiklik sayılır
    };

    const onViewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
        }
    };

    return (
        <View>
            {/* Resim galerisi */}
            <FlatList
                ref={flatListRef}
                data={images}
                renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => handleImagePress(index)}>
                        {/* <Image
                            source={{ uri: item }}
                            style={{
                                width: width,
                                height: height * 0.40,
                                resizeMode: 'cover'
                            }}
                        /> */}
                        <WatermarkImage
                            alt="Moto İlanları"
                            imageUrl={ item }
                            watermarkImageUrl={require('../../assets/watermark.png')}
                            imageOpacity={1}
                            watermarkImageOpacity={0.4}
                            imageStyle={{
                                width: width,
                                height: height * 0.40,
                                resizeMode: 'contain',
                            }}
                        />
                    </TouchableOpacity>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={windowWidth} // Ekran genişliği ile hizalama
                snapToAlignment={'center'} // Kaydırmayı merkezde hizalama
                decelerationRate={'fast'} // Daha hızlı kaydırma
                viewabilityConfig={viewabilityConfig} // Görünürlük eşiği
                onViewableItemsChanged={onViewableItemsChanged} // Görünen eleman değişimlerini takip et
                style={{
                    borderRadius: 0,
                }}
            />
            <View style={styles.dotsView}>
                {images.map((image, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            { backgroundColor: index === activeIndex ? '#FFFFFD' : '#CBCAD0' },
                        ]}
                    />
                ))}
            </View>

            {/* Modal: Tam sayfa resim görüntüleme */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <FlatList
                        data={images}
                        renderItem={({ item }) => (
                            <View style={{
                                width: windowWidth,
                                height: windowHeight,
                                borderRadius: 0,
                                overflow: 'hidden',
                            }}>
                                <WatermarkImageFull
                                    alt="Moto İlanları"
                                    imageUrl={item}
                                    watermarkImageUrl={require('../../assets/watermark.png')}
                                    imageOpacity={1}
                                    watermarkImageOpacity={0.4}
                                    imageStyle={{
                                        width: windowWidth,
                                        height: windowHeight,
                                    }}
                                    imageResizeMode="contain"
                                    watermarkResizeMode="center"
                                />
                            </View>
                        )}
                        horizontal
                        pagingEnabled
                        initialScrollIndex={currentImageIndex}
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={width}
                        snapToAlignment={'center'}
                        decelerationRate={'fast'}
                        onScrollToIndexFailed={(info) => {
                            console.warn("scrollToIndex hatası:", info);
                            setTimeout(() => {
                                flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                            }, 500);
                        }}
                    />

                    {/* Sol üstte çıkış butonu */}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <FontAwesomeIcon icon={faTimes} size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    dotsView: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        borderRadius: 15,
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
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 30,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        borderRadius: 40,
    },
    shareButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 20,
    },
    shareText: {
        color: '#FFF',
        marginLeft: 10,
        fontSize: 16,
    }
});

export default Index;
