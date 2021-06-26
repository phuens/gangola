import React, { useState, useEffect } from "react";
import { Text, StyleSheet, TextInput, View, Button, Picker, Alert } from "react-native";
// import LogIn from 'LogInScreen';
import axios from 'axios'

const LogInScreen = ({ navigation }) => {
  const[phoneNumber, setNumber] = useState("");
  const[password, setPassword] = useState("");
  function sendPhoneNumberValue(value) {
    setNumber(value)
  };
  const logIn = async (pN, pW)=>{
    if (!pN.trim()){
      return Alert.alert('Missing Field','Phone Number is mandatory.');
    }
    if (!pW.trim()){
      return Alert.alert('Missing Field','Password is mandatory.');
    }
    response = await axiox.post("", {params: {name:name, pN:phoneNumber, d:dzongkhag, g:gewog, v:village}})
  }
  return (
   <View style={{padding:10}}>
     <TextInput onChangeText={sendPhoneNumberValue} style={styles.inputText}  placeholder={"Phone Number"} value={phoneNumber} keyboardType='numeric'></TextInput>
     <TextInput onChangeText={setPassword} style={styles.inputText} secureTextEntry={true} value={password} placeholder={"Password"} />
     <View style={styles.button}><Button title="Log In" style={{borderRadius: 30}} color='#49c1a4' onPress={() => logIn(phoneNumber, password)} /></View>
     <Text style={styles.text} onPress={() => navigation.navigate('Register')}>Don't Have An Account? Register</Text>
   </View> 
   
  )
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 15,
    textAlign: "center",
    padding: 5
  },
  button: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 35,
    // borderRadius: 30
  },
  inputText: {
    borderColor: '#49c1a4',
    borderWidth: 2,
    paddingTop: 10,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 15,
    padding:10,
    borderRadius: 30

  },
});

export default LogInScreen;
