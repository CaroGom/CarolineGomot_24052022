import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import Home from "../../pages/Home";
import Connexion from "../../pages/Connexion";

const index = () => {
    return (
        <div>
           <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/connexion" element={<Connexion/>}/>
            </Routes>
           </Router>
        </div>
    );
};

export default index;