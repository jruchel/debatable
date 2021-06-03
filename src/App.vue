<template>
  <v-app :style=backgroundStyle>
    <v-app-bar dark :color=$store.getters.getColors.primary.name absolute>
      <v-progress-linear
          :active="loading.value"
          :indeterminate="loading.value"
          absolute
          bottom
          :color="loading.color.active"
      ></v-progress-linear>
      <v-row>
        <v-col cols="4">
          <Return></Return>
        </v-col>
        <v-col cols="4" class="d-flex justify-space-around">
          <h1>
            {{ getCurrentRouteName() }}
          </h1>
        </v-col>
        <v-col cols="4" class="d-flex justify-end">
          <LoginDialog></LoginDialog>
          <user-avatar v-on:perform-logout="performLogout" v-if="loggedIn.value"></user-avatar>
        </v-col>
      </v-row>
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

import LoginDialog from "@/components/login/LoginDialog";
import Return from "@/components/Return";
import UserAvatar from "@/components/user/UserAvatar";

export default {
  name: 'App',
  components: {UserAvatar, Return, LoginDialog},
  mounted() {
    this.$store.dispatch('fetchQuestion')
  },
  computed: {
    loading() {
      return this.$store.getters.getLoading
    },
    loggedIn() {
      return this.$store.getters.getLoggedIn;
    },
    authToken() {
      return this.$store.getters.getAuthToken;
    },
    backgroundColor() {
      return this.$store.getters.getColors.background.hex
    },
    backgroundStyle() {
      return 'background-color: ' + this.backgroundColor
    }
  },
  methods: {
    getCurrentRouteName() {
      return this.$router.history.current.name
    },
    performLogout() {
      this.$store.commit('setCurrentToken', {token: ''})
      this.$store.commit('setLoggedIn', {value: false})
      this.$store.commit('setUser', {username: "", password: "", email: ""})
      this.$store.dispatch('fetchUser').then(() => this.$store.dispatch('fetchUserAnswer'))
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

.bottom-navigation {
  bottom: 0;
  position: absolute;
}

@font-face {
  @include setFont("Nunito-Black")
}

* {
  font-family: Nunito-Black, serif;
}

</style>

