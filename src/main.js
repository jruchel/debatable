import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

let provide = {
    backendAddress: 'http://localhost:8081'
}

new Vue({
    router,
    provide,
    vuetify,
    render: h => h(App)
}).$mount('#app')
