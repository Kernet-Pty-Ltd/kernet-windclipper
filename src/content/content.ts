
import { createApp } from 'vue'
import '@/assets/style.css'
import Content from './content.vue'

const vueApp = document.createElement('div')
vueApp.id = '#windclipper-app'

document.body.appendChild(vueApp)

const App = createApp(Content)

// Mount
App.mount(vueApp)

