<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="8" xl="6">
        <v-card>
          <v-snackbar
              top
              style="margin-top: 2%"
              v-model="snackbar.show"
              color="blue-grey darken-2"
              timeout="3500"
          >
            {{ snackbar.text }}
          </v-snackbar>
          <v-card-title style="height: 100%" class="justify-center">
            <v-text-field height="100%"
                          v-model="question.question"
                          label="Question"
                          required
            ></v-text-field>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="2" xl="1">
        <v-select
            :color="question.answers[0].color"
            v-model="question.answers[0].color"
            :items="colors"
            label="Color"
            solo
        ></v-select>
      </v-col>
      <v-col cols="4" xl="3">
        <v-card :color="question.answers[0].color">
          <v-card-title>
            <v-text-field
                v-model="question.answers[0].content"
                label="First option"
                required
            ></v-text-field>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="4" xl="3">
        <v-card :color="question.answers[1].color">
          <v-card-title>
            <v-text-field
                v-model="question.answers[1].content"
                label="Second option"
                required
            ></v-text-field>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="2" xl="1">
        <v-select
            :color="question.answers[1].color"
            v-model="question.answers[1].color"
            :items="colors"
            label="Color"
            solo
        ></v-select>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="8" xl="6">
        <v-card @click="postQuestion" color="blue-grey darken-3" dark>
          <v-card-title class="justify-center">
            Post question
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="3" xl="2">
        <v-card @click="reset" color="blue-grey darken-1" dark>
          <v-card-title style="height: 100%" class="justify-center">
            <span>Reset</span>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "QuestionInput",
  computed: {
    backendAddress() {
      return this.$store.getters.getBackendAddress
    },
    authToken() {
      return this.$store.getters.getAuthToken
    }
  },
  data() {
    return {
      question: {
        question: "",
        commentCount: 0,
        answers: [
          {
            color: 'blue',
            content: ''
          },
          {
            color: 'red',
            content: ''
          }
        ]
      },
      snackbar: {show: false, text: "d00pa"},
      colors: ['red', 'blue', 'green', 'grey', 'white']
    }
  },
  methods: {
    showSnackbar(text) {
      this.snackbar.show = false
      this.snackbar.text = text
      this.snackbar.show = true
    },
    postQuestion: function () {
      let actualHeaders = {}
      actualHeaders['Content-Type'] = 'application/json'
      actualHeaders['token'] = this.authToken.token
      console.log(actualHeaders)
      axios({
        method: 'post',
        url: this.backendAddress + '/questions',
        headers: actualHeaders,
        data: this.question
      }).then(response => {
        this.handleResponse(response.data)
      }).catch(error => {
        this.handleResponse(error)
      })

    },
    handleResponse(response) {
      if (response.question === this.question.question) {
        this.showSnackbar('Question added!')
        this.reset()
      } else {
        this.showSnackbar(response)
      }
    },
    reset: function () {
      this.question.question = ''
      this.question.answers[0].content = ''
      this.question.answers[0].color = 'blue'
      this.question.answers[1].content = ''
      this.question.answers[1].color = 'red'
    }
  }
}
</script>

<style scoped>

</style>