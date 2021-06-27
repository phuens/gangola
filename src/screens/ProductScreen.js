import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TextInput, View, Button, Collapsible, TouchableOpacity, Picker } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import DatePicker from 'react-native-date-picker';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';

const RegisterScreen = ({ route, navigation }) => {
    const [date, setDate] = useState(new Date());
    const [farmerList, setfarmerList] = useState([]);
    const [dzongkhagList, setDzongkhagList] = useState([]);
    const [dzongkhag, setDzongkhag] = useState("");
    useEffect(() => {
        getFarmerData();
        getDzongkhagList();
    }, []);
    const getDzongkhagList = async() => {
        data = await axios.get("http://wccl.erp.bt/api/method/gangola.api.get_dzongkhags")
        setDzongkhagList(data.data.message)
      }

    const getFarmerData = async () => {
        let data = await axios.get('http://wccl.erp.bt/api/method/gangola.api.get_farmers', {
            params: { as_on_date: '', crop: route.params.crop_name },
        });
        setfarmerList(data.data.message);
        // console.log('-----------------');
        console.log(data.data.message);
    };
    const filterByDate = async() => {
        let data = await axios.get('http://wccl.erp.bt/api/method/gangola.api.get_farmers', {
            params: { as_on_date: '', crop: route.params.crop_name },
        })
        data.data.message.sort((a,b) => new Date(a.as_on_date).getTime() - new Date(b.as_on_date).getTime());
        setfarmerList(data.data.message);
        // console.log(data.data.message)
    }
    const filterByDzongkhag = async(v) => {
        console.log(v)
        setDzongkhag(v)
        let data = await axios.get('http://wccl.erp.bt/api/method/gangola.api.get_farmers', {
            params: { as_on_date: '', crop: route.params.crop_name },
        })
        if(v!==undefined){
            const filtered = data.data.message.filter((x) => x.dzongkhag === v);
            setfarmerList(filtered);
        }
        else{
            setfarmerList(data.data.message);
        }
        console.log(filtered)
    }
    return (
        <ScrollView style={styles.container}>
            {/* <Text>Filter By Location</Text> */}
            <Text style={styles.crop_name}>{route.params.crop_name}</Text>
            {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                <View>
                    <Text
                        style={{ width: 130, textAlign: 'center', color: '#49c1a4', fontSize: 25 }}
                    >
                        {route.params.crop_name}
                    </Text>
                </View>
                <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
            </View> */}
            <View
                style={{ width: '100%', height: 2, backgroundColor: '#49c1a4', marginBottom: 20 }}
            />
            <View>
                {/* <TouchableOpacity onPress={filterByDate}>
                    <View style={styles.button}>
                         <Text style={{ color: '#49c1a4', }}>Date</Text>
                    </View>
                </TouchableOpacity> */}
                <Picker
                    mode="dropdown"
                    itemStyle={{height:50}}
                    selectedValue={dzongkhag}
                    onValueChange={(val) => {filterByDzongkhag(val)}}>
                    <Picker.Item
                      label={'Filter By Dzongkhag'}
                      value={undefined}
                      key={-1}
                    />
                    {dzongkhagList &&
                      dzongkhagList.map((pur, idx) => {
                        return (
                          <Picker.Item
                            label={pur.name}
                            value={pur.name}
                            key={idx}
                          />
                        );
                      })}
                </Picker>
                {/* <View style={{ padding: 0, margin: 0 }}>
                    <Button title="Search" onPress={() => navigation.navigate('Register')} />
                </View> */}
            </View>

            <View
                style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#b9b9b999',
                    marginBottom: 10,
                    marginTop: 10,
                }}
            />
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    textAign: 'left',
                }}
            >
                <View>
                    <Text style={{ fontWeight: 'bold', color: '#0275d8' }}>Farmer</Text>
                </View>
                <View>
                    <Text style={{ fontWeight: 'bold', color: '#0275d8' }}>Quantity</Text>
                </View>
                <View>
                    <Text style={{ fontWeight: 'bold', color: '#0275d8' }}>Rate (Per Kg)</Text>
                </View>
            </View>
            <View
                style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#b9b9b999',
                    marginBottom: 20,
                    marginTop: 10,
                }}
            />
            {farmerList.map((value, index) => (
                <View key={value + index}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            textAign: 'left',
                        }}
                    >
                        <View>
                            <Text>{value.farmer}</Text>
                        </View>
                        <View>
                            <Text>{value.quantity}</Text>
                        </View>
                        <View>
                            <Text>Nu. {value.rate}</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            width: '100%',
                            height: 1,
                            backgroundColor: '#b9b9b999',
                            marginBottom: 20,
                            marginTop: 10,
                        }}
                    />
                    {/* <View>
                        <Collapsible collapsed={true} align="center">
                            <View style={styles.content}>
                                <Text style={{ textAlign: 'center' }}>
                                    This is a dummy text of Single Collapsible View
                                </Text>
                            </View>
                        </Collapsible>
                    </View> */}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    crop_name: {
        fontSize: 25,
        color: '#49c1a4',
        marginBottom: 5,
        marginTop: 5,
    },
    farmer_list: {
        backgroundColor: '#333',
    },
});

export default RegisterScreen;
