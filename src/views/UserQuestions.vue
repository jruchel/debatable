<template>
  <v-container style="margin-top: 100px">
    <v-row class="justify-center" v-if="hasQuestions">
      <question-preview v-on:delete-question="deleteQuestion" v-for="question in userQuestions" :key="question.id"
                        :question="question"></question-preview>
    </v-row>
    <v-row class="justify-center" v-if="!hasQuestions">
      <v-col cols="4">
        <v-card>
          <v-card-title class="justify-center">
            No questions so far
          </v-card-title>
          <v-card-actions class="justify-center">
            <v-btn @click="$router.push('/ask')" :color="colors.buttonSecondary.name" dark>
              Go ahead and ask!
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import QuestionPreview from "@/components/questions/QuestionPreview";

export default {
  name: "UserQuestions",
  components: {QuestionPreview},
  computed: {
    colors() {
      return this.$store.getters.getColors
    },
    hasQuestions() {
      return this.userQuestions.length > 0
    },
    userQuestions() {
      return this.$store.getters.getUserQuestions
    }
  },
  methods: {
    deleteQuestion(question) {
      console.log('question to delete', question)
      //deleting question through the api
      this.$store.dispatch('fetchUserQuestions')
    }
  }
}
</script>

<style scoped>

</style>