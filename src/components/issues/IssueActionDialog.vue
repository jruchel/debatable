<template>
  <v-dialog :width="dialogWidth" v-model="show" :persistent="loading">
    <template v-slot:activator="{on, attrs}">
      <v-btn style="margin: 5px" v-on="on" v-bind="attrs" outlined large rounded :color="button.color">{{
          button.text
        }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title :style="dialogTitleBackground" style="color: white">{{ dialog.title }}
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <br>
        {{ dialog.text }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :loading="loading" text outlined rounded color="green lighten-1" @click="confirm">Yes</v-btn>
        <v-btn :disabled="loading" text outlined rounded color="red lighten-1" @click="cancel">No</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "IssueActionDialog",
  props: ['button', 'dialog'],
  computed: {
    dialogWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '100%'
        case 'sm':
          return '100%'
        case 'md':
          return '60%'
        default:
          return '30%'
      }
    },
    dialogTitleColor() {
      return this.$store.getters.getColors.primary
    },
    dialogTitleBackground() {
      return 'background-color: ' + this.dialogTitleColor.hex + ';'
    },
  },
  data() {
    return {
      loading: false,
      show: false
    }
  },
  methods: {
    onFinish() {
      this.loading = false
      this.show = false
    },
    confirm() {
      this.loading = true
      this.$emit('confirm', this.onFinish)
    },
    cancel() {
      this.show = false
    }
  }
}
</script>

<style scoped>

</style>