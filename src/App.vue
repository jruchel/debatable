<template>
  <v-app :style=backgroundStyle>
    <v-snackbar
        top
        :style=snackbarTopMargin
        v-model="snackbar.show"
        :color="colors.snackbar.name">
      {{ snackbar.text }}
    </v-snackbar>
    <v-app-bar dark :color=$store.getters.getColors.primary.name absolute>
      <v-progress-linear
          :active="loading.value"
          :indeterminate="loading.value"
          absolute
          bottom
          :color="loading.color.active"
      ></v-progress-linear>
      <v-row>
        <v-col cols="2" md="1" >
          <v-btn icon @click="$router.go(-1)">
            <v-icon size="30">
              mdi-arrow-left
            </v-icon>
          </v-btn>
        </v-col>
        <v-col cols="1">
          <v-btn icon @click="$router.push('/')">
            <v-icon size="35">
              mdi-home-circle
            </v-icon>
          </v-btn>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="5" md="2" class="d-flex justify-end">
          <login-dialog v-if="!loggedIn.value"></login-dialog>
          <user-avatar v-else v-on:perform-logout="performLogout"></user-avatar>
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
import UserAvatar from "@/components/user/UserAvatar";
import EventBus from "@/event-bus/EventBus";

export default {
  name: 'App',
  components: {UserAvatar, LoginDialog},
  mounted() {
    EventBus.$on('show-snackbar', args => {
      this.showSnackbar(args)
    })
    this.$store.dispatch('fetchQuestion')
  },
  data() {
    return {
      snackbar: {
        show: false,
        text: ""
      }
    }
  },
  computed: {
    snackbarTopMargin() {
      let margin = '2%'
      if(this.isMobile) {
        margin = '15%'
      }
      return 'margin-top: ' + margin + ';'
    },
    isMobile() {
      return /xs|sm/i.test(this.$vuetify.breakpoint.name)
    },
    colors() {
      return this.$store.getters.getColors
    },
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
    showSnackbar(text) {
      this.snackbar.text = text
      this.snackbar.show = true
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

