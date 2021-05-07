import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'

Vue.config.productionTip = false

let provide = {
    backendAddress: 'http://localhost:8081',
    authToken: {token: ""},
    loggedIn: false
}

new Vue({
    router,
    provide,
    vuetify,
    store,
    render: h => h(App)
}).$mount('#app')
