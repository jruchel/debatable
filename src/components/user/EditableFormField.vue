<template>
  <v-form ref="form" lazy-validation v-model="valid">
    <v-container style="padding-bottom: 0; padding-top: 0">
      <v-row>
        <v-col cols="8">
          <v-text-field :rules="rules" v-model="value"
                        :readonly="!editing"></v-text-field>
        </v-col>
        <v-col cols="1" style="margin-right: 5%">
          <v-btn class="button" :disabled="editing" @click="editing = true">
            Edit
          </v-btn>
        </v-col>
        <v-fade-transition>
          <v-col v-if="editing" cols="1">
            <v-btn icon class="button">
              <v-icon size="35" color="black" @click="confirmEditing" :disabled="!valid">
                mdi-checkbox-marked-circle-outline
              </v-icon>
            </v-btn>
          </v-col>
        </v-fade-transition>
        <v-fade-transition>
          <v-col v-if="editing" cols="1">
            <v-btn icon class="button" @click="cancelEditing">
              <v-icon size="35" color="black">
                mdi-minus-circle-outline
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
  name: "EditableRow",
  props: ['rules', 'value', 'onEditCancel', 'onEditConfirm'],
  data() {
    return {
      valid: true,
      editing: false
    }
  },
  methods: {
    cancelEditing() {
      this.editing = false
      this.$emit('edit-canceled')
    },
    confirmEditing() {
      this.editing = false
      this.$emit('edit-confirmed')
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