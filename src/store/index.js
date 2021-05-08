import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [createPersistedState({
        storage: window.sessionStorage,
    })],
    state: {
        backendAddress: 'http://localhost:8081',
        question: {
            question: 'Pepsi or Coke?',
            answers: [{content: "Pepsi", color: "blue", count: 10}, {content: "Coke", color: "red", count: 20}]
        },
        loggedIn: {value: false},
        authToken: {token: ""},
        user: {username: "", password: "", email: ""}
    },
    mutations: {
        sendRequest(state, payload) {
            function sendRequest(endpoint, method, body, headers, onComplete) {
                headers['Content-Type'] = 'application/json'
                axios({
                    method: method.toLowerCase(),
                    url: state.backendAddress + endpoint,
                    headers: headers,
                    data: JSON.parse(JSON.stringify(body))
                }).then(response => onComplete(response.data)).catch(function (error) {
                    onComplete(error.response.data)
                })
            }

            sendRequest(payload.endpoint, payload.method, payload.body, payload.headers, payload.onComplete)
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
        fetchQuestion(context) {
            let headers = {}
            headers['Content-Type'] = 'application/json'
            axios({
                method: 'post',
                url: context.getters.getBackendAddress + '/questions/random',
                headers: headers,
                data: context.getters.getCurrentQuestion
            }).then(response => {
                context.commit('setCurrentQuestion', response.data)
            }).catch(function (ex) {
                console.log(JSON.stringify(ex))
                context.commit('setCurrentQuestion', {
                    question: 'Pepsi or Coke?',
                    answers: [{content: "Pepsi", color: "blue", count: 10}, {content: "Coke", color: "red", count: 20}],
                    commentCount: 0,
                })
            })
        }
    },
    modules: {},
    getters: {
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
