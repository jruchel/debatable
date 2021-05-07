<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="8" xl="6">
        <v-card>
          <v-card-title style="height: 100%" class="justify-center">
            <v-text-field height="100%"
                          v-model="question"
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
            :color="firstAnswer.color"
            v-model="firstAnswer.color"
            :items="colors"
            label="Color"
            solo
        ></v-select>
      </v-col>
      <v-col cols="4" xl="3">
        <v-card :color="firstAnswer.color">
          <v-card-title>
            <v-text-field
                v-model="firstAnswer.content"
                label="First option"
                required
            ></v-text-field>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="4" xl="3">
        <v-card :color="secondAnswer.color">
          <v-card-title>
            <v-text-field
                v-model="secondAnswer.content"
                label="Second option"
                required
            ></v-text-field>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="2" xl="1">
        <v-select
            :color="secondAnswer.color"
            v-model="secondAnswer.color"
            :items="colors"
            label="Color"
            solo
        ></v-select>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="8" xl="6">
        <v-card @click="postQuestion">
          <v-card-title class="justify-center">
            Post question
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="3" xl="2">
        <v-card @click="reset">
          <v-card-title style="height: 100%" class="justify-center">
            <span>Reset</span>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "QuestionInput",
  data() {
    return {
      question: '',
      firstAnswer: {content: '', color: 'red'},
      secondAnswer: {content: '', color: 'blue'},
      colors: ['red', 'blue', 'green', 'grey', 'white']
    }
  },
  methods: {
    postQuestion: function () {

    },
    reset: function () {
      this.question = ''
      this.firstAnswer.content = ''
      this.firstAnswer.color = 'red'
      this.secondAnswer.content = ''
      this.second.color = 'blue'
    }
  }
}
</script>

<style scoped>

</style>