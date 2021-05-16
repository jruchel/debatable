<template>
  <v-app :style=backgroundStyle>
    <v-app-bar dark :color=$store.getters.getColor.primary.name absolute>
      <Return></Return>
      <v-spacer></v-spacer>
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

import LoginDialog from "@/components/LoginDialog";
import Return from "@/components/Return";

export default {
  name: 'App',
  components: {Return, LoginDialog},
  mounted() {
    this.$store.dispatch('fetchQuestion')
  },
  computed: {
    loggedIn() {
      return this.$store.getters.getLoggedIn;
    },
    authToken() {
      return this.$store.getters.getAuthToken;
    },
    backendAddress() {
      return this.$store.getters.getBackendAddress;
    },
    backgroundColor() {
      return this.$store.getters.getColor.background.hex
    },
    backgroundStyle() {
      return 'background-color: ' + this.backgroundColor
    }
  },
  methods: {
    performLogout() {
      this.$store.commit('setCurrentToken', {token: ''})
      this.$store.commit('setLoggedIn', {value: false})
      this.$store.commit('setUser', {})
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

