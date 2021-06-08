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
                    ref="username"
                    :loading="loading.username"
                    label="Username"
                    append-icon="mdi-account-box"
                    :rules="rules.username"
                    :value="cacheUser.username"
                    @edit-canceled="cancelUsernameChange"
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
                    ref="email"
                    :loading="loading.email"
                    label="E-mail"
                    :rules="rules.email"
                    v-model="cacheUser.email"
                    append-icon="mdi-email"
                    @edit-canceled="cancelEmailChange"
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
                    ref="password"
                    :loading="loading.password"
                    :label="editingPassword ? 'Your current password' : 'Password'"
                    type="password"
                    @editing-value-changed="editingPasswordChanged"
                    append-icon="mdi-lock"
                    :rules="rules.password.current"
                    :value="password.currentPassword"
                    @edit-canceled="cancelPasswordChange"
                    @edit-confirmed="confirmPasswordChange"
                    @field-value-changed="currentPasswordValueChanged"
                    @valid-value-changed="revalidate"
                >
                </editable-form-field>
              </v-col>
            </v-row>
            <v-slide-y-transition>
              <v-row v-if="editingPassword">
                <v-col cols="2"></v-col>
                <v-col cols="10">
                  <editable-form-field
                      ref="new-password"
                      label="New password"
                      type="password"
                      append-icon="mdi-lock"
                      :rules="rules.password.current"
                      :value="password.newPassword"
                      always-edit="true"
                      @field-value-changed="newPasswordValueChanged"
                      @valid-value-changed="revalidate"
                  ></editable-form-field>
                </v-col>
              </v-row>
            </v-slide-y-transition>
            <v-slide-y-transition>
              <v-row v-if="editingPassword">
                <v-col cols="2"></v-col>
                <v-col cols="10">
                  <editable-form-field
                      ref="confirm-password"
                      always-edit="true"
                      :loading="loading.password"
                      label="Confirm password"
                      type="password"
                      append-icon="mdi-lock"
                      :rules="rules.password.confirm"
                      :value="password.confirmPassword"
                      @field-value-changed="confirmPasswordValueChanged"
                      @valid-value-changed="revalidate"
                  ></editable-form-field>
                </v-col>
              </v-row>
            </v-slide-y-transition>
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
            v => {
              return (!!v || 'Password cannot be empty')
            },
            v => {
              return (v.length >= 5 || 'Password must bo at least 5 characters long')
            },
            v => {
              return (v.length < 20 || 'Password cannot be longer than 20 characters')
            },
            () => {
              return (this.$refs['new-password'] && !!this.password.newPassword || 'New password cannot be empty')
            },
            () => {
              return (this.$refs['confirm-password'] && !!this.password.confirmPassword || 'Confirm password cannot be empty')
            },
            () => {
              return (this.$refs['confirm-password'] && this.$refs['new-password'] && this.password.confirmPassword === this.password.newPassword || 'Passwords must match')
            }

          ],
          new: [
            v => !!v || 'Password cannot be empty',
            v => v.length >= 5 || 'Password must bo at least 5 characters long',
            v => v.length < 20 || 'Password cannot be longer than 20 characters'
          ],
          confirm: [
            v => !!v || 'New password must be confirmed',
            v => v === this.password.newPassword || 'Passwords must match'
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
      password: {
        currentPassword: 'password',
        newPassword: '',
        confirmPassword: ''
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
    revalidate() {
      this.$refs['password'].form.validate()
      if (this.$refs['new-password']) this.$refs['new-password'].form.validate()
      if (this.$refs['confirm-password']) this.$refs['confirm-password'].form.validate()
    },
    newPasswordValueChanged(value) {
      this.password.newPassword = value
    },
    confirmPasswordValueChanged(value) {
      this.password.confirmPassword = value
    },
    currentPasswordValueChanged(value) {
      this.password.currentPassword = value
    },
    editingPasswordChanged(value) {
      this.editingPassword = value
      if (this.editingPassword) {
        this.password.currentPassword = ''
        this.password.newPassword = ''
        this.password.confirmPassword = ''
      }
    },
    resetPassword() {
      this.password.currentPassword = 'password'
      this.password.newPassword = ''
      this.password.confirmPassword = ''
    },
    resetCacheUser() {
      this.cacheUser = JSON.parse(JSON.stringify(this.user))
    },
    cancelUsernameChange() {
      this.cacheUser.username = JSON.parse(JSON.stringify(this.user.username))
      this.$refs['username'].value = this.cacheUser.username
    },
    cancelEmailChange() {
      this.cacheUser.email = JSON.parse(JSON.stringify(this.user.email))
      this.$refs['email'].value = this.cacheUser.email
    },
    cancelPasswordChange() {
      this.resetPassword()
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
      return this.$store.dispatch('reauthenticate').then(() => {
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
      if (value !== this.user.password) {
        EventBus.$emit('show-snackbar', 'Incorrect password')
        return
      }
      this.loading.password = true
      return this.$store.dispatch('reauthenticate').then(() => {
        console.log(this.password)
        return changePassword(this.token, {
          currentPassword: this.password.currentPassword,
          newPassword: this.password.newPassword,
          confirmPassword: this.password.confirmPassword
        })
      }).then(() => {
        EventBus.$emit('show-snackbar', 'Password changed')
        this.cacheUser.password = value
        this.$store.commit('setUser', JSON.parse(JSON.stringify(this.cacheUser)))
      }).catch((error) => {
        EventBus.$emit('show-snackbar', error.response.data)
      }).catch(() => {
        EventBus.$emit('show-snackbar', 'Could not change password')
      }).then(() => {
        this.resetPassword()
        this.loading.password = false
      })
    }
  }
}

</script>

<style scoped>


</style>