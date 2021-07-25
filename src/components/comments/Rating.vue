<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn :color=color
             dark
             v-bind="attrs"
             v-on="on" class="rating" icon>
        <v-badge v-if="count > 0" :content=count :color=badgeColor
                 bottom>
          <v-icon color="black">
            {{ icon }}
          </v-icon>
        </v-badge>
        <v-icon v-else color="black">
          {{ icon }}
        </v-icon>
      </v-btn>

    </template>
    <span>{{tooltipText}}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: "Rating",
  props: ['count', 'color', 'badgeColor', 'icon', 'tooltipText'],

}
</script>

<style scoped>

</style>