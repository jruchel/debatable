import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'

Vue.config.productionTip = false


new Vue({
    router,
    vuetify,
    store,
    render: h => h(App)
}).$mount('#app')

//TODO: fetch batches of comments as pages and keep adding more pages as the user scrolls down
//TODO: color the comments of each user by the answer they have given
//TODO: submitting answers for users that arent logged in works the same as always except results arent sent to the backend
//TODO: add a splash screen