<template>
  <v-card :color="this.answer.color" @click="onPick">
    <v-card-title class="justify-center" style="height: 100%">
      {{ this.answer.answer }}
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: "Question",
  props: ['answer'],
  methods: {
    onPick() {
      this.$emit('option-picked', this.answer)
    }
  }
}
</script>

<style scoped>

</style>