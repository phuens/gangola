import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Button, TouchableOpacity, Image } from 'react-native';
import Navbar from '../component/navbar/navbar';
import Drawer from '../component/navbar/drawer';
import { ScrollView } from 'react-native-gesture-handler';
import { IconButton } from 'react-native-paper';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
    const [showDrawer, setShowDrawer] = useState(false);
    const [productsList, setProductsList] = useState([]);

    const drawerShow = () => {
        setShowDrawer(!showDrawer);
        console.log('hello again my dear');
    };

    useEffect(() => {
        getDate();
    }, []);

    const getDate = async () => {
        // console.log('righ before call');
        let date = '2021-06-26';
        let data = await axios.get('http://wccl.erp.bt/api/method/gangola.api.get_crops', {
            params: { as_on_date: '' },
        });
        setProductsList(data.data.message);
        // console.log(data.data.message);
    };
    return (
        <ScrollView>
            <Navbar drawerShow={drawerShow} />

            {showDrawer ? (
                <View>
                    <Drawer navigation={navigation} />
                </View>
            ) : (
                <View>
                    <Text></Text>
                </View>
            )}

            {productsList.map((value, index) => (
                <View
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        backgroundColor: '#88888817',
                        marginBottom: 10,
                        marginTop: 10,
                        marginLeft: 5,
                        marginRight: 5,
                        height: 60,
                        borderRadius: 50,
                    }}
                    key={value + index}
                >
                    <View
                        style={{
                            flex: 1,
                            marginTop: 10,
                            marginBottom: 50,
                            width: '100%',
                        }}
                        // key={value}
                    >
                        <Image
                            style={styles.image}
                            source={{
                                uri: `http://wccl.erp.bt${value.crop_image}`,
                            }}
                        />
                    </View>
                    <View style={{ flex: 1, paddingTop: 23, marginLeft: 20 }}>
                        <Text>Nu. {value.avg_rate}</Text>
                    </View>
                    <View style={{ flex: 1, paddingTop: 23, marginLeft: 20 }}>
                        <Text>{value.crop}</Text>
                    </View>
                    <TouchableOpacity>
                        <IconButton
                            icon="arrow-right-circle"
                            color="#49c1a3"
                            size={30}
                            style={{ paddingTop: 5 }}
                            onPress={() =>
                                navigation.navigate('Product', { crop_name: value.crop })
                            }
                        />
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 30,
    },
    navbar: {
        zIndex: 1,
    },
    image: {
        width: '80%',
        height: 50,
        marginLeft: 5,
    },
});

export default HomeScreen;
