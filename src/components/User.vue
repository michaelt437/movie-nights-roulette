<template>
  <div class="user-stack flex flex-col mx-5 mb-10">
    <div class="flex justify-between items-center mb-3">
      <h3 v-if="!displayPickPool" class="font-bold capitalize">{{ username }}
        <template v-if="signedIn">
          <template v-if="authorizeActions && !addMode">
            - <a href="#" @click.prevent="showPickPool" class="cursor-pointer text-teal-500 no-underline">{{ pickPool.length }}</a>
          </template>
          <template v-else>
            - {{pickPool.length}}
          </template>
        </template>
      </h3>
      <h3 v-else @click="hidePickPool" class="hover:text-teal-500 cursor-pointer">
        <i class="fas fa-arrow-left text-sm"></i> Back
      </h3>
      <p v-if="signedIn && authorizeActions" class="text-sm cursor-pointer hover:text-teal-500" @click="addMode ? cancelAddPick() : startAddPick()">
        <i class="fas mr-1" :class="addMode ? 'fa-times' : 'fa-plus-circle'"></i> {{ addMode ? '' : 'Add a pick'}}
      </p>
    </div>
    <div v-if="signedIn && !displayPickPool && !addMode && canPick" class="flex align-center mb-3 relative flex-wrap">
      <hr class="border-t border-solid border-gray-600 mb-4 w-full">
      <div class="relative mr-4">
        <button type="button" name="button" class="text-white text-sm" :class="'hover:text-teal-500'" @click.stop="openPickFromServiceMenu()">
          Pick from: <span class="text-teal-500">{{ pickFromService == '' ? 'All' : pickFromService }}</span></span> <i class="fas fa-caret-down ml-1"></i>
        </button>
        <ul
          v-show="pickFromServiceMenuIsOpen"
          class="list-reset bg-white rounded-sm absolute left-0 py-1 mt-2 w-32 z-10">
          <li v-if="pickFromService != ''" class="text-black py-2 px-3 cursor-pointer hover:bg-gray-300" @click="setPickFromService('')">All</li>
          <li v-for="service in availableService" class="text-black py-2 px-3 cursor-pointer hover:bg-gray-300" @click="setPickFromService(service)">{{ service }}</li>
        </ul>
      </div>
      <div class="relative">
        <button type="button" name="button" class="text-white text-sm" :class="'hover:text-teal-500'" @click.stop="openPickLengthMenu()">
          Length: <span class="text-teal-500 capitalize">{{ pickFromPool.name }}</span></span> <i class="fas fa-caret-down ml-1"></i>
        </button>
        <ul
          v-show="pickFromPoolMenuIsOpen"
          class="list-reset bg-white rounded-sm absolute left-0 py-1 mt-2 w-32 z-10">
          <li v-for="pool in filteredPoolOptions" class="text-black py-2 px-3 cursor-pointer hover:bg-gray-300 capitalize" @click="setPickFromLength(pool)">{{ pool.name }}</li>
        </ul>
      </div>
    </div>
    <template v-if="addMode">
      <div class="border-dashed border-2 rounded-sm py-5 px-8 relative" :class="{'addSuccess' : success}">
        <h4 class="text-lg text-center italic">Add a Pick</h4>
        <hr class="my-5 border border-teal-600 border-solid">
        <p class="mb-2">Movie Title <span v-if="duplicate" class="text-red-600 italic">- already exists</span></p>
        <input
          v-model="movieTitle"
          :placeholder="placeholderMovie"
          class="mb-4 rounded-sm p-3 min-w-full text-gray-700"
          type="text"
          name="title" />
        <p class="mb-2">Duration (minutes)</p>
        <input
          v-model="duration"
          placeholder="90"
          class="mb-4 rounded-sm p-3 min-w-full text-gray-700"
          type="text"
          name="duration" />
        <p class="mb-2">Service</p>
        <select class="rounded-sm p-3 min-w-full text-gray-700" name="service" v-model="selectedService">
          <option value="" selected disabled hidden>watchmovies123.com</option>
          <option v-for="(service, i) in streamingService" :value="streamingService[i]">{{ service.name }}</option>
        </select>
        <hr class="my-5 border border-teal-600 border-solid">
        <div class="text-white flex flex-row justify-between">
          <button class="flex-1 mr-3 px-3 py-2 bg-transparent border-solid border-white hover:border-teal-500 hover:text-teal-500 border rounded-sm text-white" type="button" name="button" @click="cancelAddPick">Back</button>
          <button
            @click="addPickToPool"
            :class="disableAddPick ? 'opacity-50 cursor-default' : 'hover:border-teal-700 hover:bg-teal-700'"
            class="flex-1 px-3 py-2 bg-teal-600 border-teal-600 border rounded-sm text-white" type="button" name="button">
              Add
            </button>
        </div>
      </div>
    </template>
    <template v-else>
      <template v-if="signedIn && !displayPickPool">
        <template v-if="pendingPick">
          <div
            key="thePicked"
            :class="{'animate-select' : selectConfirm, 'mb-3' : hidePickActions }"
            class="user-stack--entry bg-gray-800 rounded-r-sm  px-5 py-3">
            <p class="text-xl capitalize" :title="pendingSelectedMovie.title">{{ pendingSelectedMovie.title }}</p>
            <p class="capitalize my-3" :class="pendingSelectedMovie.service.value">{{ pendingSelectedMovie.service.name }}</p>
            <div class="flex justify-between">
              <p class="text-xs">{{ pendingSelectedMovie.duration }} minutes</p>
              <p v-if="userPicked" class="text-xs">{{ $moment(pendingSelectedMovie.watchDate).format('MMM D, YYYY') }}</p>
            </div>
          </div>
          <div class="mb-3 flex items-center justify-end" v-show="!hidePickActions">
            <button v-if="allUserMovies.length > 1 && reRolls > 0" class="text-sm bg-transparent rounded-full p-2" :class="reRollColor" title="Re-roll" type="button" name="button" @click="makeRandomPick('pickPool')"><i class="fas fa-dice"></i> ({{reRolls}})</button>
            <button class="text-sm bg-transparent rounded-full text-white p-2" title="Hmm, nah..." type="button" name="button" @click="cancelMakePick"><i class="fas fa-times"></i></button>
            <button class="text-sm bg-transparent rounded-full text-teal-500 p-2" title="Yes!" type="button" name="button" @click="confirmPick"><i class="fas" :class="canPick ? 'fa-check' : 'fa-thumbs-up'"></i></button>
          </div>
        </template>
        <div
          v-else
          key="ticket"
          class="user-stack--make-pick text-center mb-3">
          <span :class="pickableState" class="random flex justify-between items-center bg-indigo-600 rounded-t-sm border-bottom p-5" @click="makeRandomPick()">
            <i class="fas" :class="!userPicked ? 'fa-star' : 'fa-long-arrow-alt-down'"></i>
            {{!userPicked ? "What's the pick?" : pickedLabel}}
            <i class="fas" :class="!userPicked ? 'fa-star' : 'fa-long-arrow-alt-down'"></i>
          </span>
        </div>
      </template>
      <div v-if="displayPickPool" class="flex align-center my-3 relative">
        <i v-if="pickPoolFilter == ''" class="fas fa-filter text-xs text-gray-400 absolute opacity-50"></i>
        <div class="options__filter flex-shrink">
          <input type="text" name="" v-model="pickPoolFilter" class="rounded-sm bg-transparent text-white w-full" placeholder="    Filter">
        </div>
        <div class="options__sort relative">
          <button type="button" name="button" class="text-white hover:text-teal-500" @click.stop="openSortMenu">
            Sort<span v-show="pickPoolSort != ''">ed by: <span class="text-teal-500">{{ pickPoolSort }}</span></span> <i class="fas fa-caret-down ml-1"></i>
          </button>
          <ul
            v-show="sortMenuIsOpen"
            class="list-reset bg-white rounded-sm absolute right-0 py-1 mt-2 w-32">
            <li v-if="pickPoolSort != ''" class="text-black py-2 px-3 cursor-pointer hover:bg-gray-300" @click="setSort('')">Unset</li>
            <li v-for="sortBy in sortFields" class="text-black py-2 px-3 cursor-pointer hover:bg-gray-300" @click="setSort(sortBy)">{{ sortBy }}</li>
          </ul>
        </div>
      </div>
      <div
        v-for="(movie, index) in (displayPickPool ? pickPool : picks)"
        class="user-stack--entry bg-gray-800 rounded-r-sm px-5 py-3 mb-3"
        :class="{ 'opacity-25' : movie.exclude }">
          <div class="flex justify-between items-center">
            <p class="text-xl capitalize" :title="movie.title">{{ movie.title }}</p>
            <i
            v-if="displayPickPool"
            class="text-sm text-gray-400 ml-3 cursor-pointer"
            :class="movie.exclude ? 'far fa-square' : 'fas fa-check-square'"
            @click="toggleExclusion(movie)"
            ></i>
          </div>
          <p class="capitalize my-3" :class="movie.service.value">{{ movie.service.name }}</p>
          <div class="flex justify-between items-center">
            <p class="text-xs">{{ movie.duration }} minutes</p>
            <i v-if="displayPickPool" class="far fa-trash-alt text-red-600 text-xs cursor-pointer" title="Trash it" @click="rmPick(movie)"></i>
            <p v-else class="text-xs">{{ $moment(movie.watchDate).format('MMM D, YYYY') }}</p>
          </div>
      </div>
      <div v-if="displayPickPool && pickPool.length == 0" class="opacity-50 bg-transparent border-2 border-white border-dashed rounded-sm px-5 py-3 text-center">
        No Results
      </div>
      <div v-if="!signedIn && picks.length == 0" class="opacity-50 bg-transparent border-2 border-white border-dashed rounded-sm px-5 py-3 text-center">
          <i class="far fa-frown fa-3x mb-3"></i>
          <br>
          EMPTY
      </div>
    </template>
  </div>
</template>

<script>
import { db, fb } from '../db'
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
    },
    userPickedDateTime: {
      type: Number
    },
    signedIn: {
      type: Boolean,
      required: true
    },
    authorizeActions: {
      type: Boolean
    },
    reRolls: {
      type: Number,
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
      enablePickBtn: 'cursor-pointer hover:bg-indigo-700',
      disablePickBtn: 'opacity-50 cursor-default',
      selectorsChoice: 'cursor-default text-yellow-500',
      success: false,
      selectConfirm: false,
      hidePickActions: false,
      displayPickPool: false,
      pickType: '',
      duplicate: false,
      pickedLabel: "Tonight's Pick",
      pickPoolFilter: '',
      sortMenuIsOpen: false,
      pickPoolSort: '',
      sortFieldsArr: [
        'Shortest',
        'Longest',
        'Title Asc',
        'Title Desc',
        'Service',
      ],
      pickFromService: '',
      pickFromServiceMenuIsOpen: false,
      pickFromPool: { name: 'All', value: 'pickPool'},
      pickFromPoolMenuIsOpen: false,
      poolOptions: [
        { name: 'All', value: 'pickPool'},
        { name: 'short', value: 'shortPool'},
        { name: 'long', value: 'longPool'},
      ],
      pendingSelectedMovie: {}
    }
  },
  computed: {
    picks() {
      return this.allUserMovies.filter(pick => pick.watched).sort((a,b) => {
        return b.watchDate - a.watchDate
      })
    },
    existingTitles() {
      return this.allUserMovies.map(pick => pick.title.toLowerCase())
    },
    pickPool() {
      return this.allUserMovies
      .filter(pick => !pick.watched)
      .filter(pick => {
        return pick.title.toLowerCase().includes(this.pickPoolFilter) ||
          pick.service.name.toLowerCase().includes(this.pickPoolFilter)
      })
      .sort((pick1, pick2) => {
        switch(this.pickPoolSort) {
          case 'Service':
            return this.sortPicks(pick1.service.name, pick2.service.name)
          case 'Title Asc':
            return this.sortPicks(pick1.title.toLowerCase(), pick2.title.toLowerCase())
          case 'Title Desc':
            return this.sortPicks(pick2.title.toLowerCase(), pick1.title.toLowerCase())
          case 'Shortest':
            return this.sortPicks(parseInt(pick1.duration), parseInt(pick2.duration))
          case 'Longest':
            return this.sortPicks(parseInt(pick2.duration), parseInt(pick1.duration))
          default:
            break;
        }
      })
    },
    shortPool() {
      return this.pickPool.filter(pick => pick.duration < 106 && pick.service.name.includes(this.pickFromService))
    },
    longPool() {
      return this.pickPool.filter(pick => pick.duration >= 106 && pick.service.name.includes(this.pickFromService))
    },
    disableAddPick() {
      return this.movieTitle == '' || this.duration == '' || this.selectedService == '';
    },
    pickableState() {
      return (this.canPick && this.pickPool.length > 0) ? this.enablePickBtn :
        this.userPicked ? this.selectorsChoice : this.disablePickBtn
    },
    sortFields() {
      return this.sortFieldsArr.filter(field => field != this.pickPoolSort)
    },
    reRollColor() {
      switch(this.reRolls) {
        case 3:
          return 'text-green-500'
        case 2:
          return 'text-orange-500'
        case 1:
          return 'text-red-500'
        default:
          return
      }
    },
    availableService() {
      let availableService = [];
      this.pickPool.forEach(pick => {
        if(!availableService.includes(pick.service.name)){
          availableService.push(pick.service.name)
        }
      })
      return availableService.filter(pick => pick != this.pickFromService);
    },
    filteredPoolOptions() {
      return this.poolOptions.filter(pool => pool.value != this.pickFromPool.value && this[pool.value].length > 0)
    }
  },
  methods: {
    startAddPick() {
      this.addMode = true;
      this.displayPickPool = false;
      this.pickFromService = '';
      this.randomizeMovie();
    },
    cancelAddPick() {
      this.addMode = false;
      this.movieTitle = '';
      this.duration = '';
      this.selectedService = '';
      this.duplicate = false;
    },
    addPickToPool() {
      if(this.existingTitles.includes(this.movieTitle.toLowerCase())) {
        this.duplicate = true;
      }else{
        if(this.duplicate) {
          this.duplicate = false;
        }
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
          this.success = true;
          setTimeout(() => {
            this.success = false;
          }, 1000);
        });
      }
    },
    makeRandomPick() {
      if(this.canPick) {
        this.pendingPick = true;
        do {
          if(!this.pendingSelectedMovie.exclude) this.prevRandomSelection = this.randomSelection;
          let temp = Math.floor(Math.random() * this[this.pickFromPool.value].filter(pick => pick.service.name.includes(this.pickFromService)).length);
          while(temp === this.prevRandomSelection) {
            temp = Math.floor(Math.random() * this[this.pickFromPool.value].filter(pick => pick.service.name.includes(this.pickFromService)).length);
          }
          this.randomSelection = temp;
          this.pendingSelectedMovie = this[this.pickFromPool.value].filter(pick => pick.service.name.includes(this.pickFromService))[this.randomSelection] || null;
          if(this.pendingSelectedMovie.exclude) console.log('twas true', this.pendingSelectedMovie.exclude)
        } while(this.pendingSelectedMovie.exclude)
        this.$emit('update:reRolls', this.reRolls - 1)
        db.collection('users')
        .doc(this.username)
        .update({
          reRolls: fb.firestore.FieldValue.increment(-1)
        })
        if(this.reRolls == 1) {
          this.confirmPick();
        }
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
        db.collection(this.username)
        .doc(this.pendingSelectedMovie.title)
        .update({
          watched: true,
          watchDate: Date.parse(new Date())
        })
        this.$emit('update:userPicked', true)
        this.selectConfirm = true;
        setTimeout(() => {
          this.selectConfirm = false;
        }, 500);
        setTimeout(() => {
          this.hidePickActions = true;
        }, 900)
      });
    },
    showPickPool() {
      this.displayPickPool = true;
      this.pickFromService = '';
    },
    rmPick(pick) {
      const confirm = window.confirm(`Are you sure you want to remove ${pick.title}?`);
      if(confirm) {
        db.collection(this.username)
        .doc(pick.title)
        .delete()
      }else{
        false;
      }
    },
    openSortMenu() {
      this.sortMenuIsOpen = !this.sortMenuIsOpen;
    },
    setSort(field) {
      this.sortMenuIsOpen = false;
      this.pickPoolSort = field;
    },
    hidePickPool() {
      this.displayPickPool = false;
      this.pickPoolFilter = '';
      this.pickPoolSort = '';
      this.pickFromService = '';
    },
    sortPicks(a, b) {
      if(a > b) {
        return 1;
      }
      if(a < b) {
        return -1;
      }
      return 0;
    },
    openPickFromServiceMenu() {
      this.pickFromServiceMenuIsOpen = !this.pickFromServiceMenuIsOpen;
    },
    setPickFromService(service) {
      this.pickFromService = service;
    },
    openPickLengthMenu() {
      this.pickFromPoolMenuIsOpen = !this.pickFromPoolMenuIsOpen;
    },
    setPickFromLength(pool) {
      this.pickFromPool = pool;
    },
    toggleExclusion(movie) {
      db.collection(this.username)
      .doc(movie.title)
      .update({
        exclude: !movie.exclude
      })
      movie.exclude = !movie.exclude;
    }
  },
  created() {
    window.document.addEventListener('click', () => {
      this.sortMenuIsOpen = false;
      this.pickFromServiceMenuIsOpen = false;
      this.pickFromPoolMenuIsOpen = false;
    });
    if(this.userPicked) {
      if(this.$moment().valueOf() > this.$moment(this.userPickedDateTime).add(1, 'days').startOf('day').valueOf()) {
        this.pickedLabel = "Last Night's Pick"
      }
    }
    db.collection(this.username)
    .onSnapshot({ includeMetadataChanges: true }, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if(change.type === 'added') {
          this.allUserMovies.push(change.doc.data())
        }
        if(change.type === 'modified') {
          // this.allUserMovies = this.allUserMovies.filter(movie => movie.title !== change.doc.data().title)
          // let index = this.allUserMovies.findIndex(movie => movie.title == change.doc.data().title)
          // this.allUserMovies[index] = change.doc.data();
        }
        if(change.type === 'removed') {
          // console.log('something was deleted!', change.doc.data())
          this.allUserMovies = this.allUserMovies.filter(movie => movie.title !== change.doc.data().title)
        }
      })
    })
  }
}
</script>
<style lang="scss" scoped>
  .fa-filter {
    top: 50%;
    transform: translateY(-50%);
  }
</style>
