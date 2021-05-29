<template>
  <v-container>
    <v-row class="justify-center" v-if="loggedIn.value === true">
      <v-col cols="12" lg="6">
        <CommentInput></CommentInput>
      </v-col>
    </v-row>
    <v-row v-for="comment in comments.content" :key="comment.id" class="justify-center">
      <v-col cols="12" lg="6">
        <v-slide-x-transition>
          <Comment :comment="comment" v-on:delete-comment="deleteComment"></Comment>
        </v-slide-x-transition>
      </v-col>
    </v-row>
    <v-row class="justify-center" v-if="comments.last === false">
      <v-col cols="12" lg="6" style="text-align: center">
        <span v-if="loading.comments === false" @click="loadMoreComments">Show more comments</span>
        <v-progress-circular
            v-if="loading.comments === true"
            indeterminate
            color="black"
        ></v-progress-circular>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Comment from "@/components/comments/Comment";
import CommentInput from "@/components/comments/CommentInput";
import {getCommentsPage} from "@/api/api";

export default {
  name: "CommentSection",
  components: {CommentInput, Comment},
  data() {
    return {
      loading: {comments: false}
    }
  },
  computed: {
    question() {
      return this.$store.getters.getCurrentQuestion
    },
    comments() {
      return this.$store.getters.getComments
    },
    loggedIn() {
      return this.$store.getters.getLoggedIn
    },
    token() {
      return this.$store.getters.getAuthToken
    }
  },
  methods: {
    loadMoreComments() {
      this.loading.comments = true
      getCommentsPage(this.question.id, 1, this.comments.size + 5).then((response) => {
        this.$store.commit('setComments', response.data)
      }).catch(() => {
        alert('Failure loading comments')
      }).then(() => this.loading.comments = false)
    },
    deleteComment(comment) {
      this.$emit('delete-comment', comment)
    }
  }
}
</script>

<style scoped>

</style>