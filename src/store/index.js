import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        question: {
            question: 'Pepsi or Coke?',
            firstAnswer: {answer: "Pepsi", color: "blue", count: 10},
            secondAnswer: {answer: "Coke", color: "red", count: 20},
        },
        loggedIn: {value: false},
        authToken: {token: ""},
    },
    mutations: {
        setCurrentQuestion(state, payload) {
            state.question = payload
        },
        setCurrentToken(state, payload) {
            state.authToken = payload
        }

    },
    actions: {
        sendRequest(endpoint, method, body, headers, onComplete) {
            headers['Content-Type'] = 'application/json'
            axios({
                method: method.toLowerCase(),
                url: this.backendAddress + endpoint,
                headers: headers,
                data: JSON.parse(JSON.stringify(body))
            }).then(response => onComplete(response.data)).catch(function (error) {
                onComplete(error.response.data)
            })
        },
        fetchQuestion(context) {
            this.sendRequest(
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
        getCurrentQuestion(state) {
            return state.question
        },
        getToken(state) {
            return state.authToken
        },
        getLoggedIn(state) {
            return state.loggedIn
        }
    }
})
