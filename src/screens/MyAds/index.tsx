import React, {useEffect, useState} from "react";
import {View, Text, FlatList, ActivityIndicator} from "react-native";
import { faMotorcycle } from '@fortawesome/free-solid-svg-icons/faMotorcycle';
import products from "../../assets/products.ts";
import {Product} from "../../models";
import HomeItem from "../../HomeItem";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import MyAdsItem from "../../MyAdsItem";
import Colors from "../../../Constants/colors.ts";

function Index() {
    const [favoriteProducts, setFavoriteProducts] = useState<Product[]>(
        []
    );
    useEffect(() => {
        setFavoriteProducts(products)
        return () => {
            setFavoriteProducts([])
        }
    }, [])

    return (
        <View style={{padding: 15}}>
            <FlatList
                data={favoriteProducts}
                renderItem={({item, index}) => (
                    <MyAdsItem product={item}></MyAdsItem>
                )}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default Index;
