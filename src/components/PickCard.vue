<template>
  <div
    class="user-stack--entry bg-gray-800 rounded-r-sm px-5 py-3 mb-3">
      <template v-if="editMode">
        <div
        contenteditable
        class="text-xl capitalize border-b border-dotted border-gray-600"
        @keyup="updateDetailsInput($event, 'title')"
        v-text="currMovie.title"
        ></div>
        <div class="relative my-3">
          <button type="button" name="button" :class="updateDetails.service.value" @click.stop="openServiceMenu">
            {{ updateDetails.service.name }} <i class="fas fa-caret-down ml-1"></i>
          </button>
          <ul
          v-show="serviceMenuIsOpen"
          class="list-reset bg-white rounded-sm absolute left-0 py-1 mt-2 w-32">
            <li v-for="service in streamingServices" class="text-black py-2 px-3 cursor-pointer hover:bg-gray-300" @click="setService(service)">{{ service.name }}</li>
          </ul>
        </div>
      </template>
      <template v-else>
        <p class="text-xl capitalize" :title="currMovie.title">{{ currMovie.title }}</p>
        <p class="capitalize my-3" :class="currMovie.service.value">{{ currMovie.service.name }}</p>
      </template>
      <div class="flex items-center">
        <div
        v-if="editMode"
        contenteditable
        class="text-xs border-b border-dotted border-gray-600"
        @keyup="updateDetailsInput($event, 'duration')">{{ currMovie.duration }}</div>
        <p v-else class="text-xs">{{ currMovie.duration }} minutes</p>
        <span class="flex-grow"></span>
        <template v-if="displayPickPool">
          <i v-if="editMode" class="fas fa-times text-xs cursor-pointer" title="Cancel edit" @click="toggleEditMode"></i>
          <i class="text-teal-500 text-xs cursor-pointer ml-2" :class="editMode ? 'fas fa-check' : 'far fa-edit'" title="Edit details" @click="editMode ? updatePick() : toggleEditMode()"></i>
          <i v-if="!editMode" class="far fa-trash-alt text-red-600 text-xs cursor-pointer ml-2" title="Trash it" @click="$emit('removePick', currMovie.title)"></i>
        </template>
        <p v-else class="text-xs">{{ $moment(currMovie.watchDate).format('MMM D, YYYY') }}</p>
      </div>
  </div>
</template>

<script>
import { db } from '../db'
import { streamingServices } from '../randoms'
export default {
  name: 'PickCard',
  props: {
    username: {
      type: String
    },
    movie: {
      type: Object
    },
    displayPickPool: {
      type: Boolean
    }
  },
  data() {
    return {
      currMovie: this.movie,
      editMode: false,
      updateDetails: {
        title: undefined,
        service: undefined,
        duration: undefined
      },
      serviceMenuIsOpen: false,
      streamingServices: streamingServices
    }
  },
  methods: {
    updateDetailsInput(event, field) {
      this.updateDetails[field] = event.target.textContent;
    },
    updatePick() {
      this.editMode = true;
      if(this.currMovie.title == this.updateDetails.title) {
        console.log('titles match')
        db.collection(this.username)
        .doc(this.currMovie.title)
        .update({
          title: this.updateDetails.title,
          service: this.updateDetails.service,
          duration: this.updateDetails.duration
        });
      }else{
        console.log('titles do not match')
        db.collection(this.username)
        .doc(this.updateDetails.title)
        .set({
          title: this.updateDetails.title,
          service: this.updateDetails.service,
          duration: this.updateDetails.duration
        })
        .then(() => {
          console.log('this movie title now, ', this.movie)
        });
      }
      this.editMode = false;
    },
    toggleEditMode() {
      this.editMode = !this.editMode
      this.setUpdateDetails();
    },
    openServiceMenu() {
      this.serviceMenuIsOpen = !this.serviceMenuIsOpen;
    },
    setUpdateDetails() {
      this.updateDetails.title = this.currMovie.title;
      this.updateDetails.service = this.currMovie.service;
      this.updateDetails.duration = this.currMovie.duration;
    }
  },
  mounted() {
    this.setUpdateDetails();
  }
}
</script>
