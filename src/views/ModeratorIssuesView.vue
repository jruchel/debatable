<template>
  <v-container>
    <v-row v-if="loading" class="justify-center">
      <v-col cols="12" sm="10" lg="6" v-for="i in [1, 2, 3, 4]" :key="i">
        <v-skeleton-loader style="margin-top: 20px"
                           type="article, actions"></v-skeleton-loader>
      </v-col>
    </v-row>
    <v-container v-else>
      <v-row v-if="!issues || issues.length === 0" class="justify-center">
        <v-col cols="12" md="8" xl="6">
          <empty-issues/>
        </v-col>
      </v-row>
      <v-row v-else class="justify-center">
        <v-col cols="10" sm="8" lg="5" xl="4" v-for="issue in issues" :key="issue.id">
          <moderator-issue :issue="issue"></moderator-issue>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import EmptyIssues from "@/components/issues/EmptyIssues";
import ModeratorIssue from "@/components/issues/ModeratorIssue";


export default {
  name: "ModeratorIssuesView",
  components: {ModeratorIssue, EmptyIssues},
  beforeMount() {
    if (!this.loggedIn.value || !this.roles.includes('moderator')) {
      this.$router.push('/')
    }
  },
  watch: {
    roles: function (val) {
      if (!val.includes('moderator')) {
        this.$router.push('/')
      }
    },
    loggedIn: function (val) {
      if (!val.value) {
        this.$router.push('/')
      }
    }
  },
  async mounted() {
    await this.$store.dispatch('reauthenticate')
    await this.$store.dispatch('fetchModeratorIssues')
    this.loading = false
  },
  computed: {
    roles() {
      return this.$store.getters.getUserRoles
    },
    issues() {
      return this.$store.getters.getModeratorIssues
    }
  },
  data() {
    return {
      loading: true
    }
  },
}
</script>

<style scoped>

</style>