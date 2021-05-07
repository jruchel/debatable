<template>
  <v-card>
    <v-snackbar
        top
        style="margin-top: 2%"
        v-model="snackbar.show"
        color="blue-grey darken-2"
        timeout="3500"
    >
      {{ snackbar.text }}
    </v-snackbar>
    <v-toolbar dark flat class="sticky-toolbar" color="blue-grey darken-4">
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
      this.$store.commit('logIn', {
        endpoint: '/security/authenticate',
        method: 'POST',
        body: this.user,
        headers: {},
        onComplete: this.handleLoginResponse
      })
    },
    performRegistration() {
      if (this.emailInput === false) {
        this.emailInput = true
      } else {
        this.loadingRegister = true
        this.$store.commit('logIn', {
          endpoint: '/security/register',
          method: 'POST',
          body: this.user,
          headers: {},
          onComplete: this.handleLoginResponse
        })
      }
    },
    handleLoginResponse(response) {
      try {
        let token = response
        if (token.token === undefined || token.token === null || token.token === '') {
          this.showSnackbar(response)
        } else {
          this.saveToken(token)
          this.showSnackbar("Login successful")
        }

      } catch (ex) {
        this.loadingLogin = false
        this.loadingRegister = false
        this.showSnackbar(response)
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

</style>