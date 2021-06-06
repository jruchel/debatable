<template>
  <v-dialog v-model="loginDialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn style="margin-top: 5px"  :style="getButtonStyle" v-bind="attrs" v-on="on" outlined @click=showLoginDialog>Login</v-btn>
    </template>
    <LoginCard></LoginCard>
  </v-dialog>
</template>

<script>
import LoginCard from "@/components/login/LoginCard";


export default {
  name: "LoginDialog",
  components: {LoginCard},
  computed: {
    loggedIn() {
      return this.$store.getters.getLoggedIn;
    },
    getButtonStyle() {
      if (this.loggedIn.value) {
        return 'visibility: hidden'
      }
      return ''
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