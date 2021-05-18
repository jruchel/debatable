<template>
  <v-card :loading="loading" v-if="answer" :color="answer.color" @click="onPick">
    <v-progress-linear slot="progress" indeterminate>
    </v-progress-linear>
    <v-card-title class="justify-center" style="height: 100%">
      {{ answer.answer }}
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: "Option",
  props: ['answer', 'loading'],
  methods: {
    onPick() {
      this.$emit('option-picked', this.answer)
    }
  }
}
</script>

<style scoped>

</style>