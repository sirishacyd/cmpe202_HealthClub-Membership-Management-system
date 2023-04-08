import {useEffect, useState} from "react"
import axios from "axios";
export const Logout = () => {
    useEffect(() => {
       (async () => {
         try {
           const {data} = await  
                 axios.delete('http://localhost:8000/logout/',{
                    headers: {'Content-Type': 'application/json',
                    'Authorization' : `token ${localStorage.getItem('token')}`,
                    "Access-Control-Allow-Origin": "*"}}  
                 );
           localStorage.clear();
           axios.defaults.headers.common['Authorization'] = null;
           window.location.href = '/'
           } catch (e) {
             console.log('logout not working', e)
           }
         })();
    }, []);
    return (
       <div></div>
     )
}