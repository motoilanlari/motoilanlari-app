import React, {useEffect, useState} from "react";
import {View, Text, FlatList} from "react-native";
import { faMotorcycle } from '@fortawesome/free-solid-svg-icons/faMotorcycle';
import products from "../../assets/products.ts";
import {Product} from "../../models";
import HomeItem from "../../HomeItem";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import Colors from "../../../Constants/colors.ts";

function Index() {
    const [favoriteProducts, setFavoriteProducts] = useState<Product[]>(
        []
    );

    useEffect(() => {
        setFavoriteProducts(products);
        return () => {
            setFavoriteProducts([]);
        }
    }, []);

    // FlatList için header bileşeni
    const renderHeader = () => (
        <View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#EAEAEA',
            }}>
                <FontAwesomeIcon size={26} color={Colors.motored} icon={faMotorcycle} />
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#959595' }}>
                    Motoilanlari
                </Text>
            </View>

            {/* "Son İlanlar" Başlığı */}
            <Text style={{
                fontSize: 23,
                fontWeight: 'bold',
                color: Colors.motored,
                marginLeft: 10,
                marginTop: 15
            }}>
                Son İlanlar
            </Text>
        </View>
    );

    return (
        <View style={{padding: 15, flex: 1}}>
            <FlatList
                data={favoriteProducts}
                renderItem={({item, index}) => (
                    <HomeItem product={item}></HomeItem>
                )}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={renderHeader} // Başlıkları buraya ekledik
            />
        </View>
    );
}

export default Index;
