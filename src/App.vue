<template>
  <v-app style="background-color: #880E4F">
    <v-main>
      <QuestionView></QuestionView>
    </v-main>
  </v-app>
</template>

<script>

import QuestionView from "@/views/QuestionView";
import EventBus from "@/event-bus";
import axios from "axios";

export default {
  name: 'App',
  components: {QuestionView},
  inject: ['backendAddress'],
  mounted() {
    EventBus.$on('send-http-request', args => {
      this.sendRequest(args[0], args[1])
    })
  },
  methods: {
    sendRequest(endpoint, onComplete) {
      let address = this.backendAddress
      axios.get(address).then(value => onComplete(value.data))
    }
  }
};
</script>
