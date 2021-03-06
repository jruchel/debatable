import {sendRequest} from "@/utils/requests";


let backendAddress = 'https://debatable-server.herokuapp.com'

export function getRandomQuestion(questionId) {
    if (questionId)
        return sendRequest(
            backendAddress,
            '/questions/random/' + questionId,
            'get',
            {},
            {},
        )
    else
        return sendRequest(
            backendAddress,
            '/questions/random',
            'get',
            {},
            {},
        )
}

export function getCommentsOfQuestion(questionId) {
    return sendRequest(
        backendAddress,
        '/questions/' + questionId + '/comments',
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

export function getCommentsPage(questionId, page, size) {
    return sendRequest(
        backendAddress,
        '/questions/' + questionId + '/comments?page=' + page + '&size=' + size,
        'get',
        {},
        {}
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

export function postComment(questionId, comment, token) {
    return sendRequest(
        backendAddress,
        '/comments/' + questionId,
        'post',
        comment,
        token,
    )
}

export function deleteComment(commentId, token) {
    return sendRequest(
        backendAddress,
        '/comments/' + commentId,
        'delete',
        {},
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

export function submitAnswer(questionId, answer, token) {
    return sendRequest(
        backendAddress,
        '/answers/' + questionId + '?answer=' + answer,
        'post',
        {},
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

export function fetchUserRoles(token) {
    return sendRequest(
        backendAddress,
        '/user/roles',
        'get',
        {},
        token
    )
}

export function fetchUserQuestions(token) {
    return sendRequest(
        backendAddress,
        '/questions/user',
        'get',
        {},
        token
    )
}

export function deleteQuestion(questionId, token) {
    return sendRequest(
        backendAddress,
        '/questions/' + questionId,
        'delete',
        {},
        token
    )
}

export function changePassword(token, passwordDTO) {
    return sendRequest(
        backendAddress,
        '/user/password',
        'patch',
        passwordDTO,
        token
    )
}

export function changeEmail(token, email) {
    return sendRequest(
        backendAddress,
        '/user/email',
        'patch',
        email,
        token
    )
}

export function changeUsername(token, username) {
    return sendRequest(
        backendAddress,
        '/user/username',
        'patch',
        username,
        token
    )
}

export function submitIssue(issue, token) {
    if (!token) {
        return sendRequest(
            backendAddress,
            '/issues',
            'post',
            {}
        )
    }
    return sendRequest(
        backendAddress,
        '/user/issues',
        'post',
        issue,
        token
    )
}

export function fetchIssueSubjects() {
    return sendRequest(
        backendAddress,
        '/issues/subjects',
        'get',
        {},
        {}
    )
}

export function fetchIssues(subject, email, description, union) {
    let parameters = new Map()
    parameters.set('subject', subject)
    parameters.set('email', email)
    parameters.set('description', description)
    parameters.set('union', union)

    return sendRequest(
        backendAddress,
        constructEndpoint('/issues', [], parameters),
        'get',
        {},
        {}
    )
}

export function fetchUserIssues(token) {
    return sendRequest(
        backendAddress,
        '/user/issues',
        'get',
        {},
        token
    )
}

export function deleteUserIssue(token, id) {
    return sendRequest(
        backendAddress,
        '/user/issues/' + id,
        'delete',
        {},
        token
    )
}

export function fetchModeratorIssues(token, page, size) {
    if (page && size) {
        return sendRequest(
            backendAddress,
            '/issues?page=' + page + '&size=' + size,
            'get',
            {},
            token
        )
    }
    return sendRequest(
        backendAddress,
        '/issues',
        'get',
        {},
        token
    )
}

export function resolveIssue(token, issueId) {
    return sendRequest(
        backendAddress,
        '/issues/resolve/' + issueId,
        'patch',
        {},
        token
    )
}

export function closeIssue(token, issueId) {
    return sendRequest(
        backendAddress,
        '/issues/close/' + issueId,
        'patch',
        {},
        token
    )
}

export function getRatingAdjectives() {
    return sendRequest(
        backendAddress,
        '/ratings/adjectives',
        'get',
        {}
    )
}

export function getCommentRatingData(commentId) {
    return sendRequest(
        backendAddress,
        '/ratings/comment/' + commentId
    )
}

export function getQuestionRatingData(questionId) {
    return sendRequest(
        backendAddress,
        '/ratings/question/' + questionId,
        'get',
        {}
    )
}

export function postRating(rating, questionId, token) {
    return sendRequest(
        backendAddress,
        '/ratings/' + questionId + '?rating=' + rating,
        'post',
        token
    )
}

function constructEndpoint(endpoint, pathVariables, pathParameters) {
    let result = endpoint
    for (let variable of pathVariables) {
        result += '/' + variable
    }
    let initialVariable = true
    for (let [key, value] of pathParameters) {
        if (initialVariable) {
            result += '?' + key + '=' + value
            initialVariable = false
        } else {
            result += '&' + key + '=' + value
        }
    }
    return result
}