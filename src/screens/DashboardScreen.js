import React, { Component, useState, useEffect } from 'react';
import { Text, StyleSheet, View, Button, Dimensions, Picker } from 'react-native';
import { IconButton, Colors } from 'react-native-paper';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { LineChart, BarChart } from 'react-native-chart-kit';
import axios from 'axios';

const Dashboard = ({ navigation }) => {
    const [dzongkhagList, setDzongkhagList] = useState([]);
    const [dzongkhag, setDzongkhag] = useState('Potatoes');
    const [cropData, setCropData] = useState([]);
    const [showGraph, setShowGraph] = useState(false);

    useEffect(() => {
        getDzongkhagList();
        crop_date();
        console.log('asdasdadasdadasda');
    }, []);
    const getDzongkhagList = async () => {
        let data = await axios.get(
            'http://wccl.erp.bt/api/method/gangola.api.get_crops?as_on_date'
        );
        setDzongkhagList(data.data.message);
        // console.log(`----> ${data.data.message}`);
    };
    const crop_date = async () => {
        let crop_date = await axios.get(
            'http://wccl.erp.bt/api/method/gangola.api.get_daily_stats',
            {
                params: { as_on_date: '', crop: dzongkhag },
            }
        );
        setCropData(crop_date.data.message);
        console.log(`----> ${crop_date.data.message[0].ason_date}`);
        setShowGraph(true);
    };

    const DrawnGraph = () => {
        return (
            <ScrollView style={styles.container}>
                <View style={{ alignItems: 'center' }}>
                    {/* <Text
                        style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            marginBottom: 10,
                            marginTop: 10,
                        }}
                    >
                        Price for {dzongkhag}
                    </Text> */}

                    <LineChart
                        data={{
                            labels: cropData.map((item) => {
                                return item.ason_date;
                            }),
                            datasets: [
                                {
                                    data: cropData.map((item) => {
                                        console.log('ƒƒƒƒƒƒƒ: ', +cropData[0].avg_rate);
                                        console.log('++++++++++++++++: ' + item.avg_rate);
                                        return parseFloat(item.avg_rate);
                                    }),
                                    // data: [39.22, 38.23],
                                },
                            ],
                        }}
                        width={Dimensions.get('window').width - 20} // from react-native
                        height={500}
                        yAxisLabel="Nu "
                        yAxisInterval={4} // optional, defaults to 1
                        verticalLabelRotation={90}
                        showValuesOnTopOfBars="true"
                        fromZero="true"
                        chartConfig={{
                            backgroundColor: '#e26a00',
                            backgroundGradientFrom: '#fb8c00',
                            backgroundGradientTo: '#ffa726',
                            decimalPlaces: 2, // optional, defaults to 2dp
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 0,
                                padding: 3,
                            },
                            // propsForDots: {
                            //     r: '5',
                            //     strokeWidth: '2',
                            //     stroke: '#ffa726',
                            // },
                            propsForBackgroundLines: {
                                strokeWidth: 1,
                                stroke: '#ffffff19',
                                strokeDasharray: '0',
                            },
                            propsForBar: {
                                strokeWidth: 1,
                                stroke: 'red',
                                strokeDasharray: '0',
                            },
                        }}
                        // bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 0,
                            marginBottom: 20,
                        }}
                    />
                </View>
            </ScrollView>
        );
    };
    return (
        <>
            <Picker
                mode="dropdown"
                itemStyle={{ height: 50 }}
                selectedValue={dzongkhag}
                onValueChange={(val) => {
                    setDzongkhag(val);
                    crop_date();
                }}
            >
                <Picker.Item label={'select crop'} value={undefined} key={-1} />
                {dzongkhagList &&
                    dzongkhagList.map((pur, idx) => {
                        console.log('hellooooo');
                        return <Picker.Item label={pur.crop} value={pur.crop} key={idx} />;
                    })}
            </Picker>
            {showGraph ? (
                <View>
                    <DrawnGraph />
                </View>
            ) : (
                <View>
                    <Text>Graph loading</Text>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        zIndex: 3,
        margin: 10,
    },

    sub_menu_1: {
        alignSelf: 'flex-start',
        paddingLeft: 10,
        marginTop: 10,
    },
    sub_menu: {
        alignSelf: 'flex-start',
        paddingLeft: 10,
    },
    touch_button: {
        fontSize: 20,
        paddingLeft: 3,
        paddingTop: 10,
        color: '#0275d8',
    },
});

export default Dashboard;
