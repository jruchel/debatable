<template>
  <v-container v-if="!loadingPage">
    <v-row class="justify-center">
      <v-col cols="12" lg="8" xl="6" style="text-align: center">
        <v-card style="border-radius: 50px">
          <v-form v-model="form.valid" ref="form" lazy-validation>
            <v-container>
              <v-row class="justify-center">
                <v-col cols="2">
                  <v-avatar color="blue" style="margin-top: 10px">
                    <v-icon size="35" dark>
                      mdi-help-circle
                    </v-icon>
                  </v-avatar>
                </v-col>
              </v-row>
              <v-row class="justify-center">
                <v-col cols="1" sm="3">

                </v-col>
                <v-col cols="6">
                  <v-select
                      :rules="form.subject.otherSubject ? [] : rules.subject"
                      :disabled="form.subject.otherSubject"
                      :items="issueSubjects"
                      label="Subject"
                      dense
                      v-model="form.subject.subject"
                  ></v-select>
                </v-col>
                <v-col cols="5" sm="3">
                  <v-checkbox v-model="form.subject.otherSubject" label="Other"></v-checkbox>
                </v-col>
              </v-row>
              <v-slide-y-transition>
                <v-row class="justify-center" v-if="form.subject.otherSubject"
                       style="margin-top: -60px; margin-bottom: 10px">
                  <v-col cols="1" sm="3">

                  </v-col>
                  <v-col cols="6">
                    <v-text-field :rules="form.subject.otherSubject ? rules.subject : []" label="Subject"
                                  v-model="form.subject.subject"></v-text-field>
                  </v-col>
                  <v-col cols="5" sm="3">

                  </v-col>
                </v-row>
              </v-slide-y-transition>
              <v-row class="justify-center" style="margin-top: -35px">
                <v-col cols="1" sm="3">

                </v-col>
                <v-col cols="6">
                  <v-text-field :rules="rules.email" v-model="form.email.email" :disabled="form.email.useAccountEmail"
                                label="Contact e-mail"></v-text-field>
                </v-col>
                <v-col cols="5" sm="3">
                  <v-checkbox v-model="form.email.useAccountEmail" v-if="loggedIn.value"
                              label="Use account e-mail"></v-checkbox>
                </v-col>
              </v-row>
              <v-row class="justify-center">
                <v-col cols="10" sm="8">
                  <v-textarea :counter="500" :rules="rules.description" v-model="form.description.description"
                              height="200px" outlined
                              no-resize
                              label="Description"></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
          <v-row class="justify-center">
            <v-col cols="12">
              <v-btn style="margin-right: 5px" :loading="form.sending" @click="onSend" outlined rounded height="50px">
                Send issue
              </v-btn>
              <v-btn style="margin-left: 5px" @click="resetForm" outlined rounded height="50px">
                Reset
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {fetchIssueSubjects, submitIssue} from "@/api/api";
import EventBus from "@/event-bus/EventBus";

export default {
  name: "HelpView",
  computed: {
    loggedIn() {
      return this.$store.getters.getLoggedIn
    },
    user() {
      return this.$store.getters.getUser
    },
    token() {
      if (!this.loggedIn) return null
      return this.$store.getters.getAuthToken
    },
    useAccountEmail() {
      return this.form.email.useAccountEmail
    },
    otherSubject() {
      return this.form.subject.otherSubject
    },
    issue() {
      return {
        subject: this.form.subject.subject,
        contactEmail: this.form.email.email,
        description: this.form.description.description
      }
    },
    refForm() {
      return this.$refs['form']
    }
  },
  watch: {
    loggedIn: function (value) {
      if (!value.value) {
        this.fillOutForUser()
      }
      if (value.value) {
        this.fillOutForUser()
      }
    },
    useAccountEmail: function (value) {
      if (!value) this.form.email.email = ''
      else this.form.email.email = this.user.email
    },
    otherSubject: function () {
      this.form.subject.subject = ''
    }
  },
  mounted() {
    fetchIssueSubjects().then((response) => {
      this.issueSubjects = response.data
    }).catch((error) => {
      this.$emit('show-snackbar', error.response.data)
    }).catch(() => {
    }).then(() => {
      this.loadingPage = false
      this.form.email.useAccountEmail = false
    })

  },
  data() {
    return {
      loadingPage: true,
      issueSubjects: ['Account', 'Answers', 'Questions'],
      form: {
        valid: false,
        sending: false,
        email: {
          useAccountEmail: false,
          email: ''
        },
        subject: {
          subject: '',
          otherSubject: false,

        },
        description: {
          description: ''
        }
      },
      regex: {
        email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      },
      rules: {
        subject: [
          v => !!v && v.length > 0 && v.trim().length > 0 || 'Subject cannot be empty'
        ],
        email: [
          v => !!v || 'Email cannot be empty',
          v => this.regex.email.test(v) === true || 'Email must be a valid one'
        ],
        description: [
          v => !!v || 'Description cannot be empty.',
          v => v.length <= 500 || 'Description is too long'
        ]
      }
    }
  }
  ,
  methods: {
    resetForm() {
      this.form.subject.subject = ''
      this.form.description.description = ''
      this.refForm.resetValidation()
      this.fillOutForUser()
    }
    ,
    fillOutForUser() {
      this.refForm.resetValidation()
      if (this.loggedIn.value) {
        this.form.email.useAccountEmail = true
        this.form.email.email = this.user.email
      } else {
        this.form.email.useAccountEmail = false
        this.form.email.email = ''
      }
    }
    ,
    async onSend() {
      await this.refForm.validate()
      if (this.form.valid) {
        this.sendForm()
      }
    }
    ,
    sendForm() {
      if (this.form.valid) {
        this.form.sending = true
        this.$store.dispatch('reauthenticate').then(() => submitIssue(this.issue, this.token)
            .then(() => {
              EventBus.$emit('show-snackbar', 'Issue submitted')
              this.refForm.reset()
            }).catch((error) => {
              EventBus.$emit('show-snackbar', error.response.data)
            })
        )
            .catch(() => {
              EventBus.$emit('show-snackbar', 'Could not submit issue')
            }).then(() => this.form.sending = false)

      }
    }
  }

}

//TODO: make useAccountEmail true if the user logs in while on the page or navigates to it while being logged in
</script>

<style scoped>

</style>
