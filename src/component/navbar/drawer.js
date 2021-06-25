import React, { Component } from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';
import { IconButton, Colors } from 'react-native-paper';

const Drawer = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.menu}>Menu</Text>
                <IconButton
                    icon="menu"
                    color="#FFF"
                    size={30}
                    onPress={() => console.log('karma ass')}
                />
            </View>
            <View></View>
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
        height: '100%',
        backgroundColor: '#fff',
        position: 'absolute',
        width: 200,
        borderRightColor: '#000',
        borderWidth: 1,
    },
    icon_container: {
        paddingLeft: 10,
    },
    menu: {
        fontSize: 20,
        backgroundColor: '#49c1a4',
        padding: 11,
        color: '#FFF',
    },
    sub_menu: {
        alignSelf: 'flex-start',
        paddingLeft: 5,
    },
});

export default Drawer;
