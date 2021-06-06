<template>
  <v-container style="margin-top: 100px">
    <v-row v-if="loading" class="justify-center">
      <v-col cols="8" v-for="i in [1, 2, 3]" :key="i">
        <v-sheet
            rounded
            color="grey"
        >
          <v-skeleton-loader
              type="image"
          ></v-skeleton-loader>
        </v-sheet>
      </v-col>
    </v-row>
    <v-container v-else>
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
  </v-container>
</template>

<script>
import QuestionPreview from "@/components/questions/QuestionPreview";
import {deleteQuestion} from "@/api/api";

export default {
  name: "UserQuestions",
  components: {QuestionPreview},
  data() {
    return {
      loading: true
    }
  },
  computed: {
    token() {
      return this.$store.getters.getAuthToken
    },
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
  mounted() {
    this.$store.dispatch('reauthenticate').then(() => this.$store.dispatch('fetchUserQuestions')).then(() => this.loading = false)
  },
  methods: {
    deleteQuestion(payload) {
      let question = payload.question
      let onComplete = payload.onComplete
      let onError = payload.onError
      this.$store.dispatch('reauthenticate').then(() => deleteQuestion(question.id, this.token))
          .then(() => this.$store.dispatch('fetchUserQuestions'))
          .then((response) => onComplete(response))
          .catch((error) => onError(error.response.data))
    }
  }
}
</script>

<style scoped>

</style>