<template>
  <div class="container">
    <div class="flex flex-row justify-between items-center">
      <div class="flex flex-1">

      </div>
      <div class="flex flex-1 justify-center">
        <h1 class="text-center text-4xl font-bold">Movie Nights Roulette</h1>
      </div>
      <div class="flex flex-1 justify-end items-center">
        <a v-if="!signedIn" href="#" @click.prevent="login" class="text-white hover:text-teal-500 no-underline">Join the Roulette</a>
        <button
        @click="userAuth"
        :class="signedIn ? 'bg-pink-600 hover:bg-pink-700' : 'bg-teal-500 hover:bg-teal-600'"
        class="text-white px-3 py-2 rounded-sm ml-5"
        type="button"
        name="button">
          {{ signedIn ? 'Log Out' : 'Log In'}}
        </button>
      </div>
    </div>
    <div class="flex flex-row flex-wrap items-start justify-center pt-10">
      <template v-if="!signedIn || signedIn && userExists">
        <User
        v-for="user in usersArr"
        :key="user.name"
        :username="user.name"
        :userPicked.sync="user.pickedTonight"
        :userPickedDateTime="user.pickedDateTime"
        :canPick="canPick"
        :signedIn="signedIn"
        :authorizeActions="user.email == userEmail"
        :reRolls.sync="user.reRolls"
        ></User>
      </template>
      <AddUser v-if="signedIn && !userExists"></AddUser>
    </div>
  </div>
</template>

<script>
import { db, auth, fb, testingKey } from '../db'
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
      usersArr: [],
      signedIn: false,
      userEmail: ''
    }
  },
  computed: {
    canPick() {
      return this.usersArr.every(user => !user.pickedTonight);
    },
    lastPicker() {
      return this.usersArr.find(user => user.pickedTonight);
    },
    userExists() {
      return this.usersArr.find(user => user.email == this.userEmail)
    }
  },
  methods: {
    userAuth() {
      if(this.signedIn) {
        this.signOut();
      }else{
        let provider = new auth.GoogleAuthProvider();
        fb.auth().signInWithRedirect(provider)
        .then((result) => {

        })
        .catch((error) => {
          console.log('auth error: ', error)
        })
      }
    },
    signOut() {
      fb.auth().signOut()
      .then(result => {
        console.log('signout')
        window.alert("See ya later alligator")
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
          }
        })
      })
      resolve('done!')
    });

    init.then((value) => {
      setTimeout(() => {
        if(!this.canPick){
          if((new this.$moment().valueOf()) > this.$moment(this.lastPicker.pickedDateTime).add(1, 'days').hours(10).valueOf()) {
            db.collection('users')
            .doc(this.lastPicker.name)
            .update({
              pickedTonight: false,
            })
          }else{
            console.log('hello darkness, my old friend...')
          }
        }
        this.usersArr.forEach(user => {
          if(user.reRolls < 4){
            db.collection('users')
            .doc(user.name)
            .update({
              reRolls: 4
            })
          }
        })
      }, 2000)
    });

    fb.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.signedIn = true;
        this.userEmail = user.email;
      } else {
        // No user is signed in.
        this.signedIn = false;
      }
    });

  }
}
</script>
