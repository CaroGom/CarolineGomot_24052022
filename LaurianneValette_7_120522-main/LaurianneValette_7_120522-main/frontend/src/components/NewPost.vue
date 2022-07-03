<template>
  <div class="newpost">
    <form @submit.prevent>
      <legend @click="togglePost">
        <h2>Nouveau post</h2>
        <span v-if="newPostOpened" class="material-symbols-outlined">close</span>
        <span v-else class="material-symbols-outlined">post_add</span>
      </legend>
      <div v-if="newPostOpened">
        <label for="title_input">Titre</label>
        <textarea type="text" id="title_input" maxlength="50" placeholder="Ajoutez un titre..." v-model="post.title"></textarea>

        <label for="description_input">Description</label>
        <textarea type="text" id="description_input" maxlength="255" placeholder="Ajoutez une description..." v-model="post.description"></textarea>

        <label for="image_input">Image</label>
        <input type="file" id="image_input" accept=".jpg, .jpeg, .png, .apng, .avif, .gif, .svg, .webp" ref="file" @change="fileUpload()">

        <button type="submit" @click="createPost()">Publier</button>
      </div>
    </form>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: 'NewPost',
  data() {
    return {
      newPostOpened: false,
      post: {
        title: '',
        description: '',
        userId: Number,
      },
      file:'',
    }
  },
  emits: ['newPost'],
  methods: {
    togglePost() {
      //Permet de fermer la fenêtre d'édition et réinitialise les informations stockées temporairement dans this.post
      this.newPostOpened = !this.newPostOpened
      this.initializePost()
    },
    initializePost() {
      this.post.title = '';
      this.post.description = '';
      this.file='';
    },
    fileUpload () {
      this.file = this.$refs.file.files[0];
    },
    createPost() {
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
      //Requête pour création du post dans la bdd
      axios({
        method: 'post',
        url: 'http://localhost:3000/api/post',
        headers: headers,
        data: data
      })
          .then(() => {
            this.togglePost()
            this.$emit("newPost")
          })
          .catch(error => console.log(error.message))
      this.initializePost();
    },
  }
}
</script>

<style scoped>

input:first-of-type {
  margin-top: 12px;
}

input:last-of-type {
  margin-top: 12px;
  border-bottom: 0;
}

#description_input, #title_input {
  width: 100%;
  margin-top: 6px;
  padding: 10px;
  border-color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
}

#title_input {
  height: 36px;
  border: none;
}

#description_input {
  height: 96px;
}

#image_input {
  padding-left: 0;
  font-size: 13px;
}

#image_input::file-selector-button {
  border-radius: 0;
  border: 0;
  font-size : 13px;
  background-color: #ffd7d7;
  padding: 10px;
  transition: all 200ms;
  margin-right: 12px;
  width: 140px;
}

#image_input::file-selector-button:hover {
  cursor: pointer;
  background-color: #fd2d01;
  color:white;
  font-weight: bold;
}

@media screen and (min-width: 480px) {

}

</style>