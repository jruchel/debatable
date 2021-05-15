import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
import {sendRequest} from "@/utils/requests"

Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [createPersistedState({
        storage: window.sessionStorage,
    })],
    state: {
        backendAddress: 'http://localhost:8081',
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
            return sendRequest(
                context.getters.getBackendAddress,
                '/security/authenticate',
                'post',
                context.getters.getUser,
                {},
                function (response) {
                    context.commit('setCurrentToken', response.data)
                },
                function () {
                    context.commit('setCurrentToken', {token: ''})
                    context.commit('setLoggedIn', {value: false})
                }
            )
        },
        fetchComments(context) {
            return sendRequest(
                context.getters.getBackendAddress,
                '/questions/comments',
                'post',
                context.getters.getCurrentQuestion,
                {},
                function (response) {
                    context.commit('setComments', response.data)
                },
                function () {
                    context.commit('setComments', [])
                }
            )
        },
        fetchQuestion(context) {
            return sendRequest(
                context.getters.getBackendAddress,
                '/questions/random',
                'post',
                context.getters.getCurrentQuestion,
                {},
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
                })
        }
    },
    modules: {},
    getters: {
        getComments(state) {
            return state.comments
        },
        getUser(state) {
            return state.user
        },
        getBackendAddress(state) {
            return state.backendAddress
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
