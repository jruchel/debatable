<template>
  <v-card>
    <v-snackbar
        v-if="snackbar.show"
        top
        :style="marginTop()"
        v-model="snackbar.show"
        :color=$store.getters.getColor.snackbar.name
        timeout="3500"
    >
      {{ snackbar.text }}
    </v-snackbar>
    <v-toolbar dark flat class="sticky-toolbar" :color=$store.getters.getColor.primary.name>
      <v-spacer></v-spacer>
      <span>Please log in</span>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card style="margin-top: 30px">
      <v-text-field outlined style="margin-left: 10px; margin-right: 10px"
                    label="username" v-model="user.username"
      ></v-text-field>
      <v-text-field type="password" outlined style="margin-left: 10px; margin-right: 10px"
                    label="password" v-model="user.password"
      ></v-text-field>
      <v-fade-transition>
        <v-text-field v-if="emailInput" outlined style="margin-left: 10px; margin-right: 10px"
                      label="email" v-model="user.email"
        ></v-text-field>
      </v-fade-transition>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn style="margin-bottom: 2px" v-if="!this.loggedIn.value" :loading="loadingLogin" @click="performLogin">
          Login
        </v-btn>
        <v-btn style="margin-bottom: 2px" v-if="!this.loggedIn.value" :loading="loadingRegister"
               @click="performRegistration">
          Register
        </v-btn>
        <v-fade-transition mode="in">
          <v-icon v-if="this.loggedIn.value" color="green" style="margin-bottom: 10px" size="45">mdi-check-circle
          </v-icon>
        </v-fade-transition>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-card>
</template>

<script>
import {authenticate, register} from "@/api/api";


export default {
  name: "LoginCard",
  computed: {
    loggedIn() {
      return this.$store.getters.getLoggedIn;
    },
    authToken() {
      return this.$store.getters.getAuthToken;
    },
    user() {
      return this.$store.getters.getUser
    }
  },
  data() {
    return {
      loginDialog: false,
      loadingLogin: false,
      loadingRegister: false,
      emailInput: false,
      snackbar: {show: false, text: "d00pa"}
    }
  },
  methods: {
    marginTop() {
      if (this.isMobile()) {
        return "margin-top: 15%"
      }
      return "margin-top: 0%"
    },
    isMobile() {
      return /xs|sm/i.test(this.$vuetify.breakpoint.name)
    },
    showSnackbar(text) {
      this.snackbar.show = false
      this.snackbar.text = text
      this.snackbar.show = true
    },
    showLoginDialog() {
      this.loginDialog = true
    },
    performLogin() {
      this.emailInput = false
      this.user.email = ''
      this.loadingLogin = true
      authenticate(this.user, this.handleLoginResponse, this.handleLoginResponse)
    },
    performRegistration() {
      if (this.emailInput === false) {
        this.emailInput = true
      } else {
        this.loadingRegister = true
        register(this.user, this.handleLoginResponse, this.handleLoginResponse)
      }
    },
    handleLoginResponse(response) {
      if (response.status === 200) {
        this.saveToken(response.data)
        this.showSnackbar("Login successful")
      } else try {
        this.showSnackbar(response.data)
      } catch (ex) {
        this.showSnackbar(ex)
      }
      this.loadingLogin = false
      this.loadingRegister = false
    },
    saveToken(token) {
      this.$store.commit('setCurrentToken', token)
      this.$store.commit('setLoggedIn', {value: true})
    },
  }
}
</script>

<style scoped>
html {
  overflow-y: auto !important;
}
</style>