<template>
  <v-card style="border-radius: 50px">
    <v-card-title class="justify-center">No issues</v-card-title>
    <v-card-text class="justify-center" style="text-align: center;">
      <span>You don't currently have any issues</span><br><br>
      <span>If you want to submit an issue click the button below</span>
    </v-card-text>
    <v-card-actions class="justify-center" style="margin-top: 20px">
      <v-btn outlined rounded style="margin-bottom: 10px" @click="$router.push('/issues')">
        Issues
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "EmptyIssues"
}
</script>

<style scoped>

</style>