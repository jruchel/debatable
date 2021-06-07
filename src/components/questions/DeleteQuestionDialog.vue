<template>
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
      <v-card-title :style="dialogTitleBackground" style="color: white">Delete this question?
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <br>
        Once this question is deleted all the answers and comments
        will be lost forever.
        <br>Are you sure you want to proceed?
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
</template>

<script>
import EventBus from "@/event-bus/EventBus";

export default {
  name: "DeleteQuestionDialog",
  props: ['question'],
  computed: {
    dialogWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '100%'
        case 'sm':
          return '100%'
        case 'md':
          return '60%'
        default:
          return '30%'
      }
    },
    dialogTitleColor() {
      return this.$store.getters.getColors.primary
    },
    dialogTitleBackground() {
      return 'background-color: ' + this.dialogTitleColor.hex + ';'
    },
  },
  data() {
    return {
      dialog: false,
      loading: {
        delete: false
      },
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
  }
}
</script>

<style scoped>

</style>