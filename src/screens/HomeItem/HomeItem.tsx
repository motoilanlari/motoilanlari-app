import React from 'react';
import { TouchableOpacity, View, Text, Image, Dimensions } from 'react-native';
import Colors from "../../../Constants/colors.ts";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faLocationDot} from "@fortawesome/free-solid-svg-icons/faLocationDot";
import {formatDate} from "../../utils/dateUtils";
import {faTurkishLiraSign} from "@fortawesome/free-solid-svg-icons/faTurkishLiraSign";

const { height } = Dimensions.get('window');

const ProductItem = ({ product, onPress }) => {

    //console.log(product);
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: Colors.motoBoxBackgroundColor,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                //borderColor: '#EAEAEA',
                //borderWidth: 2,
                shadowColor: 'gray',
                shadowOpacity: 0.12,
                paddingRight: 10,
                borderRadius: 5,
                marginBottom: 15,
                height: height * 0.13,
            }}>
                {/* Sadece resim tıklanabilir */}
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

                <View
                    style={{
                        width: '55%',
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

        </TouchableOpacity>
    );
};

export default ProductItem;
