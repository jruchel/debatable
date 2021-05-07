<template>
  <v-app style="background-color: #BCAAA4">
    <v-app-bar dark color="blue-grey darken-4" absolute>
      <Return></Return>
      <v-spacer></v-spacer>
      <v-toolbar-title style="width: 100%; height: 100%; text-align: center; margin-top: 20px">Debatable
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <LoginDialog :button-visible="!loggedIn.value"></LoginDialog>
      <v-btn v-if="loggedIn.value" outlined @click="performLogout">Logout</v-btn>
    </v-app-bar>
    <v-spacer></v-spacer>
    <v-main data-app>
      <v-fade-transition mode="out-in">
        <router-view></router-view>
      </v-fade-transition>
    </v-main>
    <v-spacer></v-spacer>
  </v-app>
</template>

<script>

import EventBus from "@/event-bus";
import axios from "axios";
import LoginDialog from "@/components/LoginDialog";
import Return from "@/components/Return";
import Store from "@/store/index"

export default {
  name: 'App',
  components: {Return, LoginDialog},
  inject: ['backendAddress'],
  provide() {
    return {
      loggedIn: this.loggedIn
    }
  },
  mounted() {
    EventBus.$on('send-http-request', args => {
      this.sendRequest(args[0], args[1], args[2], args[3], args[4])
    })
    EventBus.$on('login', args => {
      this.performLogin(args[0])
    })
    this.authToken = Store.getters.getToken
    this.loggedIn = Store.getters.getLoggedIn
  },
  data() {
    return {
      authToken: {token: ""},
      loggedIn: {value: false}
    }
  },
  methods: {
    performLogout() {
      this.authToken.token = ''
      this.loggedIn.value = false
    },
    performLogin(token) {
      this.authToken.token = token
      this.loggedIn.value = true
    },
    sendRequest(endpoint, method, body, headers, onComplete) {
      headers['Content-Type'] = 'application/json'
      axios({
        method: method.toLowerCase(),
        url: this.backendAddress + endpoint,
        headers: headers,
        data: JSON.parse(JSON.stringify(body))
      }).then(response => onComplete(response.data)).catch(function (error) {
        onComplete(error.response.data)
      })
    }
  }
};
</script>
<style lang="scss">

@mixin setFont($font-name) {
  font-family: $font-name;
  src: local($font-name),
  url(./assets/fonts/#{$font-name}.ttf) format("truetype");
}

@font-face {
  @include setFont("Nunito-Black")
}

* {
  font-family: Nunito-Black, serif;
}

</style>
