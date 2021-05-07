<template>
  <v-container class="justify-center">
    <v-row class="justify-center">
      <v-col cols="6" class="justify-center">
        <v-slide-x-transition>
          <v-card class="justify-center">
            <v-card-title class="justify-center">What do you want to do?</v-card-title>
          </v-card>
        </v-slide-x-transition>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="3">
        <v-card @click="changeRoutes('/answer')">
          <v-card-title class="justify-center">
            Answer
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card @click="changeRoutes('/ask')">
          <v-card-title class="justify-center">
            Ask
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import router from "@/router";

export default {
  name: "DecisionView",
  methods: {
    changeRoutes: function (route) {
      router.push(route)
    }
  }
}
</script>

<style scoped>

</style>