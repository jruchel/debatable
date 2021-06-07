<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="12" lg="8" xl="6" style="text-align: center">
        <v-sheet style="border-radius: 50px" elevation="6">
          <v-container style="padding-bottom: 0; padding-top: 0">
            <v-row class="justify-center">
              <v-col cols="2">
                <v-avatar color="blue" style="margin-top: 10px">
                  <v-icon dark>
                    mdi-account-circle
                  </v-icon>
                </v-avatar>
              </v-col>
              <v-col cols="10">
                <editable-form-field
                    :loading="loading.username"
                    label="username"
                    append-icon="mdi-account-box"
                    :rules="rules.username"
                    :value="cacheUser.username"
                    @edit-canceled="resetCacheUser"
                    @edit-confirmed="confirmUsernameChange"
                >
                </editable-form-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">
              </v-col>
              <v-col cols="10">
                <editable-form-field
                    :loading="loading.email"
                    label="email"
                    :rules="rules.email"
                    :value="cacheUser.email"
                    append-icon="mdi-email"
                    @edit-canceled="resetCacheUser"
                    @edit-confirmed="confirmEmailChange"
                >
                </editable-form-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">

              </v-col>
              <v-col cols="10">
                <editable-form-field
                    :loading="loading.password"
                    label="password"
                    type="password"
                    @editing-value-changed="setEditingPassword"
                    append-icon="mdi-lock"
                    :rules="rules.password.current"
                    :value="cacheUser.password"
                    @edit-canceled="resetCacheUser"
                    @edit-confirmed="confirmPasswordChange"
                >
                </editable-form-field>
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EditableFormField from "@/components/user/EditableFormField";
import EventBus from "@/event-bus/EventBus";
import {changeEmail, changePassword, changeUsername} from "@/api/api";

export default {
  name: "UserProfile",
  components: {EditableFormField},
  beforeMount() {
    if (!this.loggedIn.value) {
      this.$router.push('/')
    }
  },
  watch: {
    loggedIn: function (val) {
      if (!val.value) {
        this.$router.push('/')
      }
    }
  },
  mounted() {
    this.resetCacheUser()
  },
  data() {
    return {
      loading: {
        username: false,
        email: false,
        password: false
      },
      editingPassword: false,
      valid: true,
      regex: {
        email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      },
      rules: {
        password: {
          current: [
            v => !!v || 'Password cannot be empty',
            v => v.length >= 5 || 'Password must bo at least 5 characters long',
            v => v.length < 20 || 'Password cannot be longer than 20 characters'
          ]
        },
        username: [
          v => !!v || 'Username cannot be empty',
          v => v.length >= 4 || 'Username cannot be shorter than 4 characters',
          v => v.length < 10 || 'Username cannot be longer than 10 characters'
        ],
        email: [
          v => !!v || 'Email cannot be empty',
          v => this.regex.email.test(v) === true || 'Email must be a valid one'
        ]
      },
      cacheUser: {
        username: '',
        password: '',
        email: '',
      },
    }
  },
  computed: {
    colors() {
      return this.$store.getters.getColors
    },
    token() {
      return this.$store.getters.getAuthToken
    },
    loggedIn() {
      return this.$store.getters.getLoggedIn
    },
    user() {
      return this.$store.getters.getUser
    }
  },
  methods: {
    setEditingPassword(value) {
      this.editingPassword = value
    },
    resetCacheUser() {
      this.cacheUser = JSON.parse(JSON.stringify(this.user))
    },
    confirmUsernameChange(value) {
      if (value === this.user.username) return
      this.loading.username = true
      this.resetCacheUser()
      this.$store.dispatch('reauthenticate').then(() => {
            return changeUsername(this.token, value)
          }
      ).then(() => {
        EventBus.$emit('show-snackbar', 'Username changed')
        this.cacheUser.username = value
        this.$store.commit('setUser', this.cacheUser)
        this.loading.username = false
        this.resetCacheUser()
        return this.$store.dispatch('reauthenticate')
      })
          .catch((error) => {
            EventBus.$emit('show-snackbar', error.response.data)
          })
          .catch(() => {
            EventBus.$emit('show-snackbar', 'Could not change username')
          }).then(() => this.loading.username = false)
    },
    confirmEmailChange(value) {
      if (value === this.user.email) return
      this.loading.email = true
      this.resetCacheUser()
      this.$store.dispatch('reauthenticate').then(() => {
        return changeEmail(this.token, value)
      })
          .then(() => {
            EventBus.$emit('show-snackbar', 'Email changed, please verify your new email before using your account')
            this.cacheUser.email = value
            this.$store.commit('setUser', this.cacheUser)
          })
          .catch((error) => {
            EventBus.$emit('show-snackbar', error.response.data)
          })
          .catch(() => {
            EventBus.$emit('show-snackbar', 'Could not change email')
          }).then(() => this.loading.email = false)
    },
    confirmPasswordChange(value) {
      if (value === this.user.password) return
      this.loading.password = true
      this.resetCacheUser()
      this.$store.dispatch('reauthenticate').then(() => {
        changePassword(this.token, {
          currentPassword: this.cacheUser.password,
          newPassword: value,
          confirmPassword: value
        })
      }).then(() => {
        EventBus.$emit('show-snackbar', 'Password changed')
        this.cacheUser.password = value
        this.$store.commit('setUser', this.cacheUser)
      })
          .catch((error) => {
            EventBus.$emit('show-snackbar', error.response.data)
          })
          .catch(() => {
            EventBus.$emit('show-snackbar', 'Could not change password')
          })
          .then(() => this.loading.password = false)
    }
  }
}
</script>

<style scoped>


</style>