import Vue from 'vue'
import VueRouter from 'vue-router'
import AskingView from "@/views/AskingView";
import AnsweringView from "@/views/AnsweringView";
import DecisionView from "@/views/DecisionView";
import UserQuestions from "@/views/UserQuestions";
import UserProfile from "@/views/UserProfile";

Vue.use(VueRouter)

const routes = [
    {path: '/answer', component: AnsweringView, name: ''},
    {path: '/ask', component: AskingView, name: ''},
    {path: '/', component: DecisionView, alias: [''], name: ''},
    {path: '/user/questions', component: UserQuestions, name: 'Your questions'},
    {path: '/user', component: UserProfile, name: 'Your profile'}
]

const router = new VueRouter({
    routes
})

export default router
