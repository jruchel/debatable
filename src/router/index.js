import Vue from 'vue'
import VueRouter from 'vue-router'
import AskingView from "@/views/AskingView";
import AnsweringView from "@/views/AnsweringView";
import DecisionView from "@/views/DecisionView";

Vue.use(VueRouter)

const routes = [
    {path: '/answer', component: AnsweringView},
    {path: '/ask', component: AskingView},
    {path: '/', component: DecisionView, alias: ['']}
]

const router = new VueRouter({
    routes
})

export default router
