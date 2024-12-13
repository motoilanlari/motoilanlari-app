import React,{useState} from 'react';
import {View, ScrollView} from 'react-native';
import ImageCarousel from '../../components/ImageCarousel';
import {Product} from '../../models';
import DetailsTextBox from '../../components/DetailsTextBox';
import { formatDate } from '../../utils/dateUtils';

function Index(props) {

    const [product,setProduct] = useState<Product>(props.route.params.product);
    return (
        <ScrollView style={{flex:1,backgroundColor:'white'}}>
                {/*Image Carousel*/}
                <ImageCarousel images={product.photoUrls}/>
            <View style={{paddingHorizontal:20,paddingVertical:14}}>

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

export default Index;
