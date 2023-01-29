import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VCalendar from 'v-calendar'
import 'v-calendar/dist/style.css'
import 'bootstrap'
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyCMvci9qdep4qgPzz3Pf06YA0P8JqwyGSs",
  authDomain: "goodnote-e23c8.firebaseapp.com",
  databaseURL: "https://goodnote-e23c8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "goodnote-e23c8",
  storageBucket: "goodnote-e23c8.appspot.com",
  messagingSenderId: "180196645779",
  appId: "1:180196645779:web:49b7befbefe074d97ea666"
}

initializeApp(firebaseConfig)


const app = createApp(App)
app.use(router)
app.use(VCalendar, {})
app.mount('#app')