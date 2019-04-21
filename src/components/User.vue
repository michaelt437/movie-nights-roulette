<template>
  <div class="user-stack flex flex-col mx-5">
    <div class="user-stack--raffle bg-indigo-darker rounded-sm p-5 mb-3 text-center">

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
    db.collection(this.user)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.userMoviePool = doc.data()
      })
    })
  }
}
</script>
