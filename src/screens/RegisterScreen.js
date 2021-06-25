import React, { useState, useEffect } from "react";
import { Text, StyleSheet, TextInput, View, Button, Picker, Alert } from "react-native";
// import LogIn from 'LogInScreen';
import axios from 'axios'
import { IconButton, Colors } from 'react-native-paper';


const RegisterScreen = ({ navigation }) => {
  const[name, setName] = useState("");
  const[phoneNumber, setNumber] = useState("");
  const [dzongkhagList, setDzongkhagList] = useState([]);
  const [dzongkhag, setDzongkhag] = useState("");
  const [gewogList, setGewogList] = useState([]);
  const [gewog, setGewog] = useState("");
  const [villageList, setVillageList] = useState([]);
  const [village, setVillage] = useState("");
  function sendNameValue(value) {
    setName(value)
  };
  function sendPhoneNumberValue(value) {
    setNumber(value)
  };
  useEffect( ()=>{
    getDzongkhagList()
  },[]);
  const getDzongkhagList = async() => {
    data = await axios.get("http://wccl.erp.bt/api/method/gangola.api.get_dzongkhags")
    setDzongkhagList(data.data.message)
  }
  const getGewogs = async (v)=>{
    data = await axios.get(" http://wccl.erp.bt/api/method/gangola.api.get_gewogs",{params:{dzongkhag:v}})
    setGewogList(data.data.message)
    setVillage("")
  }
  const getVillages = async (v)=>{
    data = await axios.get("http://wccl.erp.bt/api/method/gangola.api.get_villages",{params:{dzongkhag:dzongkhag, gewog:v}})
    setVillageList(data.data.message)
  }
  const registerUser = async (n, pN, d, g, v)=>{
    if (!n.trim()){
      return Alert.alert('Missing Field','Name is mandatory.');
    }
    if (!pN.trim()){
      return Alert.alert('Missing Field','Phone Number is mandatory.');
    }
    if (!d.trim()){
      return Alert.alert('Missing Field','Dzongkhag is mandatory.');
    }
    if (!g.trim()){
      return Alert.alert('Missing Field','Gewog is mandatory.');
    }
    response = await axiox.post("", {params: {name:name, pN:phoneNumber, d:dzongkhag, g:gewog, v:village}})
  }
  return (
   <View>
     <TextInput onChangeText = {sendNameValue} placeholder={"Name"} style={styles.inputText} value={name}></TextInput>
     <TextInput onChangeText={sendPhoneNumberValue} placeholder={"Phone Number"} value={phoneNumber} keyboardType='numeric'></TextInput>
     <Picker
                    mode="dropdown"
                    selectedValue={dzongkhag}
                    onValueChange={val => {getGewogs(val), setDzongkhag(val)}}>
                    <Picker.Item
                      label={'Select Dzongkhag'}
                      value={undefined}
                      key={-1}
                    />
                    {dzongkhagList &&
                      dzongkhagList.map((pur, idx) => {
                        return (
                          <Picker.Item
                            label={pur.name}
                            value={pur.name}
                            key={idx}
                          />
                        );
                      })}
      </Picker>
      <Picker
                    mode="dropdown"
                    selectedValue={gewog}
                    onValueChange={val => {setGewog(val), getVillages(val)}}>
                    <Picker.Item
                      label={'Select Gewog'}
                      value={undefined}
                      key={-1}
                    />
                    {gewogList &&
                      gewogList.map((pur, idx) => {
                        return (
                          <Picker.Item
                            label={pur.name}
                            value={pur.name}
                            key={idx}
                          />
                        );
                      })}
      </Picker>
      <Picker
                    mode="dropdown"
                    selectedValue={village}
                    onValueChange={setVillage}>
                    <Picker.Item
                      label={'Select Village'}
                      value={undefined}
                      key={-1}
                    />
                    {villageList &&
                      villageList.map((pur, idx) => {
                        return (
                          <Picker.Item
                            label={pur.name}
                            value={pur.name}
                            key={idx}
                          />
                        );
                    })}
      </Picker>
     <Button title="Register" style={styles.button} onPress={() => registerUser(name, phoneNumber, dzongkhag, gewog, village)} />
     <Text onPress={() => navigation.navigate('LogIn')}>Already Have An Account? Log In</Text>
   </View> 
   
  )
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30
  },
  button: {
    backgroundColor: '#49c1a4',
  },
  inputText: {
    borderColor: 'black',
    borderWidth: 2,
    justifyContent: 'center',
  }
});

export default RegisterScreen;
