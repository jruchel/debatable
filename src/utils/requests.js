import axios from "axios";

export function sendRequest(address, endpoint, method, body, headers, onComplete, onError) {
    headers['Content-Type'] = 'application/json'
    axios({
        method: method.toLowerCase(),
        url: address + endpoint,
        headers: headers,
        data: body
    }).then(response => onComplete(response)).catch(function (error) {
        onError(error.response)
    })
}