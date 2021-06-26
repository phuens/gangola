import React, { useEffect, useState } from 'react';
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

    const Pitcure = () => {
        return (
            <React.Fragment>
                <Camera style={DiseaseStyle.camera} type={type} ref={(r) => (camera = r)}>
                    <View style={DiseaseStyle.capture}></View>
                </Camera>
                <View style={DiseaseStyle.innerCapature}>
                    <TouchableOpacity
                        onPress={__takePicture}
                        style={DiseaseStyle.takePiectureBtn}
                    />
                </View>
            </React.Fragment>
        );
    };

    const CameraPreview = ({ photo, retakePicture, savePhoto }) => {
        return (
            <View style={DiseaseStyle.imgOuterView}>
                <ImageBackground source={{ uri: photo && photo.uri }} style={DiseaseStyle.img}>
                    <View style={DiseaseStyle.imgView}>
                        <View style={DiseaseStyle.innerMostView}>
                            <TouchableOpacity onPress={retakePicture} style={DiseaseStyle.imgBtn}>
                                <Text style={DiseaseStyle.imgText}>Re-take</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={savePhoto} style={DiseaseStyle.imgBtn}>
                                <Text style={DiseaseStyle.imgText}>save photo</Text>
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
    return (
        <View style={DiseaseStyle.container}>
            {hasPermission ? (
                <View>
                    {capturedImage && previewVisible ? (
                        <CameraPreview
                            photo={capturedImage}
                            savePhoto={__savePhoto}
                            retakePicture={__retakePicture}
                        />
                    ) : (
                        <Pitcure />
                    )}
                </View>
            ) : (
                <View>
                    <TouchableOpacity onPress={__startCamera} style={DiseaseStyle.takePiecture}>
                        <Text style={DiseaseStyle.text}>Take picture</Text>
                    </TouchableOpacity>
                </View>
            )}
            <View
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
            </View>
        </View>
    );
};

export default DiseaseScreen;
