<template>
  <v-container style="margin-top: 200px">
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
          <Option :answer="question.answers[0]" v-on:option-picked="handleAnswer"></Option>
        </v-slide-x-transition>
      </v-col>
      <v-col cols="6" xl="3">
        <v-slide-x-transition>
          <Option :answer="question.answers[1]" v-on:option-picked="handleAnswer"></Option>
        </v-slide-x-transition>
      </v-col>
    </v-row>
    <v-slide-x-transition>
      <v-row class="justify-center" v-if="showResults">
        <v-col cols="12" xl="6">
          <h2 v-if="question.answers[0].count > 0 || question.answers[1].color > 0"
              style="text-align: center; color: #191919">
            {{
              calculateUserAnswerPercentage(getAnswerCount(0), getAnswerCount(1), userAnswer.count)
            }}% of people
            agree
            with you!</h2>
          <v-progress-linear v-if="question.answers[0].count > 0 || question.answers[1].color > 0"
                             :background-color="getAnswerColor(1)"
                             :color="getAnswerColor(0)"
                             :value="calculateAnswerRatios(getAnswerCount(0), getAnswerCount(1))"
                             height="15"
          >
          </v-progress-linear>
          <h2 v-if="!(question.answers[0].count > 0 || question.answers[1].color > 0)"
              style="text-align: center; color: #191919">No results to show, your answer was the first one!</h2>
        </v-col>
      </v-row>
    </v-slide-x-transition>
    <v-row class="justify-center">
      <v-col cols="12" xl="6">
        <v-slide-x-transition>
          <v-card color="blue-grey darken-3" dark @click="nextQuestion" :loading="loadingNextQuestion">
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
      <CommentSection v-if="showResults" :comments="comments"></CommentSection>
    </v-fade-transition>
  </v-container>
</template>

<script>
import Option from "@/components/Option";
import CommentSection from "@/components/CommentSection";

export default {
  name: "AnsweringView",
  components: {CommentSection, Option},
  computed: {
    question() {
      return this.$store.getters.getCurrentQuestion
    },
    comments() {
      return this.$store.getters.getComments
    }
  },
  data() {
    return {
      userAnswer: null,
      showResults: false,
      loadingNextQuestion: false
    }
  },
  methods: {
    getAnswerCount(number) {
      return this.question.answers[number].count
    },
    getAnswerColor(number) {
      return this.question.answers[number].color
    },
    nextQuestion() {
      this.loadingNextQuestion = true
      this.showResults = false
      this.$store.dispatch('fetchQuestion').then(this.stopLoading).then(this.fetchComments).then(this.printComments)

    },
    printComments() {
    },
    fetchComments() {
      return this.$store.dispatch('fetchComments')
    },
    stopLoading() {
      this.loadingNextQuestion = false
    },
    getQuestionContent() {
      return this.question.question
    },
    handleAnswer(answer) {
      this.userAnswer = answer
      this.showResults = true
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