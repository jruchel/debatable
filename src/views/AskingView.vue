<template>
  <v-container>
    <v-row v-if="!loggedIn.value">
      <v-col cols="12">
        <LoginPrompt></LoginPrompt>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <QuestionInput></QuestionInput>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoginPrompt from "@/components/LoginPrompt";
import QuestionInput from "@/components/QuestionInput";

export default {
  name: "AskingView",
  components: {QuestionInput, LoginPrompt},
  computed: {
    loggedIn() {
      return this.$store.getters.getLoggedIn;
    },
  },
}
</script>

<style scoped>

</style>