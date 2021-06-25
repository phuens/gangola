import { StyleSheet } from "react-native";

const DiseaseStyle = StyleSheet.create({
    imgOuterView:{
        backgroundColor: 'transparent',
        flex: 1,
        width: '80%',
        height: 300,
        top:0
      },
    imgView:{
        flex: 1,
        flexDirection: 'column',
        padding: 15,
        justifyContent: 'flex-end'
      },
    imgBtn:{
        width: 130,
        height: 40,
        alignItems: 'center',
        borderRadius: 4
    },
    imgText:{
        color: '#fff',
        fontSize: 20
    },
    img:{
        flex: 1
    },
    innerMostView:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
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
        alignItems: 'center',
    },
    capture:{
        // position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        padding: 20,
        height: 500,
        justifyContent: 'space-between'
    },
    container: {
        flex: 1,
        position: 'absolute',
        height:300,
        flexDirection: 'row',
        width: 500,
        // padding: 20,
        justifyContent: 'center',
        height:'80%',
        alignItems: 'center'
    },
    camera: {
        flex: 1,
        width: '100%',
        height:600,
        // position:'absolute',
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
})


export default DiseaseStyle