<template>
  <v-container>
    <v-snackbar
        :color=$store.getters.getColor.snackbar.name
        top
        :style='marginTop()'
        v-model='snackbar.show'
    >
      {{ snackbar.text }}
    </v-snackbar>
    <v-form v-model='valid' ref='form'>
      <v-text-field
          append-icon='mdi-send'
          v-model='comment'
          label='Add a comment'
          solo
          @click:append='reauthenticateAndPost'
          full-width
          :loading=loading
          :rules='rules.comment'
      >
      </v-text-field>
    </v-form>
  </v-container>
</template>

<script>

import {postComment} from '@/api/api';

export default {
  name: 'CommentInput',
  mounted() {
    this.$store.dispatch('fetchComments')
    this.comment = ''
  },
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
      valid: false,
      comment: '',
      snackbar: {show: false, text: 'd00pa'},
      loading: false,
      rules: {
        comment: [
          v => v !== undefined || 'Comment cannot be empty',
          v => v !== null || 'Comment cannot be empty',
          v => !!v || 'Comment cannot be empty',
          v => v !== '' || 'Comment cannot be empty',
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
      this.snackbar.show = false
      this.snackbar.text = text
      this.snackbar.show = true
    },
    reauthenticateAndPost() {
      if (this.comment === undefined) {
        console.log(this.comment)
        this.comment = ''
      }
      this.$refs.form.validate()
      if (this.valid === true) {
        this.$store.dispatch('reauthenticate').then(this.postComment).then(this.resetForm)
      }
    },
    resetForm() {
      this.$refs.form.reset()
      this.comment = ''
    },
    postComment() {
      this.loading = true
      if (this.comment === null || this.comment === undefined) {
        this.comment = ''
      }
      return postComment(this.question, this.comment, this.token).then(this.handleResponse).catch(this.handleErrorResponse).then(this.fetchComments)
    },
    fetchComments() {
      return this.$store.dispatch('fetchComments')
    },
    handleErrorResponse(response) {
      this.showSnackbar(response.data)
      this.comment = ''
      this.loading = false
    },
    handleResponse() {
      this.showSnackbar('Comment posted')
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>