<template>
  <div class="add-btn bg-transparent border-dashed border-2 rounded-sm text-white mx-5">
    <div
      v-if="add"
      class="py-5 px-8"
    >
      <h3 class="text-center">New User</h3>
      <hr class="my-5 border border-teal-dark border-solid">
      <p class="mb-2">Name</p>
      <input
      v-model="name"
        class="mb-8 rounded-sm p-3 min-w-full"
        placeholder="Enter your name"
        type="text"
        name="username" />

      <h4 class="italic mb-4">Add a Movie</h4>
      <p class="mb-2">Movie Title</p>
      <input
        v-model="initPick"
        class="mb-4 rounded-sm p-3 min-w-full"
        placeholder="Movie Title"
        type="text"
        name="username" />
      <p class="mb-2">Service</p>
      <input
        v-model="streamingService"
        class="rounded-sm p-3 min-w-full"
        placeholder="Netflix, Hulu, Amazon Prime, etc."
        type="text"
        name="username" />
      <hr class="my-8 border border-teal-dark border-solid">
      <div class="text-white flex flex-row justify-between">
        <button class="flex-1 mr-3 px-3 py-2 bg-transparent border-solid border-white border rounded-sm text-white" type="button" name="button" @click="cancelAdd">Cancel</button>
        <button class="flex-1 px-3 py-2 bg-teal-dark border-teal-dark border rounded-sm text-white" type="button" name="button" @click="submitNewUser">Submit</button>
      </div>
    </div>
    <div v-else class="p-5 text-center cursor-pointer" @click="add = true">
      <i class="fas fa-plus mr-3"></i> Add a user
    </div>
  </div>

</template>

<script>
import { db } from '../db'
export default {
  name: 'add-user',
  data() {
    return {
      name: '',
      initPick: '',
      streamingService: '',
      add: false
    }
  },
  methods: {
    cancelAdd() {
      this.add = false;
      this.name = '';
      this.initPick = '';
    },
    submitNewUser() {
      db.collection('users')
      .doc('names')
      .update({
        [this.name]: this.name,
      })
      .then(function() {
        console.log("Document successfully updated!");
      })
      .catch((error) => {
          // The document probably doesn't exist.
          db.collection('users')
          .doc("names")
          .set({
            [this.name]: this.name
          })
      })
      .then(() => {
        console.log('new user added!')
        db.collection(this.name)
        .add({
          movie: this.initPick,
          service: this.streamingService,
          watched: false
        })
        .then(function() {
          console.log('new collection created!')
        })
      })
      .then(() => {
        this.cancelAdd();
      })
    }
  }
}
</script>
