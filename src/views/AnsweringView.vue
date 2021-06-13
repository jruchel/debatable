<template>
  <v-container v-if="!loading.page">
    <v-row class="justify-center">
      <v-col cols="12" md="8" xl="6">
        <v-slide-x-transition>
          <v-card>
            <v-card-title class="justify-center" style="height: 100%">{{ getQuestionContent() }}</v-card-title>
          </v-card>
        </v-slide-x-transition>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="6" md="4" xl="3">
        <v-slide-x-transition>
          <Option :user-answer="isUserAnswer(0)" :answer="question.answers[0]"
                  v-on:option-picked="submitAnswerClicked(0)"></Option>
        </v-slide-x-transition>
      </v-col>
      <v-col cols="6" md="4" xl="3">
        <v-slide-x-transition>
          <Option :user-answer="isUserAnswer(1)" :answer="question.answers[1]"
                  v-on:option-picked="submitAnswerClicked(1)"></Option>
        </v-slide-x-transition>
      </v-col>
    </v-row>
    <v-slide-x-transition>
      <v-row class="justify-center" v-if="userAnswer">
        <v-col cols="12" md="8" xl="6">
          <h2 v-if="userAnswer"
              style="text-align: center; color: #191919">
            {{ calculateUserAnswerPercentage(getAnswerCount(0), getAnswerCount(1), userAnswer.count) }}%
            of people answered the same as you
          </h2>
          <v-progress-linear v-if="userAnswer"
                             :background-color="getAnswerColor(1)"
                             :color="getAnswerColor(0)"
                             :value="calculateAnswerRatios(getAnswerCount(0), getAnswerCount(1))"
                             height="15"
                             rounded
          >
          </v-progress-linear>
          <v-row>
            <v-col cols="6">
              <span class="vote-count-left">Votes: {{ getAnswerCount(0) }}</span>
            </v-col>
            <v-col cols="6">
              <span class="vote-count-right">Votes: {{ getAnswerCount(1) }}</span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-slide-x-transition>
    <v-row class="justify-center">
      <v-col cols="12" md="8" xl="6">
        <v-slide-x-transition>
          <v-card :color=$store.getters.getColors.buttonPrimary.name dark @click="getNextQuestion">
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
      <CommentSection v-on:delete-comment="deleteComment" v-if="commentsVisible"></CommentSection>
    </v-fade-transition>
  </v-container>
</template>

<script>
import Option from "@/components/questions/Option";
import CommentSection from "@/components/comments/CommentSection";
import {deleteComment, submitAnswer} from "@/api/api";
import EventBus from "@/event-bus/EventBus";

export default {
  name: "AnsweringView",
  components: {CommentSection, Option},
  mounted() {
    this.$store.dispatch('fetchUserAnswer').then(() => this.loading.page = false)
        .catch((error) => this.showSnackbar(error.response.data))
        .catch(() => this.showSnackbar('Failed to fetch answer'))
  },
  computed: {
    question() {
      return this.$store.getters.getCurrentQuestion
    },
    loggedIn() {
      return this.$store.getters.getLoggedIn
    },
    token() {
      return this.$store.getters.getAuthToken
    },
    commentsVisible() {
      return this.loggedIn.value === false || (!!this.userAnswer && this.answerSubmitted)
    },
    answerSubmitted() {
      return !!this.userAnswer
    },
    userAnswer() {
      return this.$store.getters.getUserAnswer
    }
  },
  data() {
    return {
      loading: {
        page: true,
        nextQuestion: false,
        firstAnswer: false,
        secondAnswer: false
      },
    }
  },
  methods: {
    isUserAnswer(answerNumber) {
      return this.areAnswersEqual(this.question.answers[answerNumber], this.userAnswer)
    },
    areAnswersEqual(answer1, answer2) {
      if (!answer1 || !answer2) {
        return false
      }
      return (answer1.answer === answer2.answer && answer1.color === answer2.color && answer1.count === answer2.count && answer1.id === answer2.id)
    },
    deleteComment(args) {
      deleteComment(args[0].id, this.token)
          .then(() => this.showSnackbar('Comment deleted'))
          .catch(this.showErrorSnackbar)
          .then(args[1])
          .then(() => {
            return this.$store.dispatch('fetchComments')
          })
    },
    submitAnswerClicked(answerNumber) {
      if (this.answerSubmitted) {
        this.showSnackbar('An answer was already submitted')
        return
      }
      if (this.loggedIn.value === false) {
        this.$store.commit('startLoading', this.question.answers[answerNumber].color)
        this.$store.dispatch('updateQuestion')
            .then(() => {
              let userAnswer = this.question.answers[answerNumber]
              userAnswer.count += 1
              this.$store.commit('setUserAnswer', userAnswer)
            })
            .then(() => this.$store.commit('stopLoading'))

      } else this.submitAnswer(answerNumber)
    },
    submitAnswer(answerNumber) {
      this.$store.commit('startLoading', this.question.answers[answerNumber].color)
      this.$store.dispatch('reauthenticate')
          .then(() => {
            return submitAnswer(this.question.id, answerNumber === 0 ? 'first' : 'second', this.token)
          })
          .then(() => this.showSnackbar('Answer submitted'))
          .then(() => {
            if (this.question !== undefined && this.question !== null) {
              return this.$store.dispatch('updateQuestion')
            }
          })
          .then(() => {
            return this.$store.dispatch('fetchUserAnswer')
          })
          .then(() => this.$store.commit('stopLoading'))
          .catch((error) => {
            this.showSnackbar(error.response.data)
            this.$store.commit('stopLoading')
          })
    },
    getAnswerCount(number) {
      return this.question.answers[number].count
    },
    getAnswerColor(number) {
      return this.question.answers[number].color
    },
    getNextQuestion() {
      this.$store.commit('startLoading')
      this.$store.commit('setUserAnswer', undefined)
      return this.$store.dispatch('fetchQuestion')
          .then(this.stopLoading)
          .catch(() => this.showSnackbar('Error downloading questions'))
    },
    stopLoading() {
      this.$store.commit('stopLoading')
    },
    getQuestionContent() {
      return this.question.question
    },
    showSnackbar(text) {
      EventBus.$emit('show-snackbar', text)
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

<style scoped lang="scss">

@mixin vote-count-margin {
  margin: 5px 2px 5px 2px
}

.vote-count-right {
  @include vote-count-margin;
  float: right;
}

.vote-count-left {
  @include vote-count-margin;
  float: left;
}


</style>