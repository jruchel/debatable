<template>
  <v-dialog v-model="loginDialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" outlined @click=showLoginDialog>Login</v-btn>
    </template>
    <LoginCard></LoginCard>
  </v-dialog>
</template>

<script>
import LoginCard from "@/components/LoginCard";


export default {
  name: "LoginDialog",
  components: {LoginCard},
  computed: {
    loggedIn() {
      return this.$store.getters.getLoggedIn;
    }
  },
  data() {
    return {
      loginDialog: false,
    }
  },
  methods: {
    showLoginDialog() {
      this.loginDialog = true
    },
  }
}
</script>

<style scoped>

</style>