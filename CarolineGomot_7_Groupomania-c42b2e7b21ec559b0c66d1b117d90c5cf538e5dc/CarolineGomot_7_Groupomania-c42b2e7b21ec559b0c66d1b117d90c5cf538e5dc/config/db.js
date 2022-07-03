const mongoose = require('mongoose');


//code to connect file to MongoDB
mongoose.connect('mongodb+srv://GroupomaniaAdmin:FDd4bZkqiNLcbQ7@cluster0.oufuxwn.mongodb.net/Groupomania?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  
  /*require('dotenv').config({path: '/.env'});
GroupomaniaAdmin:FDd4bZkqiNLcbQ7
//code to connect file to MongoDB
mongoose.connect('mongodb+srv://' + process.env.DB_USER_PASS + '@cluster0.oufuxwn.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
*/