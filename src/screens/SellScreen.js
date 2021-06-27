import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image,ScrollView,TextInput} from 'react-native';
import axios from 'axios';
import NumericInput from 'react-native-numeric-input'
import { IconButton } from 'react-native-paper';


const SellScreen = ()=>{
    const [productsList, setProductsList] = useState([]);
    useEffect(()=>{
        getData()
    })
    const getData= async()=>{
        let date = '2021-06-26';
        if ( productsList.length == 0){
            let data = await axios.get('http://wccl.erp.bt/api/method/gangola.api.get_crops', {
                params: { as_on_date: '' },
            })
            setProductsList(data.data.message);
        }
    }
    // console.log(productsList)
    const list = []
    if(productsList){
        for (let i = 0; i< productsList.length; i += 2){
            if ( i < productsList.length){
                list.push(<View style={Styles.secInnerView} key={'key1'+i}>
                            <View style={Styles.innerView} >
                                <Image source={{
                                    uri: `http://wccl.erp.bt${productsList[i].crop_image}`,
                                }} style={Styles.image}/>
                                <Text style={Styles.text}>{productsList[i].crop}</Text>
                                <TextInput keyboardType='numeric' placeholder='Quantity' style={Styles.textInput} value={productsList[i].qty}/>
                                <TextInput keyboardType='numeric' placeholder='Rate/kg' style={Styles.textInput} value={productsList[i].avg_rate}/>
                            </View>
                            <View style={Styles.innerView} >
                                <Image source={{
                                    uri: `http://wccl.erp.bt${productsList[i+1].crop_image}`,
                                }} style={Styles.image}/>
                                <Text style={Styles.text}>{productsList[i+1].crop}</Text>
                                <TextInput keyboardType='numeric' placeholder='Quantity' style={Styles.textInput} value={productsList[i+1].qty}/>
                                <TextInput keyboardType='numeric' placeholder='Rate/kg' style={Styles.textInput} value={productsList[i+1].avg_rate}/>
                            </View>
                        </View>)
                }
            }
        }
        return (
            <ScrollView >
                {productsList ? list : ''}
                <TouchableOpacity style={Styles.button}>
                    <Text>Save Changes</Text>
                </TouchableOpacity>
            </ScrollView>
    )
}
const Styles = StyleSheet.create({
    button: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 15,
        fontSize: 40,
        padding:15,
        backgroundColor: 'white',
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: 30,
        borderColor:'#49c1a4',
        borderWidth: 2,
        marginBottom:20
      },
    innerView:{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: '#88888817',
        // marginBottom: 10,
        // marginTop: 10,
        // marginLeft: 5,
        // marginRight: 5,
        // height:200,
        margin:10,
        width:150,
        borderRadius:10,
        padding:5,
        borderColor:'#49c1a4',
        borderWidth:1,
    },
    secInnerView:{
        display:'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop:5
    },
    image:{
        width: '80%',
        height: 100,
        margin: 5,
    },
    textInput: {
        fontSize:12,
        borderColor: '#49c1a4',
        borderWidth: 1,
        // paddingTop: 10,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        padding:5,
        borderRadius: 10,
        paddingLeft:10
      },
    text:{
        alignSelf:'center'
    }
})
export default SellScreen