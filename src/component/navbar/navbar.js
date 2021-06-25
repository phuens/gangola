import React, { Component } from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';
import { IconButton } from 'react-native-paper';

const Navbar = ({ drawerShow }) => {
    return (
        <View style={styles.container}>
            <IconButton icon="menu" color="#FFF" size={30} onPress={() => drawerShow()} />
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
