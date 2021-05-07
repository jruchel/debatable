<template>
  <v-btn icon @click="goBack">
    <v-icon>
      mdi-arrow-left
    </v-icon>
  </v-btn>
</template>

<script>
import router from "@/router";

export default {
  name: "Return",
  methods: {
    goBack: function () {
      router.go(-1)
    }
  }
}
</script>

<style scoped>

</style>