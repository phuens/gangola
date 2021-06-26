import { StyleSheet } from "react-native";

export const ResultStyle = StyleSheet.create({
    img:{
        height:200,
        width:200,
        flex:1,
        top:10,
        justifyContent:'center',
        alignItems:'center',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#49c1a4',
        bottom:10,
        margin:10,
       
    },
    text:{
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
        marginBottom: 10,
        color:'#000'
      }
})