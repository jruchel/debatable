<template>
  <v-container style="margin-top: 200px">
    <v-snackbar
        v-if="snackbar.show"
        top
        :style="marginTop"
        v-model="snackbar.show"
        :color=$store.getters.getColor.snackbar.name
        timeout="3500"
    >
      {{ snackbar.text }}
    </v-snackbar>
    <v-row class="justify-center">
      <v-col cols="12" xl="6">
        <v-slide-x-transition>
          <v-card>
            <v-card-title class="justify-center" style="height: 100%">{{ getQuestionContent() }}</v-card-title>
          </v-card>
        </v-slide-x-transition>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="6" xl="3">
        <v-slide-x-transition>
          <Option :loading="loading.firstAnswer" :answer="question.answers[0]"
                  v-on:option-picked="submitAnswer(0)"></Option>
        </v-slide-x-transition>
      </v-col>
      <v-col cols="6" xl="3">
        <v-slide-x-transition>
          <Option :loading="loading.secondAnswer" :answer="question.answers[1]"
                  v-on:option-picked="submitAnswer(1)"></Option>
        </v-slide-x-transition>
      </v-col>
    </v-row>
    <v-slide-x-transition>
      <v-row class="justify-center" v-if="userAnswer">
        <v-col cols="12" xl="6">
          <h2 v-if="userAnswer"
              style="text-align: center; color: #191919">
            {{
              calculateUserAnswerPercentage(getAnswerCount(0), getAnswerCount(1), userAnswer.count)
            }}% of people
            agree
            with you!</h2>
          <v-progress-linear v-if="userAnswer"
                             :background-color="getAnswerColor(1)"
                             :color="getAnswerColor(0)"
                             :value="calculateAnswerRatios(getAnswerCount(0), getAnswerCount(1))"
                             height="15"
          >
          </v-progress-linear>
        </v-col>
      </v-row>
    </v-slide-x-transition>
    <v-row class="justify-center">
      <v-col cols="12" xl="6">
        <v-slide-x-transition>
          <v-card :color=$store.getters.getColor.buttonPrimary.name dark @click="getNextQuestion"
                  :loading="loading.nextQuestion">
            <template slot="progress">
              <v-progress-linear
                  color="green"
                  height="5"
                  indeterminate
              ></v-progress-linear>
            </template>
            <v-card-title class="justify-center" style="height: 100%">
              Next
            </v-card-title>
          </v-card>
        </v-slide-x-transition>
      </v-col>
    </v-row>
    <v-spacer></v-spacer>
    <v-fade-transition>
      <CommentSection v-on:delete-comment="deleteComment" v-if="userAnswer" :comments="comments"></CommentSection>
    </v-fade-transition>
  </v-container>
</template>

<script>
import Option from "@/components/questions/Option";
import CommentSection from "@/components/comments/CommentSection";
import {deleteComment, submitAnswer} from "@/api/api";

export default {
  name: "AnsweringView",
  components: {CommentSection, Option},
  computed: {
    marginTop() {
      if (this.isMobile) {
        return "margin-top: 15%"
      }
      return "margin-top: 0%"
    },
    isMobile() {
      return /xs|sm/i.test(this.$vuetify.breakpoint.name)
    },
    question() {
      return this.$store.getters.getCurrentQuestion
    },
    comments() {
      return this.$store.getters.getComments
    },
    token() {
      return this.$store.getters.getAuthToken
    },
    userAnswer() {
      return this.$store.getters.getUserAnswer
    }
  },
  mounted() {
    this.$store.dispatch('fetchQuestion')
  },
  data() {
    return {
      loading: {
        nextQuestion: false,
        firstAnswer: false,
        secondAnswer: false
      },
      snackbar: {show: false, text: "d00pa"}
    }
  },
  methods: {
    deleteComment(args) {
      deleteComment(args[0], this.token)
          .then(() => this.showSnackbar('Comment deleted'))
          .catch(this.showErrorSnackbar)
          .then(args[1])
    },
    submitAnswer(answerNumber) {
      if (answerNumber === 0) {
        this.loading.firstAnswer = true
      } else {
        this.loading.secondAnswer = true
      }
      this.$store.dispatch('reauthenticate')
          .then(() => submitAnswer(this.question, answerNumber, this.token)
              .then(() => this.showSnackbar('Answer submitted'))
              .then(() => this.$store.dispatch('updateQuestion'))
              .then(() => {
                this.loading.firstAnswer = false
                this.loading.secondAnswer = false
              }).catch((error) => {
                this.showSnackbar(error.response.data)
                this.loading.firstAnswer = false
                this.loading.secondAnswer = false
              }))
    },
    getAnswerCount(number) {
      return this.question.answers[number].count
    },
    getAnswerColor(number) {
      return this.question.answers[number].color
    },
    getNextQuestion() {
      this.loading.nextQuestion = true
      this.$store.dispatch('fetchQuestion')
          .then(this.stopLoading)
          .catch(() => this.showSnackbar('Error downloading questions'))
    },
    stopLoading() {
      this.loading.nextQuestion = false
    },
    getQuestionContent() {
      return this.question.question
    },
    showSnackbar(text) {
      this.snackbar.show = false
      this.snackbar.text = text
      this.snackbar.show = true
    },
    showErrorSnackbar(response) {
      this.showSnackbar(response.data)
    },
    calculateUserAnswerPercentage(first, second, user) {
      let result = Math.ceil(user / (first + second) * 100)
      if (result === Infinity || isNaN(result)) {
        return 0
      }
      return result
    },
    calculateAnswerRatios(first, second) {
      let result = first / (first + second) * 100
      if (isNaN(result) || result === Infinity) {
        return 0
      }
      return result
    }
  }
}
</script>

<style scoped>

</style>