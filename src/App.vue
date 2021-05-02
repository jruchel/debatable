<template>
  <v-app style="background-color: #880E4F">
    <v-main>
      <QuestionView></QuestionView>
    </v-main>
  </v-app>
</template>

<script>

import QuestionView from "@/views/QuestionView";

export default {
  name: 'App',
  components: {QuestionView},
};
</script>
