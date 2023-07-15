import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import FullScreenLayout from './layouts/FullScreenLayout.vue'
import MenuLayout from './layouts/MenuLayout.vue'
import router from './router'
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import "./styles/main.css";
import { layoutNames } from './router/layout-names'

const app = createApp(App);

app.use(Antd)
app.component(layoutNames.FULLSCREEN_LAYOUT, FullScreenLayout)
app.component(layoutNames.MENU_LAYOUT, MenuLayout)


app.use(router)
app.mount('#app')
