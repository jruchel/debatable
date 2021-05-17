import axios from "axios";


export function sendRequest(address, endpoint, method, body, headers) {
    headers['Content-Type'] = 'application/json'
    return axios({
        method: method.toLowerCase(),
        url: address + endpoint,
        headers: headers,
        data: body
    })
}