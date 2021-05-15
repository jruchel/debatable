<template>
  <v-text-field
      append-icon="mdi-send"
      v-model="comment"
      label="Add a comment"
      required
      solo
      clearable
      @click:append="postComment"
  >
    <v-btn>Send</v-btn>
  </v-text-field>
</template>

<script>
import {sendRequest} from "@/utils/requests";

export default {
  name: "CommentInput",
  computed: {
    user() {
      return this.$store.getters.getUser
    },
    question() {
      return this.$store.getters.getCurrentQuestion
    },
    backendAddress() {
      return this.$store.getters.getBackendAddress
    },
    token() {
      return this.$store.getters.getAuthToken
    },
    questionCommentPair() {
      return {key: this.question, value: this.comment}
    }
  },
  data() {
    return {
      comment: ''
    }
  },
  methods: {
    postComment() {
      sendRequest(
          this.backendAddress,
          '/comments',
          'post',
          this.questionCommentPair,
          this.token,
          this.handleResponse,
          this.handleErrorResponse
      )
    },
    handleErrorResponse(response) {
      alert(response.data)
      this.comment = ''
    },
    handleResponse(response) {
      alert(response.data)
    }
  }
}
</script>

<style scoped>

</style>