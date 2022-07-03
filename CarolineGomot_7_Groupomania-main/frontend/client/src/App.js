import React, { useEffect, useState, useContext, createContext } from 'react';
import { UidContext } from './components/AppContext';
import Routes from "./components/Routes";

//import axios from "axios";



const App = () => {
    
    const [uid, setUid] = useState(null);

    useContext(() => {
        const fetchToken = async () => {

            await fetch(`${process.env.REACT_APP_API_URL}jwtid`)
                .then(res => res.json())
                .then((res) => {
                console.log(res);
                setUid(res.data);
                })
                
                .catch((err) => console.log(err, "pas de token"))
        }
        fetchToken();
    }, [uid]); 


    return (
        <UidContext.Provider value ={uid}>
       
            <Routes />
        
        </UidContext.Provider>
    );
};

export default App;

/*    const [uid, setUid]= useState(null);

    useEffect( () => {
        const fetchToken = async () => {
            await axios({
                method: "GET",
                url:`${process.env.REACT_APP_API_URL}jwtid`,
                withCredentials: true,
            })
            .then((res) => {
                console.log(res)
                setUid(res.data)})
            .catch((err) => console.log("No token"))
        }
        fetchToken();
    }, [uid])
    */

    /*    const [uid, setUid]= useState(null);

    useEffect( () => {
        const fetchToken = async () => {
            await fetch(`${process.env.REACT_APP_API_URL}jwtid`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                  }
               
            })

        const verifyToken = await fetchToken.json()
            .then((res) => {
                console.log(res)
                setUid(res.data)})
            .catch((err) => console.log("No token"))
        }
        fetchToken();
    }, [uid])
    */