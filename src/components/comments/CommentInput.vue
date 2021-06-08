<template>
  <v-container>
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
      this.$emit('show-snackbar', text)
    },
    reauthenticateAndPost() {
      if (this.comment === undefined) {
        this.comment = ''
      }
      this.$refs.form.validate()
      if (this.valid === true) {
        this.loading = true
        return this.$store.dispatch('reauthenticate').then(this.postComment).then(this.resetForm)
      }
    },
    resetForm() {
      this.$refs.form.reset()
      this.comment = ''
    },
    postComment() {
      if (this.comment === null || this.comment === undefined) {
        this.comment = ''
      }
      return postComment(this.question, this.comment, this.token).then(this.notifyCommentPosted)
          .catch(this.notifyError)
          .then(() => {
            return this.$store.dispatch('fetchComments')
          })
    },
    notifyError(error) {
      this.showSnackbar(error.response.data)
      this.comment = ''
      this.loading = false
    },
    notifyCommentPosted() {
      this.showSnackbar('Comment posted')
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>