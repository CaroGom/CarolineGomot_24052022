import React, { useState } from "react";
import axios from 'axios';
    



const SignInForm = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const handleLogin = async (e) => {
    e.preventDefault();
    const emailError = document.querySelector(".email.error");
    const passwordError = document.querySelector(".password.error");

    //GET requests test, returns arrays of stuff
    const user = await fetch("http://localhost:3000/api/auth/");
    const post = await fetch("http://localhost:3000/api/post/");

    console.log(await user.json());
    console.log(await post.json());

    //POST request fetch

    const response = await fetch("http://localhost:3000/api/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
      
    }
    
    );

    
    console.log(response);
    //console.log(await response.json());
    const userLogInfo = await response.json();
    if (userLogInfo.errors) {
        emailError.innerHTML = userLogInfo.errors.email;
        passwordError.innerHTML = userLogInfo.errors.password;
    } else {
        window.location = '/';
    }

    console.log(userLogInfo);

    
  };




    return (
        <form action="" onSubmit={handleLogin} id="sign-in-form">
            <label htmlFor="email">Email</label>
            <br/>
            <input 
            type="text" 
            name="email" 
            id="email" 
            onChange={(e) => setEmail(e.target.value)}
            value={email}/>
            <br/>
            <div className="email error"></div>
            <label htmlFor="password">Mot de passe</label>
            <br/>
            <input 
            type="password" 
            name="password" 
            id="password" 
            onChange={(e) => setPassword(e.target.value)}
            value={password}/>
            <br/>
            <div className="password error"></div>
            <br/>
            <input type = "submit" value="Se connecter"/>
        </form>
    )
}


export default SignInForm;

/*const handleLogin = (e) => {

    e.preventDefault();
    const emailError = document.querySelector(".email.error");
    const passwordError = document.querySelector(".password.error");
    axios({
        method: "POST",
        url: `${process.env.REACT_APP_API_URL}api/auth/login`,
        withCredentials: true, 
        headers:{
            "Access-Control-Allow-Origin":"http://localhost:3001"
        },
        data : {
            email, 
            password,
        }
    })
    .then ((res) => {
        console.log(res);
        if (res.data.errors) {
            emailError.innerHTML = res.data.errors.email;
            passwordError.innerHTML = res.data.errors.password;
        } else {
            window.location = '/';
        }
    })
    .catch((err) => {
        console.log(err);
    });

}*/

/*
const handleLogin = async (e) => {
    e.preventDefault();
    const emailError = document.querySelector(".email.error");
    const passwordError = document.querySelector(".password.error");

    const user = await fetch("http://localhost:3000/api/auth/");
    const post = await fetch("http://localhost:3000/api/post/");

    console.log(await user.json());
    console.log(await post.json());

    const response = await fetch("http://localhost:3000/api/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
      
    });

    
    console.log(response);
    console.log(await response.json());

    
  };*/