<template>
  <v-container>
    <v-row v-if="loading" class="justify-center">
      <v-col cols="12" md="8" xl="6" v-for="i in [1, 2, 3, 4]" :key="i">
        <v-container>
          <v-row class="justify-center">
            <v-col cols="12">
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
        </v-container>
      </v-col>
    </v-row>
    <v-container v-else>
      <v-row class="justify-center" v-if="hasQuestions">
        <v-col cols="12" md="8" xl="6" v-for="question in userQuestions" :key="question.id">
          <question-preview v-on:delete-question="deleteQuestion"
                            :question="question"></question-preview>
        </v-col>
      </v-row>
      <v-row class="justify-center" v-if="!hasQuestions">
        <v-col cols="12" md="8" xl="6">
          <empty-questions/>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import QuestionPreview from "@/components/questions/QuestionPreview";
import {deleteQuestion} from "@/api/api";
import EmptyQuestions from "@/components/questions/EmptyQuestions";

export default {
  name: "UserQuestions",
  components: {EmptyQuestions, QuestionPreview},
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
  data() {
    return {
      loading: true
    }
  },
  computed: {
    loggedIn() {
      return this.$store.getters.getLoggedIn
    },
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
    this.$store.dispatch('reauthenticate')
        .then(() => {
          return this.$store.dispatch('fetchUserQuestions')
        }).then(() => this.loading = false)
  },
  methods: {
    deleteQuestion(payload) {
      let question = payload.question
      let onComplete = payload.onComplete
      let onError = payload.onError
      this.$store.dispatch('reauthenticate')
          .then(() => {
            return deleteQuestion(question.id, this.token)
          })
          .then(() => {
            return this.$store.dispatch('fetchUserQuestions')
          })
          .then(() => {
            return onComplete('Question deleted')
          })
          .catch((error) => onError(error.response.data))
    }
  }
}
</script>

<style scoped>

</style>