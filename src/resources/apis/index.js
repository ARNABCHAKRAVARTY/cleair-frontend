const axios = require("axios");

//const server_host = "http://192.168.1.2:5000"
const server_host = "http://13.235.245.238:9889/"
//const server_host = "http://167.99.235.112:5000"
//const server_host = "http://documedicl.arcvisions.com:5050"

function set_token(token) {
    return axios.create({
        baseURL: server_host,
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
}

let http_jwt = set_token('')

function update_jwt(token) {
    http_jwt = set_token(token)
}

const http_all = axios.create({
    baseURL: server_host
})

import devices from "./devices"
import locations from "./locations"
import current from "./current"

export { update_jwt, http_jwt, http_all, devices, locations, current }
