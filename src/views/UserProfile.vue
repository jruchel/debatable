<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="12" style="text-align: center">
        <h1>{{ user.username }}</h1>
        <v-btn @click="$store.commit('setLoggedIn', {value: false})"></v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "UserProfile",
  beforeMount() {
    if (!this.loggedIn.value) {
      this.$router.push('/')
    }
  },
  watch: {
    loggedIn: function (val) {
      if (!val.value) {
        this.$router.push('/')
      }
    }
  },
  computed: {
    loggedIn() {
      return this.$store.getters.getLoggedIn
    },
    user() {
      return this.$store.getters.getUser
    }
  }
}
</script>

<style scoped>

</style>