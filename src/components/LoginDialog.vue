<template>
  <v-dialog v-model="loginDialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" outlined @click=showLoginDialog>Login</v-btn>
    </template>
    <v-card>
      <v-toolbar dark flat class="sticky-toolbar">
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
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn style="margin-bottom: 2px" v-if="!this.loggedIn.value" :loading="loading" @click="performLogin">
            Login
          </v-btn>
          <v-icon v-if="this.loggedIn.value" color="green" style="margin-bottom: 10px" size="45">mdi-check-circle
          </v-icon>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
import EventBus from "@/event-bus";


export default {
  name: "LoginDialog",
  inject: ['authToken', 'loggedIn'],
  data() {
    return {
      user: {
        username: "",
        password: ""
      },
      loginDialog: false,
      loading: false,
      loggedIn: this.loggedIn
    }
  },
  methods: {
    showLoginDialog() {
      this.loginDialog = true
    },
    performLogin() {
      this.loading = true
      EventBus.$emit('send-http-request', ['/security/authenticate', 'POST', this.user, {}, this.handleLoginResponse])
    },
    handleLoginResponse(response) {
      try {
        let token = response.token
        if (token === undefined || token === null || token === '') {
          alert('Username or password is incorrect.')
        } else {
          this.saveToken(token)
        }

      } catch (ex) {
        this.loading = false
        alert(response)
      }
      this.loading = false
    },
    saveToken(token) {
      EventBus.$emit('login', [token])
    },
  }
}
</script>

<style scoped>

</style>