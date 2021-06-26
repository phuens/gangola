import React, { Component } from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';
import { IconButton, Colors } from 'react-native-paper';

const Drawer = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View
                style={{
                    backgroundColor: '#49c1a4',
                    borderWidth: 1,
                    borderColor: '#f7f7f1',
                    height: 50,
                    justifyContent: 'center',
                }}
            >
                <Text style={{ paddingLeft: 10, fontSize: 20, color: '#FFF' }}>Menu</Text>
            </View>
            <View style={styles.sub_menu_1}>
                <Button title="Sell" onPress={() => navigation.navigate('Register')} />
            </View>
            <View
                style={{ width: '100%', height: 2, backgroundColor: '#f7f7f1', marginBottom: 13 }}
            />
            <View style={styles.sub_menu}>
                <Button title="Crop Maintenance" onPress={() => navigation.navigate('Register')} />
            </View>
            <View
                style={{ width: '100%', height: 2, backgroundColor: '#f7f7f1', marginBottom: 13 }}
            />
            <View style={styles.sub_menu}>
                <Button title="Dashboard" onPress={() => navigation.navigate('Register')} />
            </View>
            <View
                style={{ width: '100%', height: 2, backgroundColor: '#f7f7f1', marginBottom: 13 }}
            />
            <View style={styles.sub_menu}>
                <Button title="Weather " onPress={() => navigation.navigate('Register')} />
            </View>
            <View
                style={{ width: '100%', height: 2, backgroundColor: '#f7f7f1', marginBottom: 20 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        // position: 'absolute',
        height: '100%',
        width: 200,
        // borderRightColor: '#000',
        // borderWidth: 1,
        zIndex: 3,
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#49c1a4',
        justifyContent: 'space-between',
    },
    menu: {
        fontSize: 20,
        padding: 15,
        color: '#8d8b8b94',
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
});

export default Drawer;
