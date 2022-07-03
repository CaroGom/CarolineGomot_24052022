<template>
  <MainHeader @authentication="authentication"/>
  <main>
    <!-- Créer un nouveau post -->
    <NewPost @newPost="getAllPosts"/>

    <!-- Afficher tous les posts -->
    <div class="post" v-for="post in posts" :key="post.id">
      <div class="post__top">
        <h2>{{ post.title }}</h2>
        <span class="material-symbols-outlined" v-if="isCreator(post.userId)" :data-id="post.id" @click="openPost(post.id)">border_color</span>
      </div>
      <p class="post__date">{{reformattedDate(post.timeDate)}}</p>
      <p class="post__description">{{ post.description }}</p>
      <img class="post__img" v-bind:src="post.imageUrl" v-if="(post.imageUrl)">
      <div class="opinion">
        <p> {{ nbLikes[post.id] }}</p>
        <span class="material-symbols-outlined" :class="{ choice: userLikes[post.id]}" @click="updateLikes(post.id, ilike)">thumb_up</span>
        <span class="material-symbols-outlined" :class="{ choice: userDislikes[post.id]}" @click="updateLikes(post.id, idislike)">thumb_down</span>
        <p>{{ nbDislikes[post.id] }}</p>
      </div>
    </div>

    <!-- Fenêtre d'édition d'un post -->
    <div class="editPost" v-if="editPostOpened">
      <form @submit.prevent>
        <legend>
          <h2>Editer le post</h2>
          <span class="material-symbols-outlined" @click="toggleEditPost()">close</span>
        </legend>
        <label for="title_input">Titre</label>
        <textarea type="text" id="title_input" maxlength="50" placeholder="Ajoutez un titre..." v-model="post.title"></textarea>
        <label for="description_input">Description</label>
        <textarea type="text" id="description_input" maxlength="255" placeholder="Ajoutez une description..." v-model="post.description"></textarea>
        <label for="image_input">Image</label>
        <input type="file" id="image_input" accept=".jpg, .jpeg, .png, .apng, .avif, .gif, .svg, .webp" ref="file" @change="fileUpload()">
        <div>
          <button type="submit" @click="editPost(post.id)">Republier</button>
          ou
          <button type="submit" @click="deletePost(post.id)">Supprimer</button>
        </div>
      </form>
    </div>

    <!-- Post de présentation -->
    <div class="post">
      <div class="post__top">
        <h2>Bienvenue!</h2>
      </div>
      <p class="post__date">Le 7 juin 2022 à 10:20</p>
      <p class="post__description">Bienvenue sur le réseau social interne de Groupomania! Cette plateforme a été créée pour vous! Vous pouvez vous y présenter, partager vos pensées, vous informer sur les dernières actualités de Groupomania.</p>
      <img src="../assets/images/2803207.jpg" class="post__img" alt="Photo du post">
    </div>

  </main>
</template>

<script>
import axios from "axios";
import moment from "moment";
import MainHeader from "@/components/MainHeader";
import NewPost from "@/components/NewPost";

export default {
  name: 'NewsFeed',
  components: {
    MainHeader,
    NewPost,
  },
  data() {
    return {
      posts: [],
      post: {
        title: '',
        description: '',
        userId: Number,
      },
      file:'',
      editPostOpened: false,
      nbLikes: {},
      nbDislikes: {},
      userLikes: {},
      userDislikes: {},
      ilike: 1,
      idislike: -1,
    }
  },
  props: {
    actualUserId: Number,
  },
  emits: ['authentication'],
  methods: {
    toggleEditPost() {
      //Ouverture/fermeture de la fenêtre d'édition
      this.editPostOpened = !this.editPostOpened
    },
    getOnePost(id) {
      //Requête pour récupérer le post à modifier
      axios({
        url: `http://localhost:3000/api/post/${id}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + localStorage.token
        },
      })
          .then(response => {
            this.post = response.data;
          })
          .catch(error => console.log(error.message))
    },
    openPost(id) {
      this.getOnePost(id)
      this.toggleEditPost()
    },
    editPost(id) {
      let post
      let image = this.file
      let data
      let headers
      //Définition du header et des datas à transmettre à l'API selon les cas avec ou sans image
      if (image) {
        post = JSON.stringify(this.post)
        data = { post, image }
        headers = {
          'Content-Type': 'multipart/form-data',
          'Authorization': "Bearer " + localStorage.token
        }
      } else {
        data = {
          title: this.post.title,
          description: this.post.description
        }
        headers = {
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + localStorage.token
        }
      }
      //Requête pour modification du post dans la bdd
      axios({
        method: 'put',
        url: `http://localhost:3000/api/post/${id}`,
        headers: headers,
        data: data
      })
          .then(() => {
            this.toggleEditPost()
            this.getAllPosts()
          })
          .catch(error => console.log(error.message))
      this.initializePost();
    },
    deletePost(id) {
      //Requête suppression du post
      axios({
        method: 'delete',
        url: `http://localhost:3000/api/post/${id}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + localStorage.token
        },
      })
          .then(() => {
            this.toggleEditPost()
            this.getAllPosts()
          })
          .catch(error => console.log(error.message))
    },
    fileUpload () {
      //Récupération du fichier chargé
      this.file = this.$refs.file.files[0];
    },
    initializePost() {
      //Réinitilisation des données temporairement stockées dans this.post
      this.post.title = '';
      this.post.description = '';
      this.file = '';
    },
    reformattedDate(timestamp) {
      //Transformation de la date au format souhaité
      return moment(String(timestamp)).locale('fr').calendar()
    },
    isCreator(id) {
      //Vérification de l'appartenance d'un post à l'utilisateur actuel
      return (this.actualUserId === id || this.actualUserId === 1);
    },
    updateLikes(postId, value) {
      axios({
        method: 'post',
        url: `http://localhost:3000/api/like/${postId}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + localStorage.token
        },
        data : { value: value }
      })
          .then(() => {
            this.getLikes(postId)
            this.getDislikes(postId)
          })
          .catch(error => console.log(error.message))
    },
    getLikes(id) {
      //Requête pour récupérer les likes
      axios({
        url: `http://localhost:3000/api/like/${id}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + localStorage.token
        },
      })
          .then ( res => {
            this.nbLikes[id] = res.data.count
            let rows = res.data.rows
            this.userLikes[id] = rows.some(like => like.userId === this.actualUserId)
            return (this.nbLikes)
          })
          .catch(error => console.log(error.message))
    },
    getDislikes(id) {
      //Requête pour récupérer les dislikes
      axios({
        url: `http://localhost:3000/api/like/d/${id}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + localStorage.token
        },
      })
          .then ( res => {
            this.nbDislikes[id] = res.data.count
            let rows = res.data.rows
            this.userDislikes[id] = rows.some(dislike => dislike.userId === this.actualUserId)
            return (this.nbDislikes)
          })
          .catch(error => console.log(error.message))
    },
    getAllPosts () {
      //Requête pour récupérer tous les posts et les afficher
      axios({
        url: 'http://localhost:3000/api/post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + localStorage.token
        },
      })
          .then(res => {
            this.posts = res.data
            for (let p in this.posts) {
              this.getLikes(this.posts[p].id)
              this.getDislikes(this.posts[p].id)
            }
          })
          .catch(error => console.log(error.message))
    },
    authentication() {
      //Emission d'un évènement personnalisé permettant de détecter la déconnexion de l'utilisation depuis Home.vue
      this.$emit("authentication")
    }
  },
  mounted() {
    this.getAllPosts()
  }
}
</script>

<style scoped>

</style>
