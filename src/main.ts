import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import FullScreenLayout from './layouts/FullScreenLayout.vue'
import MenuLayout from './layouts/MenuLayout.vue'
import router from './router'
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import "./styles/main.css";

const app = createApp(App);

app.use(Antd)
app.component("Fullscreen", FullScreenLayout)
app.component("MenuLayout", MenuLayout)


app.use(router)
app.mount('#app')
