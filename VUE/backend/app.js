
const express = require("express");
const path = require("path");


require("./config/db");



//setting up routes

const UserRoutes = require("./routes/userRoute");
const PostRoutes = require("./routes/postRoute");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //Accès à l'API depuis toutes les origines *
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //Ajout de headers mentionnés aux requêtes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //Définition des méthodes autorisées
    next();
});

//setting up POST routes


//img management
app.use("/images", express.static(path.join(__dirname, "images")));

//calling routes
app.use("/api/auth", UserRoutes);
app.use("/api/post", PostRoutes);

module.exports = app;

/*

const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
const dotenv = require("dotenv");
dotenv.config();
require('./config/db');
const cors = require('cors');

const {checkUser, requireAuth}= require('./middlewares/authmiddleware')

//setting up routes

const UserRoutes = require('./routes/userroute');
const PostRoutes = require('./routes/postroute');


const app = express();


app.use(cookieParser());

app.get("/", (req, res) => res.send("hello"));

//jwt
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id);
})

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    'preflightContinue': false
};



app.use(cors(corsOptions));

//setting up POST routes

app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(cookieParser());

//jwt
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id);
})

//img management
app.use('/images', express.static(path.join(__dirname, 'images')));

//calling routes
app.use ('/api/auth', UserRoutes);
app.use ('/api/post', PostRoutes);

module.exports = app;*/