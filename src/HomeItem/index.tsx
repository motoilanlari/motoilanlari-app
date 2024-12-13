import React from 'react';
import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import {Product} from '../models';
import {faTurkishLiraSign} from '@fortawesome/free-solid-svg-icons/faTurkishLiraSign';
import {faLocationDot} from '@fortawesome/free-solid-svg-icons/faLocationDot';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useNavigation} from '@react-navigation/native';
import {formatDate} from '../utils/dateUtils';
import Colors from "../../Constants/colors.ts";
import WatermarkImage from "react-native-watermark-image";

const {height, width} = Dimensions.get('window');

type favoriteItemProps = {
    product: Product;
};


function Index({product}: favoriteItemProps) {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            activeOpacity={0.90}
            onPress={
                () => navigation.navigate('Home', {
                    screen: 'HomeDetailScreen',
                    params: {
                        product: product}
                    })
            }>
            <View style={{
                backgroundColor: Colors.motoBoxBackgroundColor,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                shadowColor: 'gray',
                shadowOpacity: 0.12,
                paddingRight: 10,
                borderRadius: 5,
                marginBottom: 15
            }}>
                    {/* Sadece resim tıklanabilir
                    <Image
                        style={{
                            width: '45%',
                            height: '100%',
                            resizeMode: 'cover',
                            borderTopLeftRadius: 5,
                            borderBottomLeftRadius: 5,
                        }}
                        source={{uri: product.photoUrls[0]}}
                    />
                    */}

                    <View style={{
                        width: '45%',
                        height: '100%',
                    }}>
                        <WatermarkImage
                            alt="Moto İlanları"
                            imageUrl={ product.photoUrls[0] }
                            watermarkImageUrl={require('../assets/watermark.png')}
                            imageOpacity={1}
                            watermarkImageOpacity={0.40}
                            imageStyle={{
                                resizeMode: 'cover',
                                borderTopLeftRadius: 5,
                                borderBottomLeftRadius: 5,
                            }}
                        />
                    </View>

                    <View
                        style={{
                            width: '55%',
                            paddingVertical: 10
                        }}>
                        <View style={{paddingTop: 0, paddingLeft: 10, width: '100%'}}>

                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <FontAwesomeIcon size={10} color={Colors.motoText3} icon={faLocationDot}/>
                                    <Text style={{fontSize: 11, color: Colors.motoText2}}> {product.city} </Text>
                                </View>
                                {/* Tarih Bilgisi */}
                                <View>
                                    <Text style={{fontSize: 11, fontWeight: '400', color: Colors.motoText2, textAlign: 'right'}}>
                                        {formatDate(product.createdAt)}
                                    </Text>
                                </View>
                            </View>

                            {/* Marka-Model */}
                            <Text style={{
                                fontSize: 13,
                                fontWeight: '500',
                                color: Colors.motoText1
                            }}>{product.brand + " " + product.model}</Text>

                            <View style={{flexDirection: 'column', marginTop: 2}}>
                                {/* Fiyat */}
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{fontWeight: 900, fontSize: 13, color: Colors.motoText1 }}>
                                        {parseFloat(product.price).toLocaleString('tr-TR')}
                                    </Text>
                                    <FontAwesomeIcon size={12} color={Colors.motoText1} icon={faTurkishLiraSign}/>
                                </View>

                                {/* Yıl ve Km Bilgisi */}
                                <View style={{flexDirection: 'row', marginTop: 3}}>
                                    <Text style={{fontSize: 11, fontWeight: '400', color: Colors.motoText2, marginRight: 10}}>
                                        {product.modelYear}
                                    </Text>
                                    <Text style={{fontSize: 11, fontWeight: '400', color: Colors.motoText2}}>
                                        {parseFloat(product.km).toLocaleString('tr-TR') + ' km'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
            </View>
        </TouchableOpacity>
    );
}

export default Index;
