<template>
  <v-container class="justify-center">
    <v-row class="justify-center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="text-xs-center">
            <v-spacer></v-spacer>
            <span style="margin-left: 105px">Please log in before asking</span>
            <v-spacer></v-spacer>
            <LoginDialog></LoginDialog>
          </v-card-title>
          <v-card-text style="text-align: center">
            Questions you post while not logged in disappear after 30 days, so make sure you're logged in if you want
            them to stay!
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoginDialog from "@/components/LoginDialog";

export default {
  name: "LoginPrompt",
  components: {LoginDialog},
}
</script>

<style scoped>

</style>