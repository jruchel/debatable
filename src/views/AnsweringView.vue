<template>
  <v-container>
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
          <Option :answer="question.firstAnswer" v-on:option-picked="handleAnswer"></Option>
        </v-slide-x-transition>
      </v-col>
      <v-col cols="6" xl="3">
        <v-slide-x-transition>
          <Option :answer="question.secondAnswer" v-on:option-picked="handleAnswer"></Option>
        </v-slide-x-transition>
      </v-col>
    </v-row>
    <v-slide-x-transition>
      <v-row class="justify-center" v-if="showResults">
        <v-col cols="12" xl="6">
          <h2 style="text-align: center; color: #191919">
            {{
              calculateUserAnswerPercentage(question.firstAnswer.count, question.secondAnswer.count, userAnswer.count)
            }}% of people
            agree
            with you!</h2>
          <v-progress-linear
              :background-color="this.secondAnswer.color"
              :color="this.firstAnswer.color"
              :value="this.calculateAnswerRatios(question.firstAnswer.count, question.secondAnswer.count)"
              height="15"
          >
          </v-progress-linear>
        </v-col>
      </v-row>
    </v-slide-x-transition>
    <v-row class="justify-center">
      <v-col cols="12" xl="6">
        <v-slide-x-transition>
          <v-card color="red" @click="nextQuestion">
            <v-card-title class="justify-center" style="height: 100%">
              Next
            </v-card-title>
          </v-card>
        </v-slide-x-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Option from "@/components/Option";

export default {
  name: "AnsweringView",
  components: {Option},
  mounted() {
    this.question = this.$store.getters.getCurrentQuestion
  },
  data() {
    return {
      userAnswer: null,
      showResults: false,
      question: Object
    }
  },
  methods: {
    nextQuestion() {
      this.$store.dispatch('fetchQuestion')
    },
    getQuestionContent() {
      return this.question.question
    },
    handleAnswer(answer) {
      this.userAnswer = answer
      this.showResults = true
    },
    calculateUserAnswerPercentage(first, second, user) {
      return Math.ceil(user / (first + second) * 100)
    },
    calculateAnswerRatios(first, second) {
      return first / (first + second) * 100
    }
  }
}
</script>

<style scoped>

</style>