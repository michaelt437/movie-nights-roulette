<template>
  <div class="container">
    <h1 class="text-center">Movie Nights Roulette</h1>
    <div class="flex flex-row items-start justify-center pt-10">
      <User
        v-for="user in usersArr"
        :key="user.name"
        :username="user.name"
        :userPicked.sync="user.pickedTonight"
        :canPick="canPick"
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
  computed: {
    canPick() {
      return this.usersArr.every(user => !user.pickedTonight);
    },
    lastPicker() {
      return this.usersArr.filter(user => user.pickedTonight);
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
    },
    sort(userA, userB) {
      return userA.created < userB.created
    }
  },
  created() {
    let init = new Promise((resolve, reject) => {
      db.collection("users")
      .onSnapshot((query) => {
        query.docChanges().forEach(change => {
          if(change.type === 'added') {
            this.usersArr.push(change.doc.data());
            this.usersArr.sort((userA, userB) => {
              return userA.created - userB.created;
            })
            console.log(this.usersArr);
          }
        })
      })
      resolve('done!')
    });

    init.then((value) => {
      setTimeout(() => {
        if(!this.canPick) {
          if((new this.$moment().valueOf()) > this.$moment(this.lastPicker.pickedDateTime).add(1, 'days').hours(5).valueOf()) {
            db.collection('users')
            .doc(this.lastPicker.name)
            .update({
              pickedDateTime: null
            })
          }else{
            console.log('hello darkness, my old friend...')
          }
        }
      }, 500)
    });
  }
}
</script>
