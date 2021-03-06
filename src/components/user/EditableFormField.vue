<template>
  <v-form ref="form" lazy-validation v-model="valid">
    <v-container style="padding-bottom: 0; padding-top: 0">
      <v-row>
        <v-col cols="9">
          <v-text-field
              ref="textField"
              :loading="loading"
              :label="label"
              :type="type === 'password' && !passwordVisible ? 'password' : 'text'"
              :rules="rules" v-model="value"
              :readonly="readOnly"
              :append-icon="appendIcon"
          >
            <template v-slot:append>
              <div v-if="type === 'password'" style="margin-right: 5px">
                <v-icon v-if="passwordVisible" :color="passwordVisible ? 'blue' : 'grey'"
                        @mouseup="passwordVisible = false"
                        @mousedown="passwordVisible = true">
                  mdi-eye
                </v-icon>
                <v-icon v-else @mouseup="passwordVisible = false" @mouseleave="passwordVisible = false"
                        @mousedown="passwordVisible = true">
                  mdi-eye-off
                </v-icon>
              </div>
              <v-icon>
                {{ appendIcon }}
              </v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="1" v-if="!alwaysEdit">
          <v-btn icon class="button" :disabled="editing" @click="startEditing">
            <v-icon size=30>
              mdi-pencil
            </v-icon>
          </v-btn>
        </v-col>
        <v-fade-transition>
          <v-col v-if="editing" cols="1">
            <v-btn icon class="button">
              <v-icon size="35" color="green darken-1" @click="confirmEditing" :disabled="!valid">
                mdi-checkbox-marked-circle
              </v-icon>
            </v-btn>
          </v-col>
        </v-fade-transition>
        <v-fade-transition>
          <v-col v-if="editing" cols="1">
            <v-btn icon class="button" @click="cancelEditing">
              <v-icon size="35" color="red darken-1">
                mdi-minus-circle
              </v-icon>
            </v-btn>
          </v-col>
        </v-fade-transition>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>

export default {
  name: "EditableFormField",
  props: ['rules', 'value', 'loading', 'label', 'type', 'appendIcon', 'alwaysEdit'],
  mounted() {
    if (this.alwaysEdit === undefined || this.alwaysEdit === null) {
      this.alwaysEdit = false
    }
  },
  watch: {
    valid: function (value) {
      this.$emit('valid-value-changed', value)
    },
    editing: function (value) {
      this.$emit('editing-value-changed', value)
    },
    value: function (value) {
      this.$emit('field-value-changed', value)
    }
  },
  computed: {
    form() {
      return this.$refs['form']
    },
    readOnly() {
      if (this.alwaysEdit) return false
      return !this.editing;
    }
  },
  data() {
    return {
      passwordVisible: false,
      valid: true,
      editing: false
    }
  },
  methods: {
    startEditing() {
      this.editing = true
      this.$refs.textField.focus()
    },
    cancelEditing() {
      this.editing = false
      this.$emit('edit-canceled')
    },
    confirmEditing() {
      this.editing = false
      this.$emit('edit-confirmed', this.value)
    }
  }
}
</script>

<style scoped>


.button {
  margin-top: 17px;
  margin-bottom: 10px;
}

</style>