import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import {
    Text,
    DiseaseStyleheet,
    TouchableOpacity,
    View,
    Alert,
    ImageBackground,
} from 'react-native';
import { Camera } from 'expo-camera';
import DiseaseStyle from './DiseaseStyle';
import { IconButton } from 'react-native-paper';

const DiseaseScreen = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [capturedImage, setCapturedImage] = useState('');
    const [type, setType] = useState(Camera.Constants.Type.back);
    let camera = '';

    const getSiteDocuments = async () => {
        const images = await getImages();
        setapproval_document(images);
    };

    const CameraPreview = ({ photo, retakePicture, savePhoto }) => {
        return (
            <View style={{ height: '100%' }}>
                <ImageBackground source={{ uri: photo && photo.uri }} style={DiseaseStyle.img}>
                    <View style={DiseaseStyle.imgView}>
                        <View style={DiseaseStyle.innerMostView}>
                            <TouchableOpacity onPress={retakePicture} style={DiseaseStyle.imgBtn}>
                                <Text style={DiseaseStyle.imgText}>Re-take</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={DiseaseStyle.imgBtn}
                                onPress={() =>
                                    navigation.navigate('Result', {
                                        capturedImage: capturedImage,
                                    })
                                }
                            >
                                <Text style={DiseaseStyle.imgText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        );
    };
    const __savePhoto = () => {};
    const __retakePicture = () => {
        setCapturedImage(null);
        setPreviewVisible(false);
        __startCamera();
    };
    const __takePicture = async () => {
        try {
            if (!camera) return;
            const photo = await camera.takePictureAsync({
                includeBase64: true,
                isCamera: true,
                forceJpg: true,
                compressQuality: 50,
                width: 300,
                height: 300,
                minCompressSize: 8000, //6 MB
                title: 'image',
            });
            console.log(photo);
            setPreviewVisible(true);
            setCapturedImage(photo);
        } catch (err) {
            console.log(err);
        }
    };
    const __startCamera = async () => {
        try {
            const { status } = await Camera.requestPermissionsAsync();
            if (status === 'granted') {
                setHasPermission(status === 'granted');
            } else {
                Alert.alert('Access denied');
            }
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        __startCamera();
    });
    return (
        <View>
            {hasPermission ? (
                <View>
                    {capturedImage && previewVisible ? (
                        <CameraPreview
                            style={{}}
                            photo={capturedImage}
                            savePhoto={__savePhoto}
                            retakePicture={__retakePicture}
                        />
                    ) : (
                        <View>
                            <View>
                                <Camera
                                    style={{ height: '100%', width: '100%' }}
                                    type={type}
                                    ref={(r) => (camera = r)}
                                >
                                    <View style={DiseaseStyle.capture}></View>
                                </Camera>
                            </View>
                            <View
                                style={{
                                    position: 'absolute',
                                    bottom: 40,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <TouchableOpacity
                                    onPress={__takePicture}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: 50,
                                        backgroundColor: '#fff',
                                        alignItems: 'center',
                                        left: '110%',
                                    }}
                                >
                                    <IconButton
                                        icon="camera"
                                        color="#49c1a4"
                                        size={40}
                                        style={{ marginTop: 23, paddingLeft: 3 }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            ) : (
                <View style={{ justifyContent: 'center', padding: 20 }}>
                    <TouchableOpacity
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                            elevation: 5,
                            backgroundColor: '#FFF',
                            padding: 20,

                            alignItems: 'center',
                        }}
                    >
                        <Text style={{}}>Permission Denied</Text>
                    </TouchableOpacity>
                </View>
            )}
            {/* <View
                style={{
                    flex: 0,
                }}
            >
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('Result', {
                            capturedImage: capturedImage,
                        })
                    }
                    style={DiseaseStyle.takePiecture}
                >
                    <Text style={DiseaseStyle.text}>Submit</Text>
                </TouchableOpacity>
            </View> */}
        </View>
    );
};

export default DiseaseScreen;
