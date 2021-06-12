<template>
  <v-container>
    <v-row v-if="loading" class="justify-center">
      <v-col cols="12" sm="10" lg="6" v-for="i in [1, 2, 3, 4]" :key="i">
        <v-skeleton-loader  style="margin-top: 20px"
                           type="article, actions"></v-skeleton-loader>
      </v-col>
    </v-row>
    <v-container v-else>
      <v-row v-if="issues.length === 0" class="justify-center">
        <v-col cols="12" md="8" xl="6">
          <empty-issues/>
        </v-col>
      </v-row>
      <v-row v-else class="justify-center">
        <v-col cols="10" md="6" xl="5" v-for="issue in issues" :key="issue.id">
          <issue @delete-issue="deleteIssue" :issue="issue"></issue>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import Issue from "@/components/issues/Issue";
import {deleteUserIssue} from "@/api/api";
import EventBus from "@/event-bus/EventBus";
import EmptyIssues from "@/components/issues/EmptyIssues";

export default {
  name: "UserIssuesView",
  components: {EmptyIssues, Issue},
  beforeMount() {
    if (!this.loggedIn.value) {
      this.$router.push('/')
    }
  },
  mounted() {
    this.$store.dispatch('fetchUserIssues').then(() => this.loading = false)
  },
  computed: {
    issues() {
      return this.$store.getters.getUserIssues
    },
    loggedIn() {
      return this.$store.getters.getLoggedIn
    },
    token() {
      return this.$store.getters.getAuthToken
    }
  },
  data() {
    return {
      loading: true
    }
  },
  watch: {
    issues: function (value) {
      this.loading = !value;
    },
    loggedIn: function (value) {
      if (!value) this.$router.push('/')
    }
  },
  methods: {
    deleteIssue(issue) {
      deleteUserIssue(this.token, issue.id)
          .then(() => {
            EventBus.$emit('show-snackbar', 'Issue deleted')
            this.loading = true
            this.$store.dispatch('fetchUserIssues').then(() => this.loading = false)
          }).catch((error) => {
        EventBus.$emit('show-snackbar', error.response.data)
      }).catch(() => {
        EventBus.$emit('show-snackbar', 'Could not delete issue')
      })
    }
  }

}
</script>

<style scoped>

</style>