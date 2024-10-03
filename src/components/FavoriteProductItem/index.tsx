import React from "react";
import {View,TouchableOpacity,Text, Image} from "react-native";
import {Product} from "../../models";
import styles from "./styles.ts";
import {useNavigation} from "@react-navigation/native";

type productProps = {
    product:Product
}
function index({product}:productProps){
    const navigation =useNavigation();
return(
    <TouchableOpacity onPress={()=>navigation.navigate("ProductDetailsScreen",{product:product})} style={styles.favorite}>
        <View style={styles.favoriteView}>
            <Image
            source={{uri:product.image}}
            resizeMode="stretch"
            style={styles.favoriteImage}
            />

        </View>
    </TouchableOpacity>

 )
}
export default index;
