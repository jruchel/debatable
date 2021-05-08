<template>
  <v-card v-if="answer" :color="answer.color" @click="onPick">
    <v-card-title class="justify-center" style="height: 100%">
      {{ answer.content }}
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: "Option",
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