<template>
  <v-card style="border-radius: 50px">
    <v-card-title class="justify-center">No questions</v-card-title>
    <v-card-text class="justify-center" style="text-align: center;">
      <span>You don't currently have any questions</span><br><br>
      <span>If you want to ask a question click the button below</span>
    </v-card-text>
    <v-card-actions class="justify-center" style="margin-top: 20px">
      <v-btn outlined rounded style="margin-bottom: 10px" @click="$router.push('/ask')">
        Ask question
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
name: "EmptyQuestions"
}
</script>

<style scoped>

</style>