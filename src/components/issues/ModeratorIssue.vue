<template>
  <v-container style="height: 100%">
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
                        <v-col cols="2">

                        </v-col>
                        <v-col cols="8" style="text-align: center">
                          <span style="margin-top: 60px">Status: {{ issue.status }}</span>
                        </v-col>
                        <v-col cols="2">

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
                <v-text-field outlined label="User" v-model="issue.user.username" readonly/>
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
          <v-card-actions v-if="issue.status === 'Open'" class="justify-center" style="margin-top: -20px;">
            <issue-action-dialog
                @confirm="resolveIssue"
                :button="{text: 'resolve', color: 'green'}"
                :dialog="{title: 'Resolve this issue?', text: 'Are you sure you want to resolve this issue?'}"/>
            <issue-action-dialog
                @confirm="closeIssue"
                :button="{text: 'close', color: 'red'}"
                :dialog="{title: 'Close this issue?', text: 'Are you sure you want to close this issue?'}"/>
          </v-card-actions>
          <v-spacer></v-spacer>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import colors from 'vuetify/lib/util/colors'
import IssueActionDialog from "@/components/issues/IssueActionDialog";
import {closeIssue, resolveIssue} from "@/api/api";

export default {
  name: "ModeratorIssue",
  components: {IssueActionDialog},
  props: ['issue'],
  computed: {
    token() {
      return this.$store.getters.getAuthToken
    },
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
    async closeIssue(onFinish) {
      await this.$store.dispatch('reauthenticate')
      await closeIssue(this.token, this.issue.id)
      await this.$store.dispatch('fetchModeratorIssues')
      onFinish()
    },
    async resolveIssue(onFinish) {
      await this.$store.dispatch('reauthenticate')
      await resolveIssue(this.token, this.issue.id)
      await this.$store.dispatch('fetchModeratorIssues')
      onFinish()

    }
  }
}
</script>

<style scoped>


</style>