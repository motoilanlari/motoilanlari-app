import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView} from 'react-native';
import styles from "./styles.ts";
import productassets from "../../assets/products"

import {Product} from "../../models/index.ts";
import FavoriteProductItem from "../../components/FavoriteProductItem";

const Index = () => {
    const [products, setProducts] = useState<Product[]>([])
    useEffect(() => {
        setProducts(productassets);
    }, []);
    console.log("The Products x", products)
    return (
        <View style={styles.productsContainer}>
            {/*Render Header */}
            <View style={styles.titleProducts}>
                <Text style={styles.topicTitle}>
                    Son İlanlar
                </Text>
            </View>
            {/*Render favorite poducts*/}
            <ScrollView
                bounces={true}
                horizontal={true}
            >
                {products?.map((item) => {
                    return <FavoriteProductItem key={item.id} product={item}/>
                })}
            </ScrollView>
        </View>
    );
};

export default Index;
