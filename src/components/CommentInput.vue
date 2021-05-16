<template>
  <v-container>
    <v-snackbar
        :color=$store.getters.getColor.snackbar.name
        top
        :style="marginTop()"
        v-model="snackbar.show"
    >
      {{ snackbar.text }}
    </v-snackbar>
    <v-text-field
        append-icon="mdi-send"
        v-model="comment"
        label="Add a comment"
        required
        solo
        clearable
        @click:append="postComment"
        full-width
    >
    </v-text-field>
  </v-container>
</template>

<script>

import {postComment} from "@/api/api";

export default {
  name: "CommentInput",
  computed: {
    user() {
      return this.$store.getters.getUser
    },
    question() {
      return this.$store.getters.getCurrentQuestion
    },
    token() {
      return this.$store.getters.getAuthToken
    },
  },
  data() {
    return {
      comment: '',
      snackbar: {show: false, text: "d00pa"},
    }
  },
  methods: {
    marginTop() {
      if (this.isMobile()) {
        return "margin-top: 15%"
      }
      return "margin-top: 2%"
    },
    isMobile() {
      return /xs|sm/i.test(this.$vuetify.breakpoint.name)
    },
    showSnackbar(text) {
      this.snackbar.show = false
      this.snackbar.text = text
      this.snackbar.show = true
    },
    postComment() {
      postComment(this.question, this.comment, this.token, this.handleResponse, this.handleErrorResponse).then(this.fetchComments)
    },
    fetchComments() {
      this.$store.dispatch('fetchComments')
    },
    handleErrorResponse(response) {
      this.showSnackbar(response.data)
      this.comment = ''
    },
    handleResponse(response) {
      this.showSnackbar(response.data)
    }
  }
}
</script>

<style scoped>

</style>