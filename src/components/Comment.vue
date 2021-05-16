<template>
  <v-card>
    <v-card-title>
      {{ comment.user.username }}
      <v-spacer></v-spacer>
      {{ comment.date }}
    </v-card-title>
    <v-card-text>
      {{ comment.content }}
    </v-card-text>
    <v-card-actions>
      <v-btn icon>
        <v-icon>
          mdi-thumb-up
        </v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>
          mdi-thumb-down
        </v-icon>
      </v-btn>
      <v-spacer>
      </v-spacer>
      <v-btn v-if="isCurrentUsers" icon @click="emitDeleteEvent" :loading="loading">
        <v-icon color="red" size="300%">
          mdi-close-circle-outline
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "Comment",
  props: ['comment'],
  computed: {
    user() {
      return this.$store.getters.getUser
    },
    isCurrentUsers() {
      if(!this.user) return false
      return this.user.email === this.comment.user.email
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    emitDeleteEvent() {
      this.loading = true
      this.$emit('delete-comment', [this.comment, this.finishLoading])
    },
    finishLoading() {
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>