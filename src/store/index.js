import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
import {authenticate, getCommentsOfQuestion, getRandomQuestion} from "@/api/api";

Vue.use(Vuex)


export default new Vuex.Store({
    plugins: [createPersistedState({
        storage: window.sessionStorage,
    })],
    state: {
        color: {
            primary: {name: 'blue-grey darken-4', hex: '#263238'},
            background: {name: 'brown lighten-3', hex: '#BCAAA4'},
            buttonPrimary: {name: 'blue-grey darken-3', hex: '#455A64'},
            buttonSecondary: {name: 'blue-grey darken-1', hex: '#546E7A'},
            snackbar: {name: 'blue-grey darken-2', hex: '#455A64'}
        },
        question: {},
        comments: [],
        loggedIn: {value: false},
        authToken: {token: ""},
        user: {username: "", password: "", email: ""}
    },
    mutations: {
        setComments(state, payload) {
            state.comments = payload
        },
        setUser(state, payload) {
            state.user = payload
        },
        setCurrentQuestion(state, payload) {
            state.question = payload
        },
        setCurrentToken(state, payload) {
            state.authToken = payload
        },
        setLoggedIn(state, payload) {
            state.loggedIn = payload
        }
    },
    actions: {
        reauthenticate(context) {
            return authenticate(context.getters.getUser, function (response) {
                    context.commit('setCurrentToken', response.data)
                },
                function () {
                    context.commit('setCurrentToken', {token: ''})
                    context.commit('setLoggedIn', {value: false})
                })
        },
        fetchComments(context) {
            return getCommentsOfQuestion(context.getters.getCurrentQuestion, function (response) {
                    context.commit('setComments', response.data)
                },
                function () {
                    context.commit('setComments', [])
                })
        },
        fetchQuestion(context) {
            return getRandomQuestion(
                context.getters.getCurrentQuestion,
                function (response) {
                    context.commit('setCurrentQuestion', response.data)
                },
                function () {
                    context.commit('setCurrentQuestion', {
                        question: 'Pepsi or Coke?',
                        answers: [{answer: "Pepsi", color: "blue", count: 10}, {
                            answer: "Coke",
                            color: "red",
                            count: 20
                        }],
                        commentCount: 0,
                    })
                }
            )
        }
    },
    modules: {},
    getters: {
        getColor(state) {
            return state.color
        },
        getComments(state) {
            return state.comments
        },
        getUser(state) {
            return state.user
        },
        getCurrentQuestion(state) {
            return state.question
        },
        getAuthToken(state) {
            return state.authToken
        },
        getLoggedIn(state) {
            return state.loggedIn
        }
    }
})

