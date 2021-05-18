<template>
  <v-card :loading="loading" v-if="answer" :color="answer.color" @click="onPick">
    <v-progress-linear slot="progress" indeterminate>
    </v-progress-linear>
    <v-card-title style="height: 100%">
      {{ answer.answer }}
      <v-spacer></v-spacer>
      <v-icon v-if="userAnswer" color="black">
        mdi-account-check-outline
      </v-icon>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: "Option",
  props: ['answer', 'loading', 'userAnswer'],
  methods: {
    onPick() {
      this.$emit('option-picked', this.answer)
    }
  }
}
</script>

<style scoped>

</style>