<template>
  <main>
    <div class="top">
      <img src="../assets/logo/logo.svg" alt="Logo de Groupomania">
      <p>Le réseau social de notre entreprise.</p>
    </div>

    <h1 v-if="signedUp">Connectez-vous</h1>
    <h1 v-else>Créez un compte</h1>

    <!-- Formulaire de connexion ou création de compte -->
    <form @submit.prevent>

      <label for="email">Email</label>
      <input type="email" id="email" placeholder="Email" @input="emailValidation()" v-model="user.email">
      <p class="validationMsg" :class= "{ unvalid: (isEmailValid === 0) }">{{ emailValidationMsg }}</p>

      <label for="password">Password</label>
      <input type="password" id="password" placeholder= "Mot de passe" @input="passwordValidation()" v-model="user.password">
      <p class="validationMsg" :class= "{ unvalid: (isPasswordValid === 0)}">{{ passwordValidationMsg }}</p>

      <button v-if="signedUp" type="submit" @click="login">Valider</button>
      <button v-else type="submit" @click="signup">Valider</button>

      <p v-if="(loginError&&signedUp)">Aucun compte correspondant ou mot de passe incorrect!<br/>Veuillez vous enregistrer ou réessayer</p>
      <p v-if="(signUpError&&!signedUp)">Un compte existant est déjà associé à cet email.<br/>Veuillez vous connecter ou utiliser un email différent.</p>

    </form>

    <!-- Possibilité de switcher entre connexion et enregistrement -->
    <p class="small" v-if="signedUp">Vous n'avez pas encore de compte?</p>
    <p class="small" v-else>Vous avez déjà un compte?</p>
    <p class="small toggle" v-if="signedUp" @click="signedUp=!signedUp">S'enregistrer.</p>
    <p class="small toggle" v-else @click="signedUp=!signedUp">Se connecter</p>
  </main>
</template>

<script>
import axios from "axios";

export default {
  name: 'StartForm',
  data() {
    return {
      user: {
        email: '',
        password: '',
      },
      emailValidationMsg: '',
      isEmailValid: 0,
      passwordValidationMsg: '',
      isPasswordValid: 0,
      loginError: false,
      signUpError: false,
      signedUp: true,
    }
  },
  emits: ['authentication'],
  methods: {
    login() {
      //Vérification de la complétude des champs
      if (!this.user.email) {
        this.emailValidationMsg = 'Champ requis'
      }
      if (!this.user.password) {
        this.emailValidationMsg = 'Champ requis'
      }
      //Requête login
      if (this.user.password && this.user.email) {
        axios({
          method: 'post',
          url: 'http://localhost:3000/api/auth/login',
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify(this.user),
        })
            .then(response => {
              if (response.status === 200) {
                console.log('Utilisateur connecté.')
                //Sauvegarde du token dans le localStorage
                localStorage.setItem('token', response.data.token)
                //Emission d'un évènement personnalisé récupéré par Home.vue
                this.$emit("authentication")
              }
            })
            .catch(error => {
              this.loginError = true;
              console.log(error.message)
            })
      }
    },
    signup() {
      //Vérification de la complétude des champs
      if (!this.user.email) {
        this.emailValidationMsg = 'Champ requis'
      }
      if (!this.user.password) {
        this.emailValidationMsg = 'Champ requis'
      }
      //Vérification de la validité de l'email et du password
      if (this.isEmailValid === 1 && this.isPasswordValid === 1) {
        //Requête signup
        axios({
          method: 'post',
          url: 'http://localhost:3000/api/auth/signup',
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify(this.user),
        })
            .then(response => {
              if (response.status === 201) {
                console.log('Utilisateur enregistré.')
                this.login()
              }
            })
            .catch(err => {
              this.signUpError = true,
              console.log(err.message)
            })
      }
    },
    emailValidation () {
      //Vérification de la validité de l'email par regex
      this.signUpError = false;
      this.loginError = false;
      if ((!(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/).test(this.user.email)) && this.user.email) {
        this.emailValidationMsg = 'Email invalide.'
        this.isEmailValid = 0
      }
      if(((/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/).test(this.user.email)) && this.user.email) {
        this.emailValidationMsg = ''
        this.isEmailValid = 1
      }
      if(!this.user.email) {
        this.emailValidationMsg = 'Champs requis'
        this.isEmailValid = 0
      }
    },
    passwordValidation () {
      //Vérification de la validité du password par regex
      this.signUpError = false;
      this.loginError = false;
      const pwdRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)([-+!*$@%_\w]{8,15})$/
      if ((!pwdRegex.test(this.user.password)) && this.user.password) {
        this.passwordValidationMsg = 'Le mot de passe doit comporter entre 8 et 15 caractères.Il doit contenir 1 minuscule , 1 majuscule et 1 chiffre.'
        this.isPasswordValid = 0
      }
      if((pwdRegex.test(this.user.password)) && this.user.password) {
        this.passwordValidationMsg = ''
        this.isPasswordValid = 1
      }
      if(!this.user.password) {
        this.passwordValidationMsg = 'Champs requis'
        this.isPasswordValid = 0
      }
    }
  }
}
</script>

<style scoped>

form .unvalid {
  color: orangered;
}

div, p, h1 {
  text-align: center;
}

.top {
  padding: 16px 0 32px 0;
}

.top img {
  max-height: 100px;
}

.validationMsg {
  font-size: 11px;
  text-align: left;
  padding-left: 10px;
  margin-bottom: 18px;
}

.toggle {
  color: #fd2d01;
}

.toggle:hover {
  cursor: pointer;
}

</style>
