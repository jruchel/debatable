<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="12" lg="6">
        <v-slide-x-transition>
          <v-card>
            <v-card-title class="justify-center" style="height: 100%">{{ this.question }}</v-card-title>
          </v-card>
        </v-slide-x-transition>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="6" lg="3">
        <v-slide-x-transition>
          <Option :answer="firstAnswer" v-on:option-picked="handleAnswer"></Option>
        </v-slide-x-transition>
      </v-col>
      <v-col cols="6" lg="3">
        <v-slide-x-transition>
          <Option :answer="secondAnswer" v-on:option-picked="handleAnswer"></Option>
        </v-slide-x-transition>
      </v-col>
    </v-row>
    <v-slide-x-transition>
      <v-row class="justify-center" v-if="showResults">
        <v-col cols="12" lg="6">
          <h2 style="text-align: center; color: white">
            {{ calculateUserAnswerPercentage(firstAnswer.count, secondAnswer.count, userAnswer.count) }}% of people
            agree
            with you!</h2>
          <v-progress-linear
              :background-color="this.secondAnswer.color"
              :color="this.firstAnswer.color"
              :value="this.calculateAnswerRatios(firstAnswer.count, secondAnswer.count)"
              height="15"
          >
          </v-progress-linear>
        </v-col>
      </v-row>
    </v-slide-x-transition>

    <v-row class="justify-center">
      <v-col cols="12" lg="6">
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
  name: "QuestionView",
  components: {Option},
  mounted() {
    this.ready = true
  },
  data() {
    return {
      question: "Pepsi or Coke?",
      firstAnswer: {answer: "Pepsi", color: "blue", count: 10},
      secondAnswer: {answer: "Coke", color: "red", count: 20},
      userAnswer: null,
      showResults: false,
    }
  },
  methods: {
    nextQuestion() {
      this.showResults = false
      this.ready = false
      this.getRandomQuestion()
    },
    getRandomQuestion() {
      this.ready = true
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