import React from "react";
import axios from 'axios'


export const PostDisease = async (capturedImage)=>{
    console.log(capturedImage)
    data = await axios.get('https://jsonplaceholder.typicode.com/users')
    // console.log(data)
}
