import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
import {
    authenticate,
    getCommentsOfQuestion,
    getRandomQuestion,
    getUser,
    updateQuestion,
    fetchUserAnswer
} from "@/api/api";

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
        userAnswer: undefined,
        comments: [],
        loggedIn: {value: false},
        authToken: {token: ""},
        user: {username: "", password: "", email: ""}
    },
    mutations: {
        setUserAnswer(state, payload) {
            state.userAnswer = payload
        },
        setComments(state, payload) {
            state.comments = payload
        },
        setUser(state, payload) {
            if (payload === undefined || payload === null || payload === {}) state.user = {
                username: "",
                password: "",
                email: ""
            }
            else state.user = payload
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
        fetchUserAnswer(context) {
            return fetchUserAnswer(context.getters.getCurrentQuestion, context.getters.getAuthToken)
                .then(response => context.commit('setUserAnswer', response.data))
                .catch(() => context.commit('setUserAnswer', undefined))
        },
        reauthenticate(context) {
            return authenticate(context.getters.getUser)
                .then(response => context.commit('setCurrentToken', response.data))
                .catch(() => {
                    context.commit('setUser', {username: "", password: "", email: ""})
                    context.commit('setLoggedIn', {value: false})
                })

        },
        fetchComments(context) {
            return getCommentsOfQuestion(context.getters.getCurrentQuestion)
                .then(response => context.commit('setComments', response.data))
                .catch(() => context.commit('setComments', []))

        },
        fetchUser(context) {
            let password = context.getters.getUser.password
            return getUser(context.getters.getAuthToken).then(response => {
                response.data['password'] = password
                context.commit('setUser', response.data)
            }).then(() => context.dispatch('updateQuestion'))
                .catch(() => {
                        context.commit('setUser', {username: "", password: "", email: ""})
                    }
                )
        },
        updateQuestion(context) {
            return updateQuestion(context.getters.getCurrentQuestion).then(response => {
                context.commit('setCurrentQuestion', response.data)
                    .then(() => context.dispatch('fetchUserAnswer'))
            }).catch(error => console.log('error', error.response.data))
        },
        fetchQuestion(context) {
            let question = null
            return getRandomQuestion(context.getters.getCurrentQuestion)
                .then(response => question = response.data)
                .then(() => context.dispatch('fetchUserAnswer'))
                .then(() => context.dispatch('fetchComments'))
                .then(() => context.commit('setCurrentQuestion', question))
                .catch(() => {
                    context.commit('setCurrentQuestion', {
                        question: 'Pepsi or Coke?',
                        answers: [{answer: "Pepsi", color: "blue", count: 10}, {
                            answer: "Coke",
                            color: "red",
                            count: 20
                        }],
                        commentCount: 0,
                    })
                })
        }
    },
    modules: {},
    getters: {
        getUserAnswer(state) {
            return state.userAnswer
        },
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

