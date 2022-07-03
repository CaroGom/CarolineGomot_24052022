# Groupomania
Repository GitHub : https://github.com/Llaurianne/LaurianneValette_7_120522.git
***
## Parcours Développeur web d'OpenClassrooms
Projet n°7 : Création d'un réseau social d'entreprise. 

Compétences évaluées :
- Authentifier un utilisateur et maintenir sa session. 
- Implémenter un stockage de données sécurisé en utilisant une base de données.  
- Développer l’interface d’un site web grâce à un framework front-end.  
***
## Spécifications fonctionnelles
Connexion :
   * Connexion ou création d'un compte par email et mot de passe
   * Possibilité ensuite de déconnexion
   * Persistance de la session tant que l'utilisateur est connecté


Page d'accueil :
  * Liste des posts de tous les utilisateurs par ordre antéchronologique
  * Possibilité de créer un post avec du texte avec/sans image
  * Possibilité pour l'utilisateur de modifier et supprimer ses posts
  * Possibilité de liker les post (1 like/ post / utilisateur)
  * Un utilisateur sera administrateur et pourra modifier et suppirmer tous les posts
***
## Spécificités techniques
Frontend :
* Responsive sur mobile, tablettes et desktop.  
* Utilisation de JavaScript.  
* Respect des standards du WCAG.  
* Utilisation d'un framework frontend JavaScript : Vue 3.

Backend :
* Base de donnée relationnelle MySQL.
* Utilisation de l'ORM Sequelize.
* Serveur: runtime Node.js et framework Express
***
## Identité graphique
Police d’écriture : Lato.

Couleurs :
* Primaire : #FD2D01
* Secondaire : #FFD7D7
* Tertiaire : #4E5166
***
## Pour commencer
### Frontend
http://localhost:8080/
```
cd frontend
npm install 
npm run serve
```

### Backend
Assurez-vous d'avoir Node.js et MySQL installés sur votre machine.

http://localhost:3000/
```
cd backend
npm install
nodemon server
```

### Database
La base de données groupomaniadb est fournie en annexe. 
Sinon, il est aussi possible de créer une bdd vide nommée groupomaniadb, les tables seront alors créées automatiquement.
```
mysql -u root -p
Enter password: ####
```
Utiliser votre mot de passe à la place de '####' et le modifier dans backend/database/db.js

***
## Compte administrateur
Le premier utilisateur créé sera automatiquement désigné administrateur.