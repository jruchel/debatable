<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="header-card" style="border-radius: 10px 10px 50px 50px">
          <v-container>
            <v-row class="justify-center">
              <v-col cols="12" style="padding: 0">
                <v-card
                    style="border-radius: 10px 10px 0 0;"
                    elevation="0">
                  <v-card-title :style="cardTitleStyle(getStatusColor(issue.status))">
                    <v-container>
                      <v-row class="justify-center">
                        <v-col cols="2" md="1">

                        </v-col>
                        <v-col cols="6" md="10" style="text-align: center">
                          <span>Status: {{ issue.status }}</span>
                        </v-col>
                        <v-col cols="2" md="1">
                          <v-btn dark icon @click="deleteIssue" :loading="deleting">
                            <v-icon size="35">
                              mdi-close-circle-outline
                            </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-title>
                </v-card>
              </v-col>
            </v-row>
            <v-row class="justify-center">
              <v-col cols="10" sm="8" style="margin-top: 15px">
                <v-text-field outlined label="Subject" v-model="issue.subject" readonly/>
                <v-text-field outlined label="E-mail" v-model="issue.email" readonly/>
                <v-text-field outlined label="Submitted at" v-model="issue.createdDate" readonly/>
              </v-col>
            </v-row>
            <v-row class="justify-center">
              <v-col cols="12" sm="10">
                <v-textarea outlined no-resize label="Description" v-model="issue.description"
                            readonly/>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import colors from 'vuetify/lib/util/colors'

export default {
  name: "Issue",
  props: ['issue'],
  computed: {
    colors() {
      return this.$store.getters.getColors
    }
  },
  data() {
    return {
      deleting: false
    }
  },
  methods: {
    hexColor: (name) => {
      const [nameFamily, nameModifier] = name.split(' ')
      const shades = ['black', 'white', 'transparent']
      const util = {family: null, modifier: null}
      if (shades.find(shade => shade === nameFamily)) {
        util.family = 'shades'
        util.modifier = nameFamily
      } else {
        const [firstWord, secondWord] = nameFamily.split('-')
        util.family = `${firstWord}${secondWord
            ? secondWord.charAt(0).toUpperCase() + secondWord.slice(1)
            : ''}`
        util.modifier = nameModifier
            ? nameModifier.replace('-', '')
            : 'base'
      }
      return colors[util.family][util.modifier]
    },
    getStatusColor(status) {
      switch (status) {
        case 'Open':
          return 'orange darken-3'
        case 'Closed':
          return 'red'
        case 'Resolved':
          return 'green'
        default:
          return 'green'
      }
    },
    cardTitleStyle(color) {
      return "background-color: " + this.hexColor(color) + '; color: white;'
    },

    deleteIssue() {
      this.deleting = true
      this.$emit('delete-issue', this.issue)
    }
  }
}
</script>

<style scoped>


</style>