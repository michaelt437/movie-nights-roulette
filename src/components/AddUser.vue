<template>
  <div class="add-btn flex flex-col mx-5">
    <div class="mb-4">
      <h3 class="text-center"><i class="fas fa-pizza-slice"></i></h3>
    </div>
    <div class="bg-transparent border-dashed border-2 rounded-sm text-white">
      <div
        v-if="add"
        class="py-5 px-8"
        >
        <h4 class="text-lg text-center italic">{{ quote }}</h4>
        <hr class="my-5 border border-teal-dark border-solid">
        <p class="mb-2">Name</p>
        <input
          v-model="name"
          :placeholder="randomName"
          class="mb-8 rounded-sm p-3 min-w-full"
          type="text"
          name="username" />

        <h4 class="italic text-center mb-4">Add a Movie</h4>
        <p class="mb-2">Movie Title</p>
        <input
          v-model="movieTitle"
          :placeholder="placeholderMovie"
          class="mb-4 rounded-sm p-3 min-w-full"
          type="text"
          name="title" />
        <p class="mb-2">Duration (minutes)</p>
        <input
          v-model="duration"
          placeholder="90"
          class="mb-4 rounded-sm p-3 min-w-full"
          type="text"
          name="duration" />
        <p class="mb-2">Service</p>
        <select class="rounded-sm p-3 min-w-full" name="service" v-model="selectedService">
          <option value="" selected disabled hidden>watchmovies123.com</option>
          <option v-for="(service, i) in streamingService" :value="streamingService[i]">{{ service.name }}</option>
        </select>
        <hr class="my-8 border border-teal-dark border-solid">
        <div class="text-white flex flex-row justify-between">
          <button class="flex-1 mr-3 px-3 py-2 bg-transparent border-solid border-white border rounded-sm text-white" type="button" name="button" @click="cancelAdd">Cancel</button>
          <button
            :class="{'opacity-50 cursor-default' : disableSubmit }"
            :disabled="disableSubmit"
            @click="submitNewUser"
            class="flex-1 px-3 py-2 bg-teal-dark border-teal-dark border rounded-sm text-white" type="button" name="button">
              Submit
            </button>
        </div>
      </div>
      <div v-else class="p-5 text-center hover:text-teal cursor-pointer" @click="startAdd">
        <i class="fas fa-plus-circle mr-1"></i> Join the Roulette
      </div>
    </div>
  </div>

</template>

<script>
import { db } from '../db'
import randoms from '../randoms'
export default {
  name: 'add-user',
  data() {
    return {
      randomNames: randoms.names,
      randomName: '',
      placeholderMovies: randoms.placeholderMovies,
      placeholderMovie: '',
      randomQuotes: randoms.quotes,
      quote: '',
      name: '',
      movieTitle: '',
      duration: '',
      streamingService: randoms.streamingService,
      selectedService: '',
      add: false
    }
  },
  computed: {
    disableSubmit() {
      return this.name == '' || this.movieTitle == '' || this.duration == '' || this.selectedService == ''
    }
  },
  methods: {
    randomizeName() {
      this.randomName = this.randomNames[Math.floor(Math.random() * this.randomNames.length)]
    },
    randomizeMovie() {
      this.placeholderMovie = this.placeholderMovies[Math.floor(Math.random() * this.placeholderMovies.length)]
    },
    randomizeQuote() {
      this.quote = this.randomQuotes[Math.floor(Math.random() * this.randomQuotes.length)]
    },
    startAdd() {
      this.add = true;
      this.randomizeName();
      this.randomizeMovie();
      this.randomizeQuote();
    },
    cancelAdd() {
      this.add = false;
      this.name = '';
      this.movieTitle = '';
      this.duration = '';
      this.selectedService = '';
    },
    submitNewUser() {
      db.collection('users')
      .add({
        name: this.name,
        pickedTonight: false,
        created: Date.parse(new Date())
      })
      .then(() => {
        db.collection(this.name)
        .add({
          title: this.movieTitle,
          service: this.selectedService,
          duration: this.duration,
          watched: false
        });
      })
      .then(() => {
        this.cancelAdd();
      })
    }
  }
}
</script>
