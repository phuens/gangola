import React, { useState, useEffect } from "react";
import { Text, StyleSheet, TextInput, View, Button, Picker, Alert } from "react-native";
// import LogIn from 'LogInScreen';
import axios from 'axios'

const LogInScreen = ({ navigation }) => {
  const[name, setName] = useState("");
  const[phoneNumber, setNumber] = useState("");
  const[password, setPassword] = useState("");
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
  const logIn = async (n, pw)=>{
    if (!n.trim()){
      return Alert.alert('Missing Field','Name is mandatory.');
    }
    if (!pw.trim()){
      return Alert.alert('Missing Field','Password is mandatory.');
    }
    response = await axiox.post("", {params: {name:name, pN:phoneNumber, d:dzongkhag, g:gewog, v:village}})
  }
  return (
   <View>
     <TextInput onChangeText = {sendNameValue} placeholder={"Name"} value={name}></TextInput>
     <TextInput onChangeText={setPassword} secureTextEntry={true} style={styles.default} value={password} placeholder={"Password"} />
     <Button title="Log In" onPress={() => logIn(name, password)} />
     <Text onPress={() => navigation.navigate('Register')}>Don't Have An Account? Register</Text>
   </View> 
   
  )
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30
  }
});

export default LogInScreen;
