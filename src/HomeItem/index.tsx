import React from "react";
import {View, Text, Image, Dimensions, TouchableOpacity} from "react-native";
import { Product} from "../models";
import {faTurkishLiraSign} from '@fortawesome/free-solid-svg-icons/faTurkishLiraSign';
import {faLocationDot} from '@fortawesome/free-solid-svg-icons/faLocationDot';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {useNavigation} from "@react-navigation/native";

const {height, width} = Dimensions.get("window");

type favoriteItemProps = {
    product: Product;
};

function Index({product}: favoriteItemProps) {
    const navigation = useNavigation();

    return (

        <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderColor: '#EAEAEA',
            borderWidth: 2,
            shadowColor: 'gray',
            shadowOpacity: 0.12,
            padding: 0,
            paddingRight: 10,
            borderRadius: 5,
            marginBottom: 15,
            height: height * 0.15
        }}>
            <TouchableOpacity
                style={{
                    width: '45%',
                }}
                onPress={() => navigation.navigate("ProductDetailsScreen", {product: product})}>
                {/* Sadece resim tıklanabilir */}
                <Image
                    style={{
                        width: '100%',
                        height: '100%',
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                    }}
                    source={{uri: product.image}}
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={{
                    width: '55%',
                }}
                onPress={() => navigation.navigate("ProductDetailsScreen", {product: product})}>
                <View style={{paddingTop: 5, paddingLeft: 10, width: '100%'}}>

                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <FontAwesomeIcon size={10} color={'rgba(100,100,100,0.46)'} icon={faLocationDot}/>
                        <Text style={{fontSize: 12}}>Ankara, Yenimahalle</Text>
                    </View>

                    <Text style={{fontSize: 15, fontWeight: '500', color: '#646464'}}>{product.name}</Text>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Text style={{fontWeight: 900, fontSize: 15}}>
                            {product.price}
                        </Text>
                        <FontAwesomeIcon size={12} color={'#646464'} icon={faTurkishLiraSign}/>
                    </View>

                    {/* Yıl ve Tarih Bilgisi */}
                    <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 4}}>
                        <Text style={{fontSize: 12, fontWeight: '400', color: '#646464'}}>2010</Text>
                        <Text style={{fontSize: 12, fontWeight: '400', color: '#646464'}}>19 Ağustos</Text>
                    </View>
                </View>
            </TouchableOpacity>

        </View>
    );
}

export default Index;
