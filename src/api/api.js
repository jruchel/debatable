import {sendRequest} from "@/utils/requests";


let backendAddress = 'https://debatable-server.herokuapp.com'

export function getRandomQuestion(questionId) {
    return sendRequest(
        backendAddress,
        '/questions/random/' + questionId,
        'get',
        {},
        {},
    )
}

export function getCommentsOfQuestion(questionId) {
    return sendRequest(
        backendAddress,
        '/questions/comments/' + questionId,
        'get',
        {},
        {},
    )
}

export function register(user) {
    return sendRequest(
        backendAddress,
        '/security/register',
        'post',
        user,
        {},
    )
}

export function authenticate(user) {
    return sendRequest(
        backendAddress,
        '/security/authenticate',
        'post',
        user,
        {},
    )
}

export function postTrialQuestion(question) {
    return sendRequest(
        backendAddress,
        '/questions/trial',
        'post',
        question,
        {},
    )
}

export function postQuestion(question, token) {
    return sendRequest(
        backendAddress,
        '/questions',
        'post',
        question,
        token,
    )
}

export function postComment(question, comment, token) {
    return sendRequest(
        backendAddress,
        '/comments',
        'post',
        {key: question, value: {content: comment}},
        token,
    )
}

export function deleteComment(comment, token) {
    return sendRequest(
        backendAddress,
        '/comments',
        'delete',
        comment,
        token,
    )
}

export function getUser(token) {
    return sendRequest(
        backendAddress,
        '/user',
        'get',
        {},
        token,
    )
}

export function submitAnswer(question, answerNumber, token) {
    return sendRequest(
        backendAddress,
        '/answers',
        'post',
        {key: question, value: answerNumber},
        token
    )
}

export function updateQuestion(questionId) {
    return sendRequest(
        backendAddress,
        '/questions/' + questionId,
        'get',
        {},
        {}
    )
}

export function fetchUserAnswer(questionId, token) {
    return sendRequest(
        backendAddress,
        '/user/answer/' + questionId,
        'get',
        {},
        token
    )
}