<template>
  <v-tooltip bottom>
    <template v-slot:activator="{on, attrs}">
      <v-btn v-if="!go" icon @click="$router.push(path)"
             v-bind="attrs"
             v-on="on"
      >
        <v-icon size="35">
          {{ icon }}
        </v-icon>
      </v-btn>
      <v-btn v-else icon @click="$router.go(go.value)"
             v-bind="attrs"
             v-on="on"
      >
        <v-icon size="35">
          {{ icon }}
        </v-icon>
      </v-btn>
    </template>
    <span>{{ text }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: "AppBarMenuIcon",
  props: ['path', 'icon', 'text', 'go']
}
</script>

<style scoped>

</style>