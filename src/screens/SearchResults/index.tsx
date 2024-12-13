import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import HomeItem from "../../HomeItem";
import Colors from "../../../Constants/colors.ts";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faComments, faSearch} from "@fortawesome/free-solid-svg-icons";
import colors from "../../../Constants/colors.ts";

function Index({route}) {
    const {adsData} = route.params; // Veriyi route.params ile alıyoruz

    if (adsData.length >= 1) {
        return (
            <FlatList
                data={adsData}
                renderItem={({item, index}) => (
                    <HomeItem product={item}/>
                )}
                showsVerticalScrollIndicator={false}
                scrollEnabled={true}
                keyExtractor={(item) => item.id.toString()}
                style={styles.container}
            />
        );
    } else {
        return (
            <View style={{
                flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10,
                backgroundColor: Colors.motoBackgroundColor,
                color: Colors.motoText3
            }}>
                <FontAwesomeIcon icon={faSearch} size={30} color={colors.motoText3} />
                <Text style={{ marginTop: 20 , color: Colors.motoText3}}>Aramanla ilgili bir ilan bualamadık.</Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 20,
        paddingBottom: 0,
        marginBottom: 0
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    itemContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
});

export default Index;
