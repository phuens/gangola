import React, { Component } from 'react';
import { Text, StyleSheet, View, Button, Alert } from 'react-native';
import { IconButton, Colors } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Drawer = ({ navigation }) => {
    function logOut() {
        global.phone = 0;
        navigation.navigate('Home');
        return alert('Logged out');
    }
    if (!global.phone || phone === 0) {
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
                    <Text style={{ paddingLeft: 10, fontSize: 25, color: '#FFF' }}>Menu</Text>
                </View>
                <View style={styles.sub_menu_1}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row' }}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <IconButton icon="storefront" color="#0275d8" size={20} />
                        <Text style={styles.touch_button}>Sell</Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        width: '100%',
                        height: 2,
                        backgroundColor: '#f7f7f1',
                        marginBottom: 13,
                    }}
                />
                <View style={styles.sub_menu}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row' }}
                        onPress={() => navigation.navigate('Disease')}
                    >
                        <IconButton icon="leaf" color="#0275d8" size={20} />
                        <Text style={styles.touch_button}>Crop+</Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        width: '100%',
                        height: 2,
                        backgroundColor: '#f7f7f1',
                        marginBottom: 13,
                    }}
                />
                <View style={styles.sub_menu}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row' }}
                        onPress={() => navigation.navigate('Dashboard')}
                    >
                        <IconButton icon="chart-bar" color="#0275d8" size={20} />
                        <Text style={styles.touch_button}>Dashboard</Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        width: '100%',
                        height: 2,
                        backgroundColor: '#f7f7f1',
                        marginBottom: 13,
                    }}
                />
                <View style={styles.sub_menu}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row' }}
                        onPress={() => navigation.navigate('Weather')}
                    >
                        <IconButton icon="weather-partly-cloudy" color="#0275d8" size={20} />
                        <Text style={styles.touch_button}>Weather</Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        width: '100%',
                        height: 2,
                        backgroundColor: '#f7f7f1',
                        marginBottom: 20,
                    }}
                />
            </View>
        );
    } else {
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
                    <Text style={{ paddingLeft: 10, fontSize: 25, color: '#FFF' }}>Menu</Text>
                </View>
                <View
                    style={{
                        width: '100%',
                        height: 2,
                        backgroundColor: '#f7f7f1',
                        marginBottom: 13,
                    }}
                />
                <View>
                    <Text style={{ fontSize: 16, alignSelf: 'center', fontWeight: 'bold' }}>
                        Logged In User
                    </Text>

                    <View style={styles.sub_menu_1}>
                        <TouchableOpacity style={{ flexDirection: 'row' }}>
                            <IconButton icon="account-circle" color="#0275d8" size={20} />
                            <Text style={styles.touch_button}>{phone}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View
                    style={{
                        width: '100%',
                        height: 2,
                        backgroundColor: '#f7f7f1',
                        marginBottom: 13,
                    }}
                />
                <View style={styles.sub_menu_1}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row' }}
                        onPress={() => navigation.navigate('Sell')}
                    >
                        <IconButton
                            icon="storefront"
                            color="#0275d8"
                            size={20}
                            onPress={() => drawerShow()}
                        />
                        <Text style={styles.touch_button}>Sell</Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        width: '100%',
                        height: 2,
                        backgroundColor: '#f7f7f1',
                        marginBottom: 13,
                    }}
                />
                <View style={styles.sub_menu}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row' }}
                        onPress={() => navigation.navigate('Disease')}
                    >
                        <IconButton
                            icon="leaf"
                            color="#0275d8"
                            size={20}
                            onPress={() => drawerShow()}
                        />
                        <Text style={styles.touch_button}>Crop+</Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        width: '100%',
                        height: 2,
                        backgroundColor: '#f7f7f1',
                        marginBottom: 13,
                    }}
                />
                <View style={styles.sub_menu}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row' }}
                        onPress={() => navigation.navigate('Dashboard')}
                    >
                        <IconButton
                            icon="chart-bar"
                            color="#0275d8"
                            size={20}
                            onPress={() => drawerShow()}
                        />
                        <Text style={styles.touch_button}>Dashboard</Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        width: '100%',
                        height: 2,
                        backgroundColor: '#f7f7f1',
                        marginBottom: 13,
                    }}
                />
                <View style={styles.sub_menu}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row' }}
                        onPress={() => navigation.navigate('Weather')}
                    >
                        <IconButton
                            icon="weather-partly-cloudy"
                            color="#0275d8"
                            size={20}
                            onPress={() => drawerShow()}
                        />
                        <Text style={styles.touch_button}>Weather</Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        width: '100%',
                        height: 2,
                        backgroundColor: '#f7f7f1',
                        marginBottom: 13,
                    }}
                />
                <View style={styles.sub_menu}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row' }}
                        onPress={() => {
                            logOut();
                        }}
                    >
                        <IconButton icon="logout" color="#0275d8" size={20} />
                        <Text style={styles.touch_button}>Log Out</Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        width: '100%',
                        height: 2,
                        backgroundColor: '#f7f7f1',
                        marginBottom: 20,
                    }}
                />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: '100%',
        width: 200,
        zIndex: 3,
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

export default Drawer;
