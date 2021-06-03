<template>
  <v-menu bottom offset-y="true">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          icon
          dark
          v-bind="attrs"
          v-on="on"
      >
        <v-icon size="50" color="white">
          mdi-account-circle
        </v-icon>
      </v-btn>
    </template>
    <v-list rounded>
      <v-list-item-group>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>
              mdi-help
            </v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            Questions
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="$emit('perform-logout')">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "UserAvatar",
  data() {
    return {
      expanded: false
    }
  },
}
</script>

<style scoped>

</style>