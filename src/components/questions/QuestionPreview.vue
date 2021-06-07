<template>
  <v-container style="padding-left: 0; padding-right: 0">
    <v-row class="justify-center">
      <v-col cols="12">
        <v-sheet color="#9e9d9d" style="border-radius: 12px">
          <v-container>
            <v-row>
              <v-col cols="8">
                <span>Total answers: {{ question.answers[0].count + question.answers[1].count }}</span>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="1">
                <delete-question-dialog :question="question"
                                        v-on:delete-question="passDeleteEvent"></delete-question-dialog>
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
                <question-preview-answer style="height: 100%" :answer="question.answers[0]"></question-preview-answer>
              </v-col>
              <v-col cols="6">
                <question-preview-answer style="height: 100%" :answer="question.answers[1]"></question-preview-answer>
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
import DeleteQuestionDialog from "@/components/questions/DeleteQuestionDialog";

export default {
  name: "QuestionPreview",
  components: {DeleteQuestionDialog, QuestionPreviewAnswer},
  props: ['question'],
  computed: {
    colors() {
      return this.$store.getters.getColors
    }
  },
  methods: {
    passDeleteEvent(args) {
      this.$emit('delete-question', args)
    },
  },
}
</script>

<style scoped>

</style>