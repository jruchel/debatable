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

//TODO: if a request is made to a secured endpoint and the auth token is no longer valid,
// authenticate the user automatically with the last saved details, if authentication fails, log them out