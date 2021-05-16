import {sendRequest} from "@/utils/requests";


let backendAddress = 'http://localhost:8081'

export function getRandomQuestion(currentQuestion, onComplete, onError) {
    return sendRequest(
        backendAddress,
        '/questions/random',
        'post',
        currentQuestion,
        {},
        onComplete,
        onError)
}

export function getCommentsOfQuestion(question, onComplete, onError) {
    return sendRequest(
        backendAddress,
        '/questions/comments',
        'post',
        question,
        {},
        onComplete,
        onError
    )
}

export function register(user, onComplete, onError) {
    return sendRequest(
        backendAddress,
        '/security/register',
        'post',
        user,
        {},
        onComplete,
        onError
    )
}

export function authenticate(user, onComplete, onError) {
    return sendRequest(
        backendAddress,
        '/security/authenticate',
        'post',
        user,
        {},
        onComplete,
        onError
    )
}

export function postTrialQuestion(question, onComplete, onError) {
    return sendRequest(backendAddress,
        '/questions/trial',
        'post',
        question,
        {},
        onComplete,
        onError
    )
}

export function postQuestion(question, token, onComplete, onError) {
    return sendRequest(backendAddress,
        '/questions',
        'post',
        question,
        token,
        onComplete,
        onError
    )
}

export function postComment(question, comment, token, onComplete, onError) {
    return sendRequest(backendAddress,
        '/comments',
        'post',
        {key: question, value: {content: comment}},
        token,
        onComplete,
        onError
    )
}