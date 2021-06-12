<template>
  <v-menu bottom :offset-y="true">
    <template v-slot:activator="{ on, attrs }">
      <v-chip
          :color="color.primary.name"
          large
          v-bind="attrs"
          v-on="on">
        <span style="margin-right: 10px; font-size: 20px">{{ user.username }}</span>
        <v-icon size="40">mdi-account-circle</v-icon>
      </v-chip>
    </template>
    <v-list rounded>
      <v-list-item-group>
        <v-list-item @click="$router.push('/user/questions')">
          <v-list-item-icon>
            <v-icon>
              mdi-help
            </v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            Questions
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="$router.push('/user')">
          <v-list-item-icon>
            <v-icon>mdi-account-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Edit profile</v-list-item-title>
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
  name: "Menu",
  computed: {
    color() {
      return this.$store.getters.getColors
    },
    user() {
      return this.$store.getters.getUser
    }
  },
  data() {
    return {
      expanded: false
    }
  },
}
</script>

<style scoped>

</style>