import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store.js'
import { SnackbarService, Vue3Snackbar } from 'vue3-snackbar'
import 'vue3-snackbar/styles'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(SnackbarService)

app.component('vue3-snackbar', Vue3Snackbar)

app.mount('#app')
