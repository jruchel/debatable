<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="12" style="text-align: center">
        <h1>{{ user.username }}</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "UserProfile",
  computed: {
    user() {
      return this.$store.getters.getUser
    }
  }
}
</script>

<style scoped>

</style>