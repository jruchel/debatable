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
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "Comment",
  props: ['comment'],
}
</script>

<style scoped>

</style>