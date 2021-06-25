import * as React from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';
import Navbar from '../component/navbar/navbar';
import Drawer from '../component/navbar/drawer';
// import { Tab } from 'react-native-elements/dist/tab/Tab';

const HomeScreen = ({ navigation }) => {
    return (
        <>
            <Navbar />
            <Drawer navigation={navigation} />
            {/* <View>
                <Button title="Hello" onPress={() => navigation.navigate('Register')} />
            </View> */}
        </>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 30,
    },
});
export default HomeScreen;
