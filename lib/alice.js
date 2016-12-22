'use strict'
var fetch = require('node-fetch');

class Alice {
    constructor(key, auth) {
        if (!key) {
            Promise.reject(new Error("An API key is required"));
        }
        if (!auth) {
            Promise.reject(new Error("An Auth key is required"));
        }
        this.contentType = 'application/json'
        this.hostname = 'rest.aliceapp.com/staff/v1/hotels/'
        this.apiKey = 'apikey=' + key
        this.protocol = 'http://'
        this.auth = "Basic " + auth;
        this.methods = {
            tickets: {
                get(params) {
                    if (!params.hotelId) {
                        return Promise.reject(new Error("A Hotel ID is required"));
                    }
                    if (!params.ticketId) {
                        return Promise.reject(new Error("A Ticket ID is required"));
                    }
                    return { type: "GET", endpoint: `hotels/${params.hotelId}/tickets/${params.ticketId}` }
                },
                search(params) {
                    if (!params.hotelId) {
                        return Promise.reject(new Error("A Hotel ID is required"));
                    }
                    let endpoint = `hotels/${params.hotelId}/tickets`
                    let paramsArray = Object.keys(params);
                    let hotelIdIndex = paramsArray.indexOf('hotelId');
                    paramsArray.splice(hotelIdIndex, 1);
                    paramsArray.forEach((key, i) => {
                        if (i === 0) {
                            endpoint += `?${key}=${params[key]}`
                        } else {
                            endpoint += `&${key}=${params[key]}`
                        }
                    })
                    return { type: "GET", endpoint: endpoint }
                },
                create(params) {
                    if (!params.hotelId) {
                        return Promise.reject(new Error("A Hotel ID is required"));
                    }
                    if (!params.request) {
                        return Promise.reject(new Error("A Request is required"));
                    }
                    return { type: "POST", endpoint: `hotels/${params.hotelId}/tickets/serviceRequest` }
                },
                update(params) {
                    if (!params.hotelId) {
                        return Promise.reject(new Error("A Hotel ID is required"));
                    }
                    if (!params.ticketId) {
                        return Promise.reject(new Error("A Ticket ID is required"));
                    }
                    if (!params.request) {
                        return Promise.reject(new Error("A Request is required"));
                    }
                    return {type: "PUT", endpoint: `hotels/${params.hotelId}/tickets/${params.ticketId}/serviceRequest`}
                },
                status(params) {
                    if (!params.hotelId) {
                        return Promise.reject(new Error("A Hotel ID is required"));
                    }
                    if (!params.ticketId) {
                        return Promise.reject(new Error("A Ticket ID is required"));
                    }
                    if (!params.request) {
                        return Promise.reject(new Error("A Request is required"));
                    }
                    return {type: "PUT", endpoint: `hotels/${params.hotelId}/tickets/${params.ticketId}/workflowStatus`}
                }
            },
            services: {
                get(params) {
                    if (!params.hotelId) {
                        Promise.reject(new Error("A Hotel ID is required"));
                    }
                    if (!params.facilityId) {
                        Promise.reject(new Error("A facility ID is required"));
                    }
                    return { type: "GET", endpoint: `hotels/${params.hotelId}/facilities/${params.facilityId}/services` }
                }
            }
        }
    }
    buildRequestArguments(type, params) {
        const payload = {
            headers: {
                Authorization: this.auth,
                'Content-Type': 'application/json'
            },
            method: type
        };
        if (type === 'GET') {
            payload.params = params;
        } else {
            payload.body = JSON.stringify(params.request);
        }
        return payload;
    }
    request(action, params) {
        const type = action.type;
        let url = `http://rest.aliceapp.com/staff/v1/${action.endpoint}`;
        if (url.includes('?')) {
            url += `&${this.apiKey}`
        } else {
            url += `?${this.apiKey}`
        }
        // console.log(url)
        const args = this.buildRequestArguments(type, params);
        // console.log(args)
        return fetch(url, args)
            .then(response => {
                return response.json();
            })
            .then(function(json) {
                return json;
            });
    }
    action(action, method, params) {
        const methodToCall = this.methods[action][method](params);
        return this.request(methodToCall, params);
    }
    tickets(method, params) {
        return this.action('tickets', method, params);
    }
    services(method, params) {
        return this.action('services', method, params);
    }
}
module.exports = Alice;
