import Vue from 'vue'

import { store } from '~/store'
import App from '~/views/App.vue'

new Vue({
    render: (h) => h(App),
    store,
}).$mount('#app')
