import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TextInput, View, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';

const RegisterScreen = ({ route, navigation }) => {
    const [date, setDate] = useState(new Date());
    const [dzongkhag, setDzongkhag] = useState('');
    const [farmerList, setfarmerList] = useState([]);

    useEffect(() => {
        getFarmerData();
    }, []);

    const getFarmerData = async () => {
        console.log('right before farmer data');
        let data = await axios.get('http://wccl.erp.bt/api/method/gangola.api.get_farmers', {
            params: { as_on_date: '', crop: 'Garlic' },
        });
        setfarmerList(data.data.message);
        console.log('-----------------');
        console.log(data.data.message[0].ason_date);
    };
    return (
        <ScrollView style={styles.container}>
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
            <View style={{ flexDirection: 'row' }}>
                <View>
                    <Text> Date </Text>
                </View>
                <View>
                    <Text> Location </Text>
                </View>
                <View style={{ padding: 0, margin: 0 }}>
                    <Button title="Search" onPress={() => navigation.navigate('Register')} />
                </View>
            </View>
            {/* <View
                style={{ width: '100%', height: 1, backgroundColor: '#b9b9b999', marginBottom: 20 }}
            /> */}
            {farmerList.map((value, index) => (
                <View>
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
                            <Text>
                                {value.rate} per {value.uom}
                            </Text>
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
