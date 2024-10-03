import React,{useState} from "react";
import {View, Text, ScrollView} from "react-native";
import ImageCarousel from "../../components/ImageCarousel";
import {Product} from "../../models";
import DetailsTextBox from "../../components/DetailsTextBox";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";


function Index(props) {

    const [product,setProduct] = useState<Product>(props.route.params.product)
    return (
        <ScrollView style={{flex:1,backgroundColor:'white'}}>
                {/*Image Carousel*/}
                <ImageCarousel images={product.images}/>
            <View style={{paddingHorizontal:20,paddingVertical:14}}>

            <DetailsTextBox price={product.price} name={product.name} description={product.description}/>

            </View>

        </ScrollView>

    );
}

export default Index;
