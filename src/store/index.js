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
            firstAnswer: {answer: "Pepsi", color: "blue", count: 10},
            secondAnswer: {answer: "Coke", color: "red", count: 20},
        },
        loggedIn: {value: false},
        authToken: {token: ""},
        user: Object
    },
    mutations: {
        logIn(state, payload) {
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
        sendRequest(context, endpoint, method, body, headers, onComplete) {
            headers['Content-Type'] = 'application/json'
            axios({
                method: method.toLowerCase(),
                url: context.getters.getBackendAddress + endpoint,
                headers: headers,
                data: JSON.parse(JSON.stringify(body))
            }).then(response => onComplete(response.data)).catch(function (error) {
                onComplete(error.response.data)
            })
        },
        fetchQuestion(context) {
            context.sendRequest(context,
                '/questions/random',
                'POST',
                {},
                {},
                function (response) {
                    context.commit('setCurrentQuestion', response)
                }
            )
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
