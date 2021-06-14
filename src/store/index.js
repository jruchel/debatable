import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
import {
    authenticate,
    getCommentsOfQuestion,
    getRandomQuestion,
    getUser,
    updateQuestion,
    fetchUserAnswer, getCommentsPage, fetchUserQuestions, fetchUserIssues, fetchUserRoles, fetchModeratorIssues
} from "@/api/api";

Vue.use(Vuex)


export default new Vuex.Store({
    plugins: [createPersistedState({
        storage: window.sessionStorage,
    })],
    state: {
        colors: {
            primary: {name: 'blue-grey darken-4', hex: '#263238'},
            background: {name: 'brown lighten-3', hex: '#BCAAA4'},
            buttonPrimary: {name: 'blue-grey darken-3', hex: '#455A64'},
            buttonSecondary: {name: 'blue-grey darken-1', hex: '#546E7A'},
            snackbar: {name: 'blue-grey darken-2', hex: '#455A64'}
        },
        question: {},
        userRoles: [],
        userQuestions: [],
        userAnswer: undefined,
        comments: {},
        loggedIn: {value: false},
        authToken: {token: ""},
        user: {username: "", password: "", email: ""},
        moderatorIssues: {},
        userIssues: {},
        loading: {
            value: false,
            color: {
                default: 'green',
                active: 'green'
            }
        }
    },
    mutations: {
        performLogout(state) {
            state.userRoles = []
            state.userIssues = []
            state.user = {username: "", password: "", email: ""}
            state.authToken = {token: ""}
            state.userQuestions = []
            state.userAnswer = undefined
            state.loggedIn.value = false

        },
        setUserRoles(state, payload) {
            state.userRoles = payload
        },
        startLoading(state, payload) {
            if (!payload) {
                state.loading.color.active = state.loading.color.default
            } else {
                state.loading.color.active = payload
            }
            state.loading.value = true
        },
        stopLoading(state) {
            state.loading.value = false
        },
        setUserAnswer(state, payload) {
            state.userAnswer = payload
        },
        setComments(state, payload) {
            state.comments = payload
        },
        setUserQuestions(state, payload) {
            state.userQuestions = payload
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
        },
        setModeratorIssues(state, payload) {
            state.moderatorIssues = payload
        },
        setUserIssues(state, payload) {
            state.userIssues = payload
        }
    },
    actions: {
        fetchUserRoles(context) {
            return fetchUserRoles(context.getters.getAuthToken)
                .then((response) => {
                    context.commit('setUserRoles', response.data)
                })
        },
        fetchModeratorIssues(context) {
            return fetchModeratorIssues(context.getters.getAuthToken)
                .then((response) => context.commit('setModeratorIssues', response.data))
                .catch(() => {
                    context.commit('setModeratorIssues', {content: []})
                })
        },
        fetchUserIssues(context) {
            return fetchUserIssues(context.getters.getAuthToken).then((response) => {
                context.commit('setUserIssues', response.data)
            })
        },
        fetchUserQuestions(context) {
            return fetchUserQuestions(context.getters.getAuthToken)
                .then(response => {
                    context.commit('setUserQuestions', response.data)
                })
                .catch(() => context.commit('setUserQuestions', []))
        },
        fetchUserAnswer(context) {
            return fetchUserAnswer(context.getters.getCurrentQuestion.id, context.getters.getAuthToken)
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
            let comments = context.getters.getComments
            if (comments.number === undefined || comments.number === null || comments.size === undefined || comments.size === null) {
                return getCommentsOfQuestion(context.getters.getCurrentQuestion.id)
                    .then(response => {
                        context.commit('setComments', response.data)
                    })
                    .catch(() => context.commit('setComments', {}))
            }
            return getCommentsPage(context.getters.getCurrentQuestion.id, comments.number + 1, comments.size).then(response => {
                context.commit('setComments', response.data)
            })
        },
        fetchUser(context) {
            return getUser(context.getters.getAuthToken).then(response => {
                response.data['password'] = context.getters.getUser.password
                context.commit('setUser', response.data)
            })
                .catch(() => {
                    context.commit('setUser', {username: "", password: "", email: ""})
                }).then(() => {
                    context.dispatch('fetchUserRoles').then((response) => {
                        context.commit('setUserRoles', response.data)
                    })
                })
                .then(() => {
                    return context.dispatch('updateQuestion')
                })
                .then(() => {
                    return context.dispatch('fetchUserQuestions')
                })

        },
        updateQuestion(context) {
            return updateQuestion(context.getters.getCurrentQuestion.id).then(response => {
                context.commit('setCurrentQuestion', response.data)
            }).then(() => {
                return context.dispatch('fetchUserAnswer')
            })
                .then(() => {
                    return context.dispatch('fetchComments')
                })
        },
        fetchQuestion(context) {
            let question = null
            return getRandomQuestion(context.getters.getCurrentQuestion.id)
                .then(response => question = response.data)
                .then(() => context.commit('setCurrentQuestion', question))
                .then(() => context.dispatch('fetchUserAnswer')
                )
                .then(() => context.dispatch('fetchComments')
                )
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
        getModeratorIssues(state) {
            return state.moderatorIssues.content
        },
        getUserRoles(state) {
            return state.userRoles
        },
        getUserIssues(state) {
            return state.userIssues.content
        },
        getUserQuestions(state) {
            return state.userQuestions
        },
        getLoading(state) {
            return state.loading
        },
        getUserAnswer(state) {
            return state.userAnswer
        },
        getColors(state) {
            return state.colors
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
        },
    }
})

