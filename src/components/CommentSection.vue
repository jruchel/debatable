<template>
  <v-container>
    <v-row class="justify-center" v-if="loggedIn.value === true">
      <v-col cols="12" lg="6">
        <CommentInput></CommentInput>
      </v-col>
    </v-row>
    <v-row v-for="comment in comments" :key="comment.id" class="justify-center">
      <v-col cols="12" lg="6">
        <v-slide-x-transition>
          <Comment :comment="comment" v-on:delete-comment="deleteComment"></Comment>
        </v-slide-x-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Comment from "@/components/Comment";
import CommentInput from "@/components/CommentInput";

export default {
  name: "CommentSection",
  components: {CommentInput, Comment},
  props: ['comments'],
  computed: {
    loggedIn() {
      return this.$store.getters.getLoggedIn
    },
    token() {
      return this.$store.getters.getAuthToken
    }
  },
  methods: {
    deleteComment(comment) {
      this.$emit('delete-comment', comment)
    }
  }
}
</script>

<style scoped>

</style>