import React, { Component } from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';
import { IconButton, Colors } from 'react-native-paper';

export default class Navbar extends Component {
    render() {
        return (
            <View style={styles.container}>
                <IconButton
                    icon="menu"
                    color="#FFF"
                    size={30}
                    onPress={() => console.log('karma ass')}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#49c1a4',
    },
    icon_container: {
        paddingLeft: 10,
    },
});
