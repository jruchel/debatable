<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="8">
        <v-sheet color="#9e9d9d" rounded>
          <v-container>
            <v-row>
              <v-col cols="4">
                <span>Total answers: {{ question.answers[0].count + question.answers[1].count }}</span>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="1">
                <v-dialog :width="dialogWidth" v-model="dialog">
                  <template v-slot:activator="{on, attrs}">
                    <v-btn
                        :loading="loading.delete === true"
                        v-bind="attrs"
                        v-on="on"
                        icon style="float: right">
                      <v-icon size="40" color="black">
                        mdi-close-circle-outline
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title :style="dialogTitleBackground" style="color: white">Are you sure you want to delete
                      this question?
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                      <br>
                      Once this question is deleted all the answers and comments
                      will be lost forever.
                      <br><br>Are you sure you want to proceed?
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn text outlined rounded color="green lighten-1"
                             @click="questionDeletionConfirmed">Yes
                      </v-btn>
                      <v-btn text outlined rounded color="red lighten-1" @click="dialog = false">No</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-card>
                  <v-card-title class="justify-center">{{ question.question }}</v-card-title>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <question-preview-answer :answer="question.answers[0]"></question-preview-answer>
              </v-col>
              <v-col cols="6">
                <question-preview-answer :answer="question.answers[1]"></question-preview-answer>
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import QuestionPreviewAnswer from "@/components/questions/QuestionPreviewAnswer";
import EventBus from "@/event-bus/EventBus";

export default {
  name: "QuestionPreview",
  components: {QuestionPreviewAnswer},
  props: ['question'],
  computed: {
    dialogTitleColor() {
      return this.$store.getters.getColors.primary
    },
    dialogTitleBackground() {
      return 'background-color: ' + this.dialogTitleColor.hex + ';'
    },
    isMobile() {
      return /xs|sm/i.test(this.$vuetify.breakpoint.name)
    },
    dialogWidth() {
      if (this.isMobile) return '100%'
      return '30%'
    },
    colors() {
      return this.$store.getters.getColors
    }
  },
  methods: {
    onComplete(response) {
      EventBus.$emit('show-snackbar', response)
      this.loading.delete = false
    },
    questionDeletionConfirmed() {
      this.loading.delete = true
      this.$emit('delete-question', {
        question: this.question,
        onComplete: this.onComplete,
        onError: this.onComplete
      })
      this.dialog = false
    },
  },
  data() {
    return {
      loading: {
        delete: false
      },
      dialog: false
    }
  }
}
</script>

<style scoped>

</style>