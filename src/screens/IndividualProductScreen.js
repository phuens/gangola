import React from 'react';
import { Text, View, Button, Dimensions, Picker } from 'react-native';

const IndividualProductScreen = ({ route, navigation }) => {
    return (
        <View style={{ padding: 20 }}>
            <View style={{ padding: 10, backgroundColor: '#49c1a4' }}>
                <Text style={{ fontSize: 40, color: '#FFF' }}>{route.params.crop}</Text>
                <View
                    style={{
                        width: '100%',
                        height: 2,
                        backgroundColor: '#f7f7f1',
                        marginBottom: 13,
                    }}
                />
                <Text style={{ fontSize: 20, color: '#FFF', marginTop: 10 }}>
                    Farmer Name: {route.params.farmer}
                </Text>
                <Text style={{ fontSize: 20, color: '#FFF', marginTop: 10 }}>
                    Dzongkhag: {route.params.dzongkhag}
                </Text>
                {/* <Text> {route.params.gewog}</Text>
                <Text> {route.params.village}</Text> */}

                <Text style={{ fontSize: 20, color: '#FFF', marginTop: 10 }}>
                    Rate: {route.params.rate} per {route.params.uom}
                </Text>

                <Text style={{ fontSize: 20, color: '#FFF', marginTop: 10 }}>
                    Quantity: {route.params.qty}
                </Text>
                <Text style={{ fontSize: 20, color: '#FFF', marginTop: 10 }}>
                    Phone number: {route.params.number}
                </Text>
                <Text style={{ fontSize: 15, color: '#FFF', marginTop: 10 }}>
                    Rate As On: {route.params.date}
                </Text>
            </View>
        </View>
    );
};

export default IndividualProductScreen;