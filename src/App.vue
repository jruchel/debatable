<template>
  <v-app style="background-color: #BCAAA4">
    <v-app-bar dark color="blue-grey darken-4" absolute>
      <Return></Return>
      <LoginDialog></LoginDialog>
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

import axios from "axios";
import LoginDialog from "@/components/LoginDialog";
import Return from "@/components/Return";

export default {
  name: 'App',
  components: {Return, LoginDialog},
  computed: {
    loggedIn() {
      return this.$store.getters.getLoggedIn;
    },
    authToken() {
      return this.$store.getters.getAuthToken;
    },
    backendAddress() {
      return this.$store.getters.getBackendAddress;
    }
  },
  methods: {
    performLogout() {
      this.$store.commit('setCurrentToken', {token: ''})
      this.$store.commit('setLoggedIn', {value: false})
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
