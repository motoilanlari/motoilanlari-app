import React,{useEffect,useState} from 'react'
import {View,FlatList,Text, ActivityIndicator} from "react-native"
import MessageItem from "../../components/MessageItem"
import messagesData from "../../assets/messages.tsx"
//import { DataStore } from 'aws-amplify'
import { Message } from '../../models'
import MyAdsItem from "../../MyAdsItem";
function Index() {
    const [messages,setMessages] = useState<Message[]>([])

    useEffect(() => {
       // DataStore.query(Message).then(setMessages)
    })
    if(!messages)
        return <ActivityIndicator />
    return (
        <View>
            <FlatList
                data={messagesData}
                renderItem={({item}) => <MessageItem item={item} /> }
            />
        </View>
    )
}

export default Index
