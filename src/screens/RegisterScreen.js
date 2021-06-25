import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TextInput, View} from "react-native";

const RegisterScreen = () => {
  const { name, setName} = useState('')
  const onChangeHandler = (e)=>{

  }
  return (<View>
    <TextInput onChange>
    </TextInput>
  </View>)
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30
  }
});

export default RegisterScreen;
