<template>
  <v-card :color="comment.color" @mouseenter="mouseInside = true" @mouseleave="mouseInside = false">
    <v-card-title>
      {{ comment.user.username }}
      <v-spacer></v-spacer>
      {{ comment.date }}
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <span style="color: black">{{ comment.content }}</span>
    </v-card-text>
    <v-card-actions>
      <v-container v-if="actions.general">
        <rating color="black" icon="mdi-emoticon-outline" badge-color="green" count="6" tooltip-text="Wise"></rating>
        <rating color="black" icon="mdi-emoticon-outline" badge-color="red" count="6"
                tooltip-text="Provocative"></rating>
        <rating color="black" icon="mdi-emoticon-outline" badge-color="blue" count="6" tooltip-text="Funny"></rating>
      </v-container>
      <v-spacer></v-spacer>
      <v-container v-if="actions.currentUsers">
        <v-btn v-if="isCurrentUsers" icon @click="handleDelete" :loading="loading" style="float: right">
          <v-icon color="black" size="300%">
            mdi-close-circle-outline
          </v-icon>
        </v-btn>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script>
import Rating from "@/components/comments/Rating";

export default {
  name: "Comment",
  components: {Rating},
  props: ['comment'],
  computed: {
    user() {
      return this.$store.getters.getUser
    },
    loggedIn() {
      return this.$store.getters.getLoggedIn
    },
    isCurrentUsers() {
      if (this.loggedIn === false) return false
      if (!this.user) return false
      return this.user.email === this.comment.user.email
    },
    actions() {
      return {currentUsers: this.isCurrentUsers, general: this.loggedIn}
    },
  },
  data() {
    return {
      ratings: {},
      mouseInside: false,
      loading: false
    }
  },
  methods: {
    handleDelete() {
      this.loading = true
      this.$store.dispatch('reauthenticate').then(this.emitDeleteEvent)
    },
    emitDeleteEvent() {
      this.$emit('delete-comment', [this.comment, this.finishLoading])
    },
    finishLoading() {
      this.loading = false
    }
  }
}
</script>

<style scoped>

.rating {
  margin: 0 5px 5px 0;
}


</style>

