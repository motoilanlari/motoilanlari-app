import React from "react";
import {View, Text, Image, Dimensions} from "react-native";
import {Product} from "../models";
import {faTurkishLiraSign} from '@fortawesome/free-solid-svg-icons/faTurkishLiraSign';
import {faTrash} from '@fortawesome/free-solid-svg-icons/faTrash';
import {faLocationDot} from '@fortawesome/free-solid-svg-icons/faLocationDot';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
const {height, width} = Dimensions.get("window");
type favoriteItemProps = {
    product: Product;
};

function Index({product}: favoriteItemProps) {
    // console.log("The product is ",product)
    return (

        <View style={{
            borderColor: '#EAEAEA',
            borderWidth: 2,
            shadowColor: 'gray',
            shadowOpacity: 0.12,
            padding: 14,
            borderRadius: 10,
            marginBottom: 18,
            height: height * 0.18
        }}>

            <View style={{
                flexDirection: "row",
                alignItems: "center",
                paddingBottom: 18,
                borderBottomWidth: 1.2,
                borderBottomColor: '#dcdee0'
            }}>
                <Image
                    style={{width: width * 0.17, height: width * 0.17, borderRadius: 8,}}
                    source={{uri: product.image}}
                />
                <View style={{width: "80%", marginLeft: 10}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <FontAwesomeIcon size={20} color={'black'} icon={faLocationDot}/>

                        <Text>Ankara, Yenimahalle</Text>


                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >

                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            {/* <FontAwesome name="turkish-lira" size={15} color="black" />*/}

                            <Text style={{fontWeight: "bold", fontSize: 24, marginLeft: 3}}>
                                {product.price}
                            </Text>
                            <FontAwesomeIcon size={16} color={'black'} icon={faTurkishLiraSign}/>


                        </View>
                        <FontAwesomeIcon size={30} color='#919191' icon={faTrash}/>
                    </View>
                    <Text style={{fontSize: 14, fontWeight: '500', color: '#646464'}}>{product.description}</Text>
                </View>
            </View>



            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '74%',
                marginHorizontal: '13%',
                marginTop: 18,
                alignItems: 'center'
            }}>
                {/*}  <Text style={{color: '#7A7A7A', fontWeight: 'bold', fontSize: 14}}>Paylaş</Text>
                <Text style={{color: '#FF3E55', fontWeight: 'bold', fontSize: 14}}>Sohbet Et</Text>*/}
            </View>
        </View>
    );
}

export default Index;
