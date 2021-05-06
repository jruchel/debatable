<template>
  <v-app style="background-color: #880E4F">
    <v-app-bar dark color="grey darken-4" absolute>
      <v-toolbar-title style="width: 100%; height: 100%; text-align: center; margin-top: 20px">Debatable
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <LoginDialog></LoginDialog>
      <v-btn v-if="loggedIn" outlined @click="performLogout">Logout</v-btn>
    </v-app-bar>
    <v-spacer></v-spacer>
    <v-main data-app>
      <QuestionView></QuestionView>
    </v-main>
  </v-app>
</template>

<script>

import QuestionView from "@/views/QuestionView";
import EventBus from "@/event-bus";
import axios from "axios";
import LoginDialog from "@/components/LoginDialog";

export default {
  name: 'App',
  components: {LoginDialog, QuestionView},
  inject: ['backendAddress', 'authToken', 'loggedIn'],
  updated() {
    console.log(this.loggedIn)
  },
  mounted() {
    EventBus.$on('send-http-request', args => {
      this.sendRequest(args[0], args[1], args[2], args[3], args[4])
    })
  },
  data() {
    return {
      loggedIn: this.loggedIn
    }
  },
  methods: {
    performLogout() {
      this.authToken.token = ''
      this.loggedIn = false
    },
    sendRequest(endpoint, method, body, headers, onComplete) {
      headers['Content-Type'] = 'application/json'
      axios({
        method: method.toLowerCase(),
        url: this.backendAddress + endpoint,
        headers: headers,
        data: JSON.parse(JSON.stringify(body))
      }).then(response => onComplete(response.data)).catch(function (error) {
        onComplete(error)
      })
    }
  }
};
</script>
