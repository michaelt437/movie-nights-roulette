<template>
  <div class="user-stack flex flex-col mx-5">
    <div class="flex justify-between items-center mb-4">
      <h3 class="capitalize">{{ username }} ({{ pickPool.length }})</h3>
      <p class="text-sm cursor-pointer hover:text-teal" @click="addMode ? cancelAddPick() : startAddPick()">
        <i class="fas mr-1" :class="addMode ? 'fa-times' : 'fa-plus-circle'"></i> {{ addMode ? '' : 'Add a pick'}}
      </p>
    </div>
    <template v-if="addMode">
      <div class="border-dashed border-2 rounded-sm text-white py-5 px-8">
        <h4 class="text-lg text-center italic">Add a Pick</h4>
        <hr class="my-5 border border-teal-dark border-solid">
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
        <hr class="my-5 border border-teal-dark border-solid">
        <div class="text-white flex flex-row justify-between">
          <button class="flex-1 mr-3 px-3 py-2 bg-transparent border-solid border-white border rounded-sm text-white" type="button" name="button" @click="cancelAddPick">Back</button>
          <button
            :class="{'opacity-50 cursor-default' : disableAddPick }"
            :disabled="disableAddPick"
            @click="addPickToPool"
            class="flex-1 px-3 py-2 bg-teal-dark border-teal-dark border rounded-sm text-white" type="button" name="button">
              Add
            </button>
        </div>
      </div>
    </template>
    <template v-else>
      <template v-if="pendingPick">
        <div
          key="thePicked"
          class="user-stack--entry bg-indigo-darker rounded-sm px-5 py-3 mb-1 border-2 border-transparent">
          <p class="text-xl capitalize" :title="pendingSelectedMovie.title">{{ pendingSelectedMovie.title }}</p>
          <p class="capitalize my-3" :class="pendingSelectedMovie.service.value">{{ pendingSelectedMovie.service.name }}</p>
          <p class="text-xs">{{ pendingSelectedMovie.duration }} minutes</p>
        </div>
        <div class="mb-3 flex justify-end">
          <button v-if="allUserMovies.length > 1" class="text-sm bg-transparent mr-1 rounded-full text-white p-2" type="button" name="button" @click="makeRandomPick"><i class="fas fa-dice"></i></button>
          <button class="text-sm bg-transparent rounded-full text-white p-2" type="button" name="button" @click="cancelMakePick"><i class="fas fa-times"></i></button>
          <button class="text-sm bg-transparent rounded-full text-teal p-2" type="button" name="button" @click="confirmPick"><i class="fas fa-check"></i></button>
        </div>
      </template>
      <div
        v-else
        key="ticket"
        :disable="!canPick"
        @click="makeRandomPick"
        :class="pickableState"
        class="user-stack--make-pick bg-indigo text-center rounded-sm p-5 mb-3 border-2 border-transparent">
        <span class="flex justify-between">
          <i class="fas" :class="canPick ? 'fa-star' : 'fa-long-arrow-alt-down'"></i>
          {{canPick ? "What's the pick?" : "Tonight's Pick"}}
          <i class="fas" :class="canPick ? 'fa-star' : 'fa-long-arrow-alt-down'"></i></span>
      </div>
      <div
        v-for="movie in picks"
        class="user-stack--entry bg-indigo-darker rounded-sm px-5 py-3 mb-3 border-2 border-transparent">
        <p class="text-xl capitalize" :title="movie.title">{{ movie.title }}</p>
        <p class="capitalize my-3" :class="movie.service.value">{{ movie.service.name }}</p>
        <div class="flex justify-between">
          <p class="text-xs">{{ movie.duration }} minutes</p>
          <p class="text-xs">{{ $moment(movie.watchDate).format('MMM D, YYYY') }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { db } from '../db'
import randoms from '../randoms'
export default {
  name: 'user-stack',
  props: {
    username: {
      type: String
    },
    canPick: {
      type: Boolean
    },
    userPicked: {
      type: Boolean
    }
  },
  data() {
    return {
      allUserMovies: [],
      addMode: false,
      pendingPick: false,
      placeholderMovies: randoms.placeholderMovies,
      streamingService: randoms.streamingService,
      movieTitle: '',
      placeholderMovie: '',
      duration: '',
      selectedService: '',
      prevRandomSelection: '',
      randomSelection: '',
      enablePickBtn: 'cursor-pointer',
      disablePickBtn: 'opacity-50 cursor-default',
      selectorsChoice: 'cursor-default text-yellow'
    }
  },
  computed: {
    picks() {
      return this.allUserMovies.filter(pick => pick.watched)
    },
    pickPool() {
      return this.allUserMovies.filter(pick => !pick.watched)
    },
    disableAddPick() {
      return this.movieTitle == '' || this.duration == '' || this.selectedService == '';
    },
    pendingSelectedMovie() {
      return this.allUserMovies[this.randomSelection] || null;
    },
    pickableState() {
      return this.canPick ? this.enablePickBtn :
        this.userPicked ? this.selectorsChoice : this.disablePickBtn
    }
  },
  methods: {
    startAddPick() {
      this.addMode = true;
      this.randomizeMovie();
    },
    cancelAddPick() {
      this.addMode = false;
      this.movieTitle = '';
      this.duration = '';
      this.selectedService = '';
    },
    addPickToPool() {
      db.collection(this.username)
      .doc(this.movieTitle)
      .set({
        title: this.movieTitle,
        duration: this.duration,
        service: this.selectedService,
        watched: false
      })
      .then(() => {
        this.movieTitle = '';
        this.duration = '';
        this.selectedService = '';
      })
    },
    makeRandomPick() {
      if(this.canPick) {
        this.pendingPick = true;
        this.prevRandomSelection = this.randomSelection;
        let temp = Math.floor(Math.random() * this.allUserMovies.length);
        while(temp === this.prevRandomSelection) {
          temp = Math.floor(Math.random() * this.allUserMovies.length);
        }
        this.randomSelection = temp;
        console.log(this.randomSelection)
      }
    },
    randomizeMovie() {
      this.placeholderMovie = this.placeholderMovies[Math.floor(Math.random() * this.placeholderMovies.length)]
    },
    cancelMakePick() {
      this.pendingPick = false;
      this.randomSelection = '';
    },
    confirmPick() {
      db.collection('users')
      .doc(this.username)
      .update({
        pickedTonight: true,
        pickedDateTime: Date.parse(new Date())
      })
      .then(() => {
        this.$emit('update:userPicked', true)
        db.collection(this.username)
        .doc(this.pendingSelectedMovie.title)
        .update({
          watched: true,
          watchDate: Date.parse(new Date())
        })
      })
    }
  },
  created() {
    db.collection(this.username)
    .onSnapshot({ includeMetadataChanges: true }, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if(change.type === 'added') {
          this.allUserMovies.push(change.doc.data())
        }
        if(change.type === 'modified') {
          console.log('this doc has changed ', change.doc.data())
        }
      })
    })
  }
}
</script>
