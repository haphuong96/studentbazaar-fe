import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import FullScreenLayout from './layouts/FullScreenLayout.vue'
import MenuLayout from './layouts/MenuLayout.vue'

const app = createApp(App);

app.component("Fullscreen", FullScreenLayout)
app.component("MenuLayout", MenuLayout)

app.mount('#app')
