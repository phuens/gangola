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

        // console.log('hklds ',route.params.base64)
        let fileName = route.params.capturedImage.uri.substring(route.params.capturedImage.uri.lastIndexOf('/')+1)
        // const data = new FormData()
        // data.append('farmer','17123456')
        // data.append('crop','Onions')
        // data.append('crop_image',fileName)
        // const headers= {
        //     'Content-Type': 'multipart/form-data'
        //   }
        //   console.log('hello world ',data)
        let file_form = new FormData();
            file_form.append('farmer','17123456');
            file_form.append('crop','Onions');
            file_form.append('crop_image', fileName);
        console.log('value ',file_form)
        let resp = axios.post(`http://wccl.erp.bt/api/method/gangola.api.submit_image`,{data:file_form},{headers: {'Content-Type': 'multipart/form-data'}})
        console.log('response ',resp)
        // let body = {
        //     "farmer":"17123456",
        //     "crop":"Onions"
        // }
        // let headers = {
        //     'Content-Type':'application/json',
        //     'Authorization':'token d828391ea0ececb:72d0e5fec989202'
        // }
        // let res = await axios.put(`http://wccl.erp.bt/api/resource/Crop Disease Report`,{
        //     data:body
        // },
        // {headers})
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