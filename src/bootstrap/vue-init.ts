import Vue from 'vue'

import { store } from '~/store'
import App from '~/views/App.vue'

const app = new Vue({
    render: h => h(App),
    store,
}).$mount('#app')

window['$store'] = store
window['$app'] = app
