<template>
  <div class="container">
    <h1 class="text-center">Movie Nights Roulette</h1>
    <div class="flex flex-row justify-center pt-10">
      <User
        v-for="user in usersArr"
        :key="user"
        :user="user"
        ></User>
      <AddUser></AddUser>
    </div>
  </div>
</template>

<script>
import { db } from '../db'
import AddUser from './AddUser'
import User from './User'
export default {
  name: 'MainPage',
  components: {
    AddUser,
    User
  },
  data() {
    return {
      usersArr: []
    }
  },
  methods: {
    pullDb() {
      db.collection(this.collection)
      .get()
      .then(querySnapshot => {
        let data = []
        querySnapshot.forEach(doc => {
          data.push(doc.data())
        })
        this.document = data
      });
    }
  },
  created() {
    db.collection("users").doc("names")
    .onSnapshot((doc) => {
        if(doc.data()) this.usersArr = Object.values(doc.data())
        console.log(this.usersArr)
    })
  }
}
</script>
