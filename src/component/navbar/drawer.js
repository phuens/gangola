import React, { Component } from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';
import { IconButton, Colors } from 'react-native-paper';

const Drawer = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.sub_menu}>
                <Button title="Sell" onPress={() => navigation.navigate('Register')} />
            </View>
            <View style={styles.sub_menu}>
                <Button title="Crop Maintenance" onPress={() => navigation.navigate('Register')} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        position: 'absolute',
        // height: '100%',
        width: 200,
        // borderRightColor: '#000',
        borderWidth: 1,
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
        color: '#FFF',
    },
    sub_menu: {
        alignSelf: 'flex-start',
        paddingLeft: 10,
    },
});

export default Drawer;
