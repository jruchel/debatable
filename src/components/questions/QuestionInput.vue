<template>
  <v-container>
    <v-form v-model='valid' ref='form'>
      <v-row class='justify-center'>
        <v-col cols='12' sm='8' xl='6'>
          <v-card>
            <v-card-title style='height: 100%' class='justify-center'>
              <v-text-field height='100%'
                            v-model='question.question'
                            label='Question'
                            required
                            :rules='rules.question'
              ></v-text-field>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
      <v-row class='justify-center' v-if='isMobile()'>
        <v-col cols='6' sm='4' xl='3'>
          <v-card :color='question.answers[0].color'>
            <v-card-title>
              <v-text-field
                  v-model='question.answers[0].answer'
                  label='First option'
                  required
                  :rules='rules.firstAnswer'
              ></v-text-field>
            </v-card-title>
          </v-card>
        </v-col>
        <v-col cols='6' sm='4' xl='3'>
          <v-card :color='question.answers[1].color'>
            <v-card-title>
              <v-text-field
                  v-model='question.answers[1].answer'
                  label='Second option'
                  required
                  :rules='rules.secondAnswer'
              ></v-text-field>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
      <v-row class='justify-center' v-if='isMobile()'>
        <v-col cols='6' sm='4' xl='1'>
          <v-select
              :color='question.answers[0].color'
              v-model='question.answers[0].color'
              :items='colors'
              label='Color'
              solo
          ></v-select>
        </v-col>
        <v-spacer v-if="this.$vuetify.breakpoint.name === 'xs'"></v-spacer>
        <v-col cols='6' sm='4' xl='1'>
          <v-select
              :color='question.answers[1].color'
              v-model='question.answers[1].color'
              :items='colors'
              label='Color'
              solo
          ></v-select>
        </v-col>
      </v-row>
      <v-row class='justify-center' v-if='!isMobile()'>
        <v-col cols='2' xl='1'>
          <v-select
              :color='question.answers[0].color'
              v-model='question.answers[0].color'
              :items='colors'
              label='Color'
              solo
          ></v-select>
        </v-col>
        <v-col cols='4' xl='3'>
          <v-card :color='question.answers[0].color'>
            <v-card-title>
              <v-text-field
                  v-model='question.answers[0].answer'
                  label='First option'
                  required
                  :rules='rules.firstAnswer'
              ></v-text-field>
            </v-card-title>
          </v-card>
        </v-col>
        <v-col cols='4' xl='3'>
          <v-card :color='question.answers[1].color'>
            <v-card-title>
              <v-text-field
                  v-model='question.answers[1].answer'
                  label='Second option'
                  required
                  :rules='rules.secondAnswer'
              ></v-text-field>
            </v-card-title>
          </v-card>
        </v-col>
        <v-col cols='2' xl='1'>
          <v-select
              :color='question.answers[1].color'
              v-model='question.answers[1].color'
              :items='colors'
              label='Color'
              solo
          ></v-select>
        </v-col>
      </v-row>
      <v-row class='justify-center'>
        <v-col cols='8' xl='6'>
          <v-card @click='reauthenticateAndPost' :color=$store.getters.getColors.buttonPrimary.name dark>
            <template slot='progress'>
              <v-progress-linear
                  color='green'
                  height='5'
                  indeterminate
              ></v-progress-linear>
            </template>
            <v-card-title class='justify-center'>
              Post question
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
      <v-row class='justify-center'>
        <v-col cols='6' md='3' xl='2'>
          <v-card @click='reset' :color=$store.getters.getColors.buttonSecondary.name dark>
            <v-card-title style='height: 100%' class='justify-center'>
              <span>Reset</span>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import {postQuestion, postTrialQuestion} from '@/api/api';
import EventBus from "@/event-bus/EventBus";

export default {
  name: 'QuestionInput',
  computed: {
    authToken() {
      return this.$store.getters.getAuthToken
    }
  },
  data() {
    return {
      valid: false,
      question: {
        question: '',
        answers: [
          {
            color: 'blue',
            answer: ''
          },
          {
            color: 'red',
            answer: ''
          }
        ]
      },
      colors: ['red', 'blue', 'green', 'grey', 'white'],
      postingQuestion: false,
      rules: {
        question: [
          v => !!v || 'Question is required',
          v => v !== '' || 'Question is required',
          v => v.trim() !== '' || 'Question is required',
        ],
        firstAnswer: [
          v => !!v || 'First answer is required',
          v => v !== '' || 'First answer is required',
          v => v.trim() !== '' || 'First answer is required',
        ],
        secondAnswer: [
          v => !!v || 'Second answer is required',
          v => v !== '' || 'Second answer is required',
          v => v.trim() !== '' || 'Second answer is required',
        ]

      }
    }
  },
  methods: {
    marginTop() {
      if (this.isMobile()) {
        return 'margin-top: 15%'
      }
      return 'margin-top: 2%'
    },
    isMobile() {
      return /xs|sm/i.test(this.$vuetify.breakpoint.name)
    },
    showSnackbar(text) {
      EventBus.$emit('show-snackbar', text)
    },
    reauthenticateAndPost() {
      this.$store.commit('startLoading')
      this.postQuestion()
    },
    postQuestion() {
      this.$refs.form.validate()
      if (this.valid) {
        if (this.$store.getters.getLoggedIn.value === true) {
          this.$store.dispatch('reauthenticate').then(this.postQuestionToUser)
        } else {
          this.postTrialQuestion()
        }
      } else {
        this.$store.commit('stopLoading')
      }
    },
    postTrialQuestion() {
      return postTrialQuestion(this.question).then(this.handleSuccessResponse).catch(this.handleErrorResponse)
    },
    postQuestionToUser() {
      return postQuestion(this.question, this.authToken).then(this.handleSuccessResponse).catch(this.handleErrorResponse)
          .then(() => this.$store.commit('stopLoading')).then(() => {
            return this.$store.dispatch('fetchUserQuestions')
          })
    },
    handleErrorResponse(error) {
      this.showSnackbar(error.response.data)
    },
    handleSuccessResponse() {
      this.showSnackbar('Question added!')
      this.reset()
    },
    reset() {
      this.$refs.form.resetValidation()
      this.question.question = ''
      this.question.answers[0].answer = ''
      this.question.answers[1].answer = ''
      this.question.answers[0].color = 'blue'
      this.question.answers[1].color = 'red'
    }
  }
}
</script>

<style scoped>

</style>