import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image,ScrollView,TextInput,Alert} from 'react-native';
import axios from 'axios';
import { IconButton,Modal,Portal,Provider } from 'react-native-paper';


const SellScreen = ()=>{
    const [productsList, setProductsList] = useState([]);
    const [showModal,setShowModal] = useState(false)
    const [loaded,setLoaded] = useState(false)
    const [indx,setIndx] = useState(0)
    const [rate,setRate] = useState('')
    const [quantity,setQuantity] = useState('')
    useEffect(()=>{
        getData()
    },[])
    const getData= async()=>{
        let date = '2021-06-26';
        if ( !loaded){
            let data = await axios.get('http://wccl.erp.bt/api/method/gangola.api.get_farmer_crops?farmer=17123456')
            if (data.data.message){
                setProductsList(data.data.message);
                setLoaded(true)
            }
        }
    }
    const displayModal = (i)=>{
        setIndx(i)
        setShowModal(true)
    }
    const hideModal = ()=>{
        setShowModal(false)
    }
    const updateCrop =async ()=>{
       let res = await axios.post('http://wccl.erp.bt/api/method/gangola.api.update_rate',{
        "farmer":"17123456",
        "crops":[
            {"crop":productsList[indx].crop,"quantity":quantity,"rate":rate}
        ]
       })
       setRate('')
       setQuantity('')
       setShowModal(false)
        Alert.alert('Your Data Updated')        
    }
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
                                <Text style={Styles.text} >Qty: {productsList[i].quantity} {productsList[i].uom}</Text>
                                <Text style={Styles.text} >Rate: Nu.{productsList[i].rate} per {productsList[i].uom}</Text>
                                <TouchableOpacity style={Styles.addBtn} onPress={()=>displayModal(i)}>
                                    <IconButton
                                        icon="plus-circle"
                                        color="#49c1a3"
                                        size={30}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={Styles.innerView} >
                                <Image source={{
                                    uri: `http://wccl.erp.bt${productsList[i+1].crop_image}`,
                                }} style={Styles.image}/>
                                <Text style={Styles.text}>{productsList[i+1].crop}</Text>
                                <Text style={Styles.text} >Qty: {productsList[i+1].quantity} {productsList[i].uom}</Text>
                                <Text style={Styles.text} >Nu.{productsList[i+1].rate} per {productsList[i].uom}</Text>
                                <TouchableOpacity style={Styles.addBtn} onPress={()=>displayModal(i+1)}>
                                    <IconButton
                                        icon="plus-circle"
                                        color="#49c1a3"
                                        size={30}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>)
                }
            }
        }
        return (
            <ScrollView >
                {productsList ? list : ''}
                <Provider>
                    <Portal>
                        {productsList.length > 0 &&
                        <Modal visible={showModal} onDismiss={hideModal} contentContainerStyle={Styles.containerStyle}>
                            <Image source={{
                                        uri: `http://wccl.erp.bt${productsList[indx].crop_image}`,
                                    }} style={{
                                        height:100,
                                        width:100,
                                        alignSelf:'center'
                                    }}/>
                            <Text style={Styles.text}>{productsList[indx].crop}</Text>
                            <TextInput onChangeText={(value)=>setQuantity(value)} placeholder="Quantity" value={quantity} style={Styles.textInput} keyboardType="numeric"/>
                            <TextInput onChangeText={(value)=>setRate(value)} placeholder="Rate" value={rate} style={Styles.textInput} keyboardType="numeric"/>
                            <TouchableOpacity  onPress={updateCrop}>
                                <View style={Styles.button}>
                                <Text style={{ color: '#49c1a4',fontWeight:'bold',fontSize:20 }}>Save</Text>
                                </View>
                            </TouchableOpacity>
                        </Modal>}                 
                    </Portal>
                </Provider>
            </ScrollView>
    )
}
const Styles = StyleSheet.create({
    button: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 15,
        fontSize: 40,
        padding:10,
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
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        padding:5,
        borderRadius: 10,
        paddingLeft:10,
        height:40
      },
    text:{
        alignSelf:'center'
    },
    addBtn:{
        alignSelf:'center'
    },
    containerStyle:{
        backgroundColor: 'white', 
        height:300,
        width:'80%',
        alignSelf:'center',
        borderRadius:20,
        borderColor: '#49c1a4',
        borderWidth:2
    }
})
export default SellScreen