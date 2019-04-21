<template>
  <div class="add-btn bg-transparent border-dashed border-2 rounded-sm text-white mx-5">
    <div
      v-if="add"
      class="py-5 px-8"
    >
      <p class="text-lg text-center">{{ quote }}</p>
      <hr class="my-5 border border-teal-dark border-solid">
      <p class="mb-2">Name</p>
      <input
        v-model="name"
        :placeholder="randomName"
        class="mb-8 rounded-sm p-3 min-w-full"
        type="text"
        name="username" />

      <h4 class="italic mb-4">Add a Movie</h4>
      <p class="mb-2">Movie Title</p>
      <input
        v-model="movieTitle"
        :placeholder="placeholderMovie"
        class="mb-4 rounded-sm p-3 min-w-full"
        type="text"
        name="title" />
      <p class="mb-2">Service</p>
      <input
        v-model="streamingService"
        class="rounded-sm p-3 min-w-full"
        placeholder="Netflix, Hulu, Amazon Prime, etc."
        type="text"
        name="service" />
      <hr class="my-8 border border-teal-dark border-solid">
      <div class="text-white flex flex-row justify-between">
        <button class="flex-1 mr-3 px-3 py-2 bg-transparent border-solid border-white border rounded-sm text-white" type="button" name="button" @click="cancelAdd">Cancel</button>
        <button class="flex-1 px-3 py-2 bg-teal-dark border-teal-dark border rounded-sm text-white" type="button" name="button" @click="submitNewUser">Submit</button>
      </div>
    </div>
    <div v-else class="p-5 text-center cursor-pointer" @click="startAdd">
      <i class="fas fa-plus mr-3"></i> Join the Roulette
    </div>
  </div>

</template>

<script>
import { db } from '../db'
export default {
  name: 'add-user',
  data() {
    return {
      randomNames: [
        "Steve Rogers",
        "Bucky",
        "Monica Everdawg",
        "Bond. James Bond.",
        "I'm the money",
        "Groot",
        "Broken Sword",
        "Gong Er",
        "Lisa",
        "Mark",
        "Gamora",
        "Prince Hapi",
        "John Connor",
        "Sarah Connor",
        "Ellen Ripley",
        "Hannibal Lector",
        "Red Dragon",
        "Heisenberg",
        "Willy Wonka",
        "Jack Burton",
        "Tango or Cash",
        "Samwise the Brave",
        "Gandalf",
        "Celeborn aka Da Bes",
        "Aragorn",
        "Galadriel",
        "Leeloo",
        "Mister Doctor",
        "Sherlock Holmes",
        "Parker with Parker shirt",
        "James 'Logan' Howlett",
        "Jeaaaan!",
        "Charles Xavier",
        "Rick Deckard",
        "Rachel",
        "KD6-3.7",
        "Jack Torrance",
        "Michael Myers",
        "Colonel Kurtz",
        "Roy Batty",
        "Dr. Ian Malcolm",
        "Agent Smith",
        "Mr. Anderson",
        "Morpheus",
        "J Money",
        "Danny Rand",
        "Ethan Hunt",
        "Dom Torreto",
        "The Rock",
        "Alice of Wonderland",
        "Elizabeth Swan",
        "Arwen",
        "Eowyn",
        "Furiosa",
        "Luna Lovegood",
        "Jade Fox",
        "Maria Hill",
        "Switch",
        "Rey...Skywalker?!",
        "Clarice Starling",
        "Talia al Ghul",
        "Mal",
        "Eleanor Rigby",
        "Joi",
        "Natasha Romanov",
        "Kylo Ren",
        "Leia Skywalker",
        "Lisbeth Salander",
        "Hermione Granger",
        "Harry Potter",
        "Ron Weasley",
        "Dolores Umbrigde",
        "Nurse Ratched"
      ],
      randomName: '',
      placeholderMovies: [
        'The Room',
        'Samurai Cop',
        'Demolition Man',
        'The Wicker Man',
        'Blade 3',
        'Austin Powers',
        'Scary Movie',
        'Scary Movie 2',
        'Scary Movie 3',
        'Scary Movie 4',
        'Scary Movie 5',
        'Clown',
        'The Fast and the Furious',
        '2 Fast 2 Furious',
        'Fast 6',
        'Fast 7',
        'Alien: Resurrection',
        'Terminator: Genisys',
        'Three',
        'The Dinner',
        'Expendables 3',
        'Mimic 2',
        'Deep Star Six',
        'Batman vs Superman',
        'The Tag-Along',
        'The Secret of Moonacre',
        'The Trust',
        'Beyond the Gates',
        'Gantz: 0',
        'A Wrinkle in Time'
      ],
      placeholderMovie: '',
      randomQuotes: [
        "Ya like dags?",
        "5 minutes Turkish!",
        "All those moments, lost in time",
        "Cells interlinked",
        "Kansas is going bye-bye",
        "I know kung-fu",
        "I am no man",
        "Mr. Filch, you don't understand",
        "Hogwarts, A History",
        "Hasta la vista, baby",
        "Open the pod bay doors",
        "Life, uh, finds a way",
        "Hello, Clarice",
        "I am Iron Man",
        "I can do this all day",
        "Kaneda, what do you see?!",
        "Is it safe?",
        "I can't explain it",
        "You wanna go home? Find Jason Bourne."
      ],
      quote: '',
      name: '',
      movieTitle: '',
      streamingService: '',
      add: false
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
          title: this.movieTitle,
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
