<template>
  <v-container class="justify-center" :style="marginTop()">
    <v-row class="justify-center">
      <v-col cols="12" md="8">
        <v-slide-x-transition>
          <v-card v-if="!loggedIn.value">
            <v-card-title class="text-xs-center">
              <v-spacer></v-spacer>
              <span>Please log in before asking</span>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text style="text-align: center">
              Questions you post while not logged in disappear after 24 hours, so make sure you're logged in if you want
              them to stay!
            </v-card-text>
          </v-card>
        </v-slide-x-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: "LoginPrompt",
  computed: {
    loggedIn() {
      return this.$store.getters.getLoggedIn
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
  }
}
</script>

<style scoped>

</style>