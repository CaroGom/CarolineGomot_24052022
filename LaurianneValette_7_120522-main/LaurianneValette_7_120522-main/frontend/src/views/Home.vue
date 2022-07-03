<template>
  <NewsFeed @authentication='authentication()' :actualUserId="actualUserId" v-if="isAuthenticated"/>
  <StartForm @authentication='authentication()' v-else/>
</template>

<script>

import StartForm from '../components/StartForm'
import NewsFeed from '../components/NewsFeed'
import axios from "axios";

export default {
  name: 'HomeView',
  components: {
    StartForm,
    NewsFeed,
  },
  data() {
    return {
      isAuthenticated: false,
      actualUserId: 0,
    }
  },
  methods: {
    authentication() {
      //Vérification de l'existence d'un token dans le localStorage
      if (localStorage.length === 0) {
        console.log('Utilisateur non authentifié.')
        this.isAuthenticated = false
        //Requête permettant de vérifier la validité du token s'il existe
      } else {
        axios({
          method: 'post',
          url: 'http://localhost:3000/api/auth/authentication',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.token
          },
        })
            .then(res => {
              this.isAuthenticated = true;
              this.actualUserId = res.data.userId;
            })
            .catch(() => {
              console.log('Unvalid token')
              this.isAuthenticated = false
            })
      }
    }
  },
  mounted() {
    this.authentication()
  }
}
</script>

<style scoped>

</style>
