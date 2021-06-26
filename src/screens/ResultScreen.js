import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Alert,ImageBackground,StyleSheet } from "react-native";
import { ResultStyle } from "./ResultStyle";
import axios from 'axios'
import { Card, ListItem, Button, Icon } from 'react-native-elements'

const ResultScreen = ({route})=>{
    useEffect(()=>{
       PostDisease()
    },[])
    const PostDisease =  async()=>{
        // console.log(route.params.capturedImage)
        fileName = route.params.capturedImage.uri.substring(route.params.capturedImage.uri.lastIndexOf('/')+1)
        const data = new FormData()
        // data.append('farmer','111223342313')
        // data.append('crop','Onions')
        // data.append('crop_image',fileName)
        // const headers= {
        //     'Content-Type': 'multipart/form-data'
        //   }
        let res = await axios.post('http://wccl.erp.bt/api/method/gangola.api.submit_image?farmer=111223342313&crop=Onions')
        console.log('hello world ',res)
    }
        return (
        <Card>
            <Card.Title>Disease Diognastic</Card.Title>
            <Card.Divider/>
            <Card.Image source={{ uri: route.params.capturedImage.uri}}>  
            </Card.Image>
            <View>
                <Text style={ResultStyle.text}>
                    The idea with React Native Elements is more about component structure than actual design.
                </Text>
            </View>
            <Text style={ResultStyle.text}></Text>
            <TouchableOpacity style={ResultStyle.button}>
                <Text style={ResultStyle.text}>Report To RNR</Text>
            </TouchableOpacity> 
        </Card>)
}

export default ResultScreen