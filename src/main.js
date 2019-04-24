import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { firestorePlugin } from 'vuefire'
import '../node_modules/@fortawesome/fontawesome-free/css/all.css'
import styles from './assets/scss/main.scss'
import moment from 'moment'

Vue.prototype.$moment = moment;
Vue.use(firestorePlugin)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
