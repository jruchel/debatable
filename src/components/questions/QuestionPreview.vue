<template>
  <v-container style="padding-left: 0; padding-right: 0">
    <v-row class="justify-center">
      <v-col cols="12" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
        <v-card width="100%" height="100%" ref="card" :style="hover ? hoverClass : ''"
                @mouseenter="hover = true"
                @mouseleave="hover = false" hover
                color="#9e9d9d" style="border-radius: 12px"
                @click="routeToQuestion">
          <v-container>
            <v-row>
              <v-col cols="8">
                <span>Total answers: {{ question.answers[0].count + question.answers[1].count }}</span>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="1">
                <delete-question-dialog :question="question"
                                        v-on:delete-question="passDeleteEvent"></delete-question-dialog>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-card>
                  <v-card-title class="justify-center">{{ question.question }}</v-card-title>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <question-preview-answer style="height: 100%" :answer="question.answers[0]"></question-preview-answer>
              </v-col>
              <v-col cols="6">
                <question-preview-answer style="height: 100%" :answer="question.answers[1]"></question-preview-answer>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import QuestionPreviewAnswer from "@/components/questions/QuestionPreviewAnswer";
import DeleteQuestionDialog from "@/components/questions/DeleteQuestionDialog";

export default {
  name: "QuestionPreview",
  components: {DeleteQuestionDialog, QuestionPreviewAnswer},
  props: ['question'],
  computed: {
    colors() {
      return this.$store.getters.getColors
    },
    hoverClass() {

      return 'perspective(100px)\n' +
          'rotateX(' + this.cursor.x + 'deg) \n' +
          'rotateY(' + this.cursor.y + 'deg)'
    }
  },
  data() {
    return {
      initialPosition: {x: undefined, y: undefined},
      hover: false
    }
  },
  methods: {
    onMouseLeave() {
      this.$refs['card'].$el.style.transform = ''
    },
    onMouseMove(event) {
      let ex1Layer = this.$refs['card'].$el
      let xy = [event.clientX, event.clientY];
      let position = xy.concat([ex1Layer]);
      window.requestAnimationFrame(() => {
        this.transformElement(ex1Layer, position);
      });
    },
    transformElement(el, xyEl) {
      el.style.transform = this.transforms.apply(null, xyEl);
    },
    transforms(x, y, el) {
      let constraint = 5000
      let box = el.getBoundingClientRect();
      let calcX = -(y - box.y - (box.height / 2)) / constraint;
      let calcY = -(x - box.x - (box.width / 2)) / constraint;
      return "perspective(100px) "
          + "   rotateX(" + calcX + "deg) "
          + "   rotateY(" + calcY + "deg) ";
    },
    passDeleteEvent(args) {
      this.$emit('delete-question', args)
    },
    routeToQuestion() {
      this.$store.commit('setCurrentQuestion', this.question)
      this.$router.push('/answer')
    }
  },
}
</script>

<style scoped>

</style>