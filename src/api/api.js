import {sendRequest} from "@/utils/requests";


let backendAddress = 'http://localhost:8081'

export function getRandomQuestion(currentQuestion) {
    return sendRequest(
        backendAddress,
        '/questions/random',
        'post',
        currentQuestion,
        {},
    )
}

export function getCommentsOfQuestion(question) {
    return sendRequest(
        backendAddress,
        '/questions/comments',
        'post',
        question,
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
    return sendRequest(backendAddress,
        '/questions/trial',
        'post',
        question,
        {},
    )
}

export function postQuestion(question, token) {
    return sendRequest(backendAddress,
        '/questions',
        'post',
        question,
        token,
    )
}

export function postComment(question, comment, token) {
    return sendRequest(backendAddress,
        '/comments',
        'post',
        {key: question, value: {content: comment}},
        token,
    )
}

export function deleteComment(comment, token) {
    return sendRequest(backendAddress,
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