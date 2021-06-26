import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    TextInput,
    ScrollView,
    View,
    Picker,
    Alert,
    Image,
    Text,
    Button,
    TouchableOpacity,
} from 'react-native';
// import LogIn from 'LogInScreen';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [phoneNumber, setNumber] = useState('');
    const [dzongkhagList, setDzongkhagList] = useState([]);
    const [dzongkhag, setDzongkhag] = useState('');
    const [gewogList, setGewogList] = useState([]);
    const [gewog, setGewog] = useState('');
    const [villageList, setVillageList] = useState([]);
    const [village, setVillage] = useState('');
    const [image, setImage] = useState(null);
    function sendNameValue(value) {
        setName(value);
    }
    function sendPhoneNumberValue(value) {
        setNumber(value);
    }
    useEffect(() => {
        getDzongkhagList();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const getDzongkhagList = async () => {
        data = await axios.get('http://wccl.erp.bt/api/method/gangola.api.get_dzongkhags');
        setDzongkhagList(data.data.message);
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };
    const getGewogs = async (v) => {
        data = await axios.get(' http://wccl.erp.bt/api/method/gangola.api.get_gewogs', {
            params: { dzongkhag: v },
        });
        setGewogList(data.data.message);
        setVillage('');
    };
    const getVillages = async (v) => {
        data = await axios.get('http://wccl.erp.bt/api/method/gangola.api.get_villages', {
            params: { dzongkhag: dzongkhag, gewog: v },
        });
        setVillageList(data.data.message);
    };
    const registerUser = async (n, pN, d, g, v) => {
        if (!n.trim()) {
            return Alert.alert('Missing Field', 'Name is mandatory.');
        }
        if (!pN.trim()) {
            return Alert.alert('Missing Field', 'Phone Number is mandatory.');
        }
        if (!d.trim()) {
            return Alert.alert('Missing Field', 'Dzongkhag is mandatory.');
        }
        if (!g.trim()) {
            return Alert.alert('Missing Field', 'Gewog is mandatory.');
        }
        response = await axiox.post('', {
            params: { name: name, pN: phoneNumber, d: dzongkhag, g: gewog, v: village },
        });
    };
    return (
        <LinearGradient
            colors={['white', '#36907B']}
            start={{
                x: 0,
                y: 0,
            }}
            end={{
                x: 1,
                y: 3,
            }}
        >
            <ScrollView style={{ padding: 10 }}>
                <TextInput
                    onChangeText={sendNameValue}
                    placeholder={'Name'}
                    style={styles.inputText}
                    value={name}
                ></TextInput>
                <TextInput
                    onChangeText={sendPhoneNumberValue}
                    placeholder={'Phone Number'}
                    style={styles.inputText}
                    value={phoneNumber}
                    keyboardType="numeric"
                ></TextInput>
                <View style={styles.picker}>
                    <Picker
                        mode="dropdown"
                        selectedValue={dzongkhag}
                        onValueChange={(val) => {
                            getGewogs(val), setDzongkhag(val);
                        }}
                    >
                        <Picker.Item label={'Select Dzongkhag'} value={undefined} key={-1} />
                        {dzongkhagList &&
                            dzongkhagList.map((pur, idx) => {
                                return <Picker.Item label={pur.name} value={pur.name} key={idx} />;
                            })}
                    </Picker>
                </View>
                <View style={styles.picker}>
                    <Picker
                        mode="dropdown"
                        selectedValue={gewog}
                        onValueChange={(val) => {
                            setGewog(val), getVillages(val);
                        }}
                    >
                        <Picker.Item label={'Select Gewog'} value={undefined} key={-1} />
                        {gewogList &&
                            gewogList.map((pur, idx) => {
                                return <Picker.Item label={pur.name} value={pur.name} key={idx} />;
                            })}
                    </Picker>
                </View>
                <View style={styles.picker}>
                    <Picker mode="dropdown" selectedValue={village} onValueChange={setVillage}>
                        <Picker.Item label={'Select Village'} value={undefined} key={-1} />
                        {villageList &&
                            villageList.map((pur, idx) => {
                                return <Picker.Item label={pur.name} value={pur.name} key={idx} />;
                            })}
                    </Picker>
                </View>
                <TouchableOpacity onPress={pickImage}>
                    <View style={styles.button}>
                        <Text style={{ color: '#49c1a4' }}>Pick Profile Picture</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => registerUser(name, phoneNumber, dzongkhag, gewog, village)}
                >
                    <View style={styles.button}>
                        <Text style={{ color: '#49c1a4' }}>Register</Text>
                    </View>
                </TouchableOpacity>
                <View>{image && <Image source={{ uri: image }} style={styles.image} />}</View>
                <Text style={styles.text} onPress={() => navigation.navigate('LogIn')}>
                    Already Have An Account? Log In
                </Text>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    picker: {
        fontSize: 16,
        borderColor: '#49c1a4',
        borderWidth: 2,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 15,
        borderRadius: 30,
    },
    text: {
        fontSize: 12,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 15,
        marginBottom: '55%',
        textAlign: 'center',
    },
    button: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 15,
        fontSize: 20,
        padding: 15,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        borderColor: '#49c1a4',
        borderWidth: 2,
    },
    inputText: {
        fontSize: 16,
        borderColor: '#49c1a4',
        borderWidth: 2,
        paddingTop: 10,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 15,
        padding: 10,
        borderRadius: 30,
    },
    image: {
        height: 200,
        width: 200,
        alignSelf: 'center',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 15,
    },
});

export default RegisterScreen;
