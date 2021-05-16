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
        @click:append="reauthenticateAndPost"
        full-width
        :loading=loading
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
      loading: false
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
    reauthenticateAndPost() {
      this.$store.dispatch('reauthenticate').then(this.postComment)
    },
    postComment() {
      this.loading = true
      if (this.comment === null || this.comment === undefined) {
        this.comment = ''
      }
      postComment(this.question, this.comment, this.token, this.handleResponse, this.handleErrorResponse).then(this.fetchComments)
    },
    fetchComments() {
      this.$store.dispatch('fetchComments')
    },
    handleErrorResponse(response) {
      this.showSnackbar(response.data)
      this.comment = ''
      this.loading = false
    },
    handleResponse() {
      this.showSnackbar('Comment added')
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>