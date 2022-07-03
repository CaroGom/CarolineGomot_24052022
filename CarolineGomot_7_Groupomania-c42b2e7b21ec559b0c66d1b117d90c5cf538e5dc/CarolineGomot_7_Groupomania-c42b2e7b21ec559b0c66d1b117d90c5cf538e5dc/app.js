const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
const dotenv = require("dotenv");
dotenv.config();
require('./config/db');

const {checkUser, requireAuth}= require('./middlewares/authmiddleware')

//setting up routes

const UserRoutes = require('./routes/userroute');
const PostRoutes = require('./routes/postroute');




/*
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });

app.use(cors());
*/
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

module.exports = app;