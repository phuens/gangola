import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Alert,Image } from "react-native";
import { ResultStyle } from "./ResultStyle";
import axios from 'axios'

const ResultScreen = ({route})=>{
    useEffect(()=>{
       PostDisease()
    },[])
    const PostDisease =  async()=>{
        const data = new FormData()
        data.append('farmer','111223342313')
        data.append('crop','Onions')
        data.append('crop_image',route.params.capturedImage.uri.replace('file://',''))
        const headers= {
            'Content-Type': 'multipart/form-data;'
          }
        console.log('response :',data)
        res = await axios.post('http://wccl.erp.bt/api/method/gangola.api.submit_image',data,headers)
    }
    return (<View style={{
        flex:1
    }}>
    <Image style={ResultStyle.img}
        source={{ uri: route.params.capturedImage.uri}}/>
    <Text>Disease</Text>
    <TouchableOpacity>
        <Text>Report To RNR</Text>
    </TouchableOpacity>
    </View>)
}

export default ResultScreen