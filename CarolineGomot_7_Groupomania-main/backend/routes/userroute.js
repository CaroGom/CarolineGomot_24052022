const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/usercontroller.js');
const cors = require('cors');


//routes POST signup and login
router.post("/signup", cors(), userCtrl.signup);
app.post('/login', cors(), (req, res) => {
    console.log(req.body);
    res.cookie("jwt", '1234', {httpOnly: true, maxAge: 3*24*60*60*1000});
    res.status(200).send({ user: 'abc' });
  }, userCtrl.signIn)

//route GET logout
router.get("/logout", cors(), userCtrl.logout);

//routes GET users overview
router.get("/", cors(), userCtrl.getAllUsers);
router.get("/:id", cors(), userCtrl.userInfo);
router.delete("/:id", cors(), userCtrl.deleteUser);

module.exports = router;