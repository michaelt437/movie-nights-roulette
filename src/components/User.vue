<template>
  <div class="user-stack flex flex-col mx-5">
    <h3 class="capitalize mb-4  ">{{ user }}</h3>
    <!-- <hr class="border-2 border-pink-dark my-4 min-w-full"> -->
    <div
      v-for="movie in userMoviePool"
      class="user-stack--entry bg-indigo-darker rounded-sm p-5 mb-3">
      <p class="text-xl capitalize mb-3">{{ movie.title }}</p>
      <p class="text-sm capitalize">{{ movie.service }}</p>
    </div>
  </div>
</template>

<script>
import { db } from '../db'
export default {
  name: 'user-stack',
  props: {
    user: {
      type: String
    }
  },
  data() {
    return {
      userMoviePool: []
    }
  },
  created() {
    // db.collection(this.user)
    // .get()
    // .then((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     this.userMoviePool.push(doc.data())
    //   })
    // })
    db.collection(this.user)
    .onSnapshot((querySnapshot) => {
      querySnapshot.forEach(doc => {
        this.userMoviePool.push(doc.data())
      })
    })
  }
}
</script>
