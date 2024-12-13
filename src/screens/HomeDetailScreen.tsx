import React,{useState} from 'react';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import ImageCarousel from '../components/ImageCarousel';
import {Product} from '../models';
import DetailsTextBox from '../components/DetailsTextBox';
import { formatDate } from '../utils/dateUtils';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import Colors from "../../Constants/colors.ts";

function HomeDetailScreen({ route, navigation }: { route: any; navigation: any }) {

    const [product, setProduct] = useState<Product>(route.params.product);
    return (
        <ScrollView style={{flex:1, backgroundColor: Colors.motoBackgroundColor}}>
            {/*Image Carousel*/}
            <ImageCarousel images={product.photoUrls}/>

            {/* Kapatma İkonu */}
            <TouchableOpacity
                style={{
                        position: 'absolute',
                        top: 15,
                        left: 15,
                        zIndex: 10,
                        backgroundColor: Colors.motored,
                        padding: 7,
                        borderRadius: 100,
                    }}
                onPress={() => navigation.navigate({
                    name: 'Home', params: { screen: 'HomeScreen' },
                })}
            >
                <FontAwesomeIcon icon={faTimes} size={24} color="#fff" />
            </TouchableOpacity>

            <View style={{paddingHorizontal:15, paddingVertical:15}}>
                <DetailsTextBox
                    adId={product.id}
                    price={product.price}
                    title={product.title}
                    brand={product.brand}
                    model={product.model} modelYear={product.modelYear}
                    enginePower={product.enginePower}
                    km={product.km}
                    hasDamage={product.hasDamage ? 'Var' : 'Yok'}
                    hasTradeIn={product.hasTradeIn ? 'Var' : 'Yok'}
                    date={formatDate(product.createdAt)}
                    city={product.city}
                    description={product.description}
                    isNumberView={product.isNumberView}
                    adOwnerId={product.userId}
                    adFirstPhoto={product.photoUrls[0]}
                />
            </View>
        </ScrollView>

    );
}

export default HomeDetailScreen;
