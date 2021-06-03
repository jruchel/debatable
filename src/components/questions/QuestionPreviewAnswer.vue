<template>
  <v-card :color="answer.color">
    <v-card-title>{{ answer.answer }}</v-card-title>
    <v-card-subtitle>Answers: {{answer.count}}</v-card-subtitle>
  </v-card>
</template>

<script>
export default {
name: "QuestionPreviewAnswer",
  props: ['answer']
}
</script>

<style scoped>

</style>