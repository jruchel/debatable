<template>
  <v-app :style=backgroundStyle>
    <v-snackbar
        top
        timeout="1200"
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
        <v-col cols="1" v-if="['xs'].includes(breakpoint)">
          <v-tooltip bottom>
            <template v-slot:activator="{on, attrs}">
              <v-btn icon @click="$router.go(-1)"
                     v-bind="attrs"
                     v-on="on"
              >
                <v-icon size="30">
                  mdi-arrow-left
                </v-icon>
              </v-btn>
            </template>
            <span>Go back</span>
          </v-tooltip>
        </v-col>
        <v-col cols="1" v-if="['xs'].includes(breakpoint)">
          <v-tooltip bottom>
            <template v-slot:activator="{on, attrs}">
              <v-btn icon @click="$router.push('/')"
                     v-bind="attrs"
                     v-on="on"
              >
                <v-icon size="35">
                  mdi-home-circle
                </v-icon>
              </v-btn>
            </template>
            <span>Home</span>
          </v-tooltip>
        </v-col>
        <v-col cols="1" v-if="['xs'].includes(breakpoint)">
          <v-tooltip bottom>
            <template v-slot:activator="{on, attrs}">
              <v-btn icon @click="$router.push('/issues')"
                     v-bind="attrs"
                     v-on="on"
              >
                <v-icon size="35">
                  mdi-help-circle-outline
                </v-icon>
              </v-btn>
            </template>
            <span>Submit issue</span>
          </v-tooltip>
        </v-col>
        <v-col cols="3" v-if="!['xs'].includes(breakpoint)">
          <v-tooltip bottom>
            <template v-slot:activator="{on, attrs}">
              <v-btn icon @click="$router.go(-1)"
                     v-bind="attrs"
                     v-on="on"
              >
                <v-icon size="30">
                  mdi-arrow-left
                </v-icon>
              </v-btn>
            </template>
            <span>Go back</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{on, attrs}">
              <v-btn icon @click="$router.push('/')"
                     v-bind="attrs"
                     v-on="on"
              >
                <v-icon size="35">
                  mdi-home-circle
                </v-icon>
              </v-btn>
            </template>
            <span>Home</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{on, attrs}">
              <v-btn icon @click="$router.push('/issues')"
                     v-bind="attrs"
                     v-on="on"
              >
                <v-icon size="35">
                  mdi-help-circle-outline
                </v-icon>
              </v-btn>
            </template>
            <span>Submit issue</span>
          </v-tooltip>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="5" md="2" class="d-flex justify-end">
          <login-dialog v-if="!loggedIn.value"></login-dialog>
          <Menu v-else v-on:perform-logout="performLogout"></Menu>
        </v-col>
      </v-row>
    </v-app-bar>
    <v-spacer></v-spacer>
    <v-main data-app>
      <v-fade-transition mode="out-in">
        <router-view :style=marginTop></router-view>
      </v-fade-transition>
    </v-main>
    <v-spacer></v-spacer>
  </v-app>
</template>

<script>

import LoginDialog from "@/components/login/LoginDialog";
import Menu from "@/components/user/Menu";
import EventBus from "@/event-bus/EventBus";

export default {
  name: 'App',
  components: {Menu, LoginDialog},
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
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    marginTop() {
      switch (this.breakpoint) {
        case 'xs':
          return 'margin-top: 20%;'
        case 'sm':
          return 'margin-top: 20%;'
        case 'md':
          return 'margin-top: 10%;'
        default:
          return 'margin-top: 5%;'
      }
    },
    snackbarTopMargin() {
      let margin = '2%'
      if (this.isMobile) {
        margin = '15%'
      }
      return 'margin-top: ' + margin + ';'
    },
    isMobile() {
      return /xs|sm/i.test(this.breakpoint)
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
      this.$store.commit('performLogout')
      if (this.$route.path.includes('/user')) {
        this.$router.push('/')
      }
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

.rounded-card {
  border-radius: 50px;
}


</style>

