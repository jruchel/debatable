<template>
  <v-card>
    <v-toolbar dark flat class="sticky-toolbar" :color=$store.getters.getColors.primary.name>
      <v-spacer></v-spacer>
      <span>Please log in</span>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card style="margin-top: 30px">
      <v-form v-model="valid" ref="form">
        <v-text-field outlined style="margin-left: 10px; margin-right: 10px"
                      label="username" v-model="user.username" :rules="rules.username"
        ></v-text-field>
        <v-text-field type="password" outlined style="margin-left: 10px; margin-right: 10px"
                      label="password" v-model="user.password" :rules="rules.password"
        ></v-text-field>
        <v-fade-transition>
          <v-text-field v-if="emailInput" outlined style="margin-left: 10px; margin-right: 10px"
                        label="email" v-model="user.email" :rules="rules.email"
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
      </v-form>
    </v-card>
  </v-card>
</template>

<script>
import {authenticate, register} from "@/api/api";
import EventBus from "@/event-bus/EventBus";


export default {
  name: "LoginCard",
  mounted() {
    this.$refs.form.resetValidation()
  },
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
      valid: false,
      rules: {
        email: [
          v => v !== undefined || 'E-mail is required',
          v => !!v || 'E-mail is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        password: [
          v => v !== undefined || 'Password is required',
          v => !!v || 'Password is required',
          v => v.length > 5 || 'Password must be longer than 5 characters',
          v => v.length < 15 || 'Password must be shorter than 20 characters',
          v => /[a-zA-Z0-9]+/.test(v) || 'Password must contain upper and lower case letters and at least one number'
        ],
        username: [
          v => v !== undefined || 'Username is required',
          v => !!v || 'Username is required',
          v => v.length > 3 || 'Username must be longer than 3 characters',
          v => v.length < 15 || 'Username must be shorter than 15 characters'
        ]
      }
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
      EventBus.$emit('show-snackbar', text)
    },
    showLoginDialog() {
      this.loginDialog = true
    },
    performLogin() {
      this.emailInput = false
      this.validate()
      if (this.valid === true) {
        this.user.email = ''
        this.loadingLogin = true
        authenticate(this.user).then(this.handleLoginSuccess).catch(this.handleLoginError).then(() => {
          this.loadingLogin = false
          this.loadingRegister = false
        }).then(() => this.$store.dispatch('fetchUserAnswer'))
      }
    },
    validate() {
      this.$refs.form.validate()
      return this.valid === true
    },
    performRegistration() {
      if (this.emailInput === false) {
        this.emailInput = true
      } else {
        this.validate()
        if (this.valid === true) {
          this.loadingRegister = true
          this.$refs.form.resetValidation()
          register(this.user).then(this.handleLoginSuccess).catch(this.handleLoginError).then(() => {
            this.loadingLogin = false
            this.loadingRegister = false
          })
        }
      }
    },
    handleLoginError(error) {
      try {
        this.showSnackbar(error.response.data)
      } catch (ex) {
        this.showSnackbar(ex)
      }
    },
    handleLoginSuccess(response) {
      this.saveToken(response.data)
      this.$store.dispatch('fetchUser')
      this.showSnackbar("Login successful")
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