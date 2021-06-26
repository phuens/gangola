import React, { Component } from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';
import { IconButton } from 'react-native-paper';

const Navbar = ({ drawerShow }) => {
    return (
        <View>
            <View style={styles.container}>
                <IconButton icon="menu" color="#FFF" size={30} onPress={() => drawerShow()} />
            </View>
            {/* <View style={styles.container}>
                <View style={styles.sub_menu}>
                    <Button title="Sell" onPress={() => navigation.navigate('Register')} />
                </View>
                <View style={styles.sub_menu}>
                    <Button
                        title="Crop Maintenance"
                        onPress={() => navigation.navigate('Register')}
                    />
                </View>
            </View> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#49c1a4',
    },
    icon_container: {
        paddingLeft: 10,
    },
});

export default Navbar;
