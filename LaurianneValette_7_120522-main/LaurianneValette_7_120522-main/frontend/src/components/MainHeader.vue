<template>
  <div class="header_container">
    <header>
      <img src="../assets/logo/logo-left.svg" alt="Logo de Groupomania">
      <nav>
        <ul>
          <li @click="deconnexion()">
            <span class="material-symbols-outlined">logout</span>
            <p>Déconnexion</p>
          </li>
        </ul>
      </nav>
      <p class="profile_pic">
        <img src="../../../backend/images/profile/user.png"/>
      </p>
    </header>
  </div>
</template>

<script>
export default {
  name: 'MainHeader',
  data() {
    return {

    }
  },
  emits: ['authentication'],
  methods: {
    deconnexion() {
      //Efface le token contenu dans localStorage et émet un évènement vers NewsFeed.vue permettant de détecter la deconnexion
      localStorage.clear()
      this.$emit('authentication')
    },
  },
}
</script>

<style scoped>

nav {
  flex: 1;
}

.header_container {
  position: fixed;
  background-color: white;
  width: 100%;
  box-shadow: 0 3px 20px 0 #a1a1a1;
  bottom:0;
}

header {
  height: 70px;
  display: flex;
  max-width: 500px;
  margin: auto;
}

header img {
  width: 120px;
  align-self: center;
  margin: 0 24px;
}

header ul {
  list-style: none;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: right;
  padding-right: 24px;
}

header li {
  display: inline-block;
  text-align: center;
  padding-top: 25px;
  width: 25%;
  font-size: 12px;
}

header li:hover {
  cursor: pointer;
  color: #fd2d01;
}

header li p {
  display: none;
}

.profile_pic {
  padding-right: 24px;
  width: 214px;
  text-align: center;
  display: none;
}

.profile_pic img {
  margin: 15px 0;
  height: 50px;
  width: 50px;
}

@media screen and (min-width: 768px){
  .header_container {
    top:0;
    bottom: inherit;
  }

  header {
    max-width: 928px;
  }

  header li {
    font-size: 14px;
    padding-top: 16px;
    width: 30%;
  }

  header ul {
    justify-content: space-evenly;
    padding: 0;
  }

  header img {
    width: 166px;
    margin: 0 24px;
  }

  .profile_pic {
    display: block;
  }

}

@media screen and (min-width: 480px) {

  header {
    height: 80px;
  }

  header li {
    padding-top: 20px;
  }

  header li p, header li a {
    display: block;
  }

  header ul {
    justify-content: center;
  }

}

</style>