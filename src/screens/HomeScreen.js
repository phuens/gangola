import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TouchableOpacity, View, Alert,ImageBackground } from "react-native";
import {Camera} from 'expo-camera'
// import CameraComponent from '../components/CameraComponent'

const HomeScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back);
  let camera =''
  // const [camera,setCamera] = useState(null)
  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Camera.requestPermissionsAsync();
  //     setHasPermission(status === 'granted');
  //   })();
  // }, []);
  const Pitcure = ()=>{
    return (<Camera style={styles.camera} type={type}
                ref={(r)=>camera = r}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      setType(
                        type === Camera.Constants.Type.back
                          ? Camera.Constants.Type.front
                          : Camera.Constants.Type.back
                      );
                    }}>
                    <Text style={styles.text}> Flip </Text>
                  </TouchableOpacity>
                </View>
                <View
                style={styles.capture}
              >
                <View
                style={styles.innerCapature}
                >
                  <TouchableOpacity
                    onPress={__takePicture}
                    style={styles.takePiectureBtn}
                    />
                </View>
              </View>
            </Camera>)
  }
  const CameraPreview = (photo) => {
    return (
      <View
        style={{
          backgroundColor: 'transparent',
          flex: 1,
          width: '100%',
          height: '100%'
        }}
      >
        <ImageBackground
          source={{uri: photo && photo.uri}}
          style={{
            flex: 1
          }}
        />
      </View>
    )
  }
  const __takePicture = async () => {
    try{
      if (!camera) return
      const photo = await camera.takePictureAsync()
      console.log(photo)
      setPreviewVisible(true)
      setCapturedImage(photo)
    }catch(err){
      console.log(err)
    }
  }
  const __startCamera =async () => {
   try{
      const {status} = await Camera.requestPermissionsAsync()
      if (status === 'granted') {
        setHasPermission(status === 'granted');
      } else {
        Alert.alert('Access denied')
    }
   }catch(err){
     console.log(err)
   }
  }
  return (
    <View style={styles.container}>{
      hasPermission? 
        (<View>
          {
            capturedImage && previewVisible ? <CameraPreview/> :(<Pitcure/>)
          }
        </View>)
      :(
      <View>
        <TouchableOpacity
        onPress={__startCamera}
        style={styles.takePiecture}
      >
        <Text
          style={styles.text}
        >
          Take picture
        </Text>
      </TouchableOpacity></View>)
    }
    </View>
  );
};

const styles = StyleSheet.create({
  takePiectureBtn:{
    width: 70,
    height: 70,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: '#fff'
    },
  innerCapature:{
    alignSelf: 'center',
    flex: 1,
    alignItems: 'center'
    },
  capture:{
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    padding: 20,
    justifyContent: 'space-between'
    },
  container: {
    flex: 1,
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row',
    width: '100%',
    padding: 20,
    justifyContent: 'space-between',
    height:300
  },
  camera: {
    flex: 1,
    width: 400,
    borderRadius: 4,
    backgroundColor: '#14274e',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  takePiecture:{
    width: 130,
    borderRadius: 4,
    backgroundColor: '#14274e',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40
  }
});
export default HomeScreen;
