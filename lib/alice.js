'use strict'
const fetch = require('node-fetch');

class Alice {
    constructor(key, auth) {
        if (!key) {
            return new Error("An API key is required");
        }
        if (!auth) {
            return new Error("An Auth key is required");
        }
        this.contentType = 'application/json'
        this.hostname = 'rest.aliceapp.com/staff/v1/hotels/'
        this.apiKey = 'apikey=' + key
        this.protocol = 'http://'
        this.auth = "Basic " + auth;
        this.methods = {
            workflowStatuses: {
                getAll(params) {
                    if (!params.hotelId) {
                        return Promise.reject(new Error("A Hotel ID is required"));
                    }
                    return { type: "GET", endpoint: `hotels/${params.hotelId}/workflowStatuses` }
                }
            },
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
                // updateStatus(params) {
                //     if (!params.hotelId) {
                //         return Promise.reject(new Error("A Hotel ID is required"));
                //     }
                //     if (!params.ticketId) {
                //         return Promise.reject(new Error("A Ticket ID is required"));
                //     }
                //     if (!params.statusId) {
                //         return Promise.reject(new Error("Ticket workflowStatusId is required"));
                //     }
                //     // curl -X PUT --header 'Content-Type: application/json' --header 'Accept: application/json;charset=UTF-8' --header 'Authorization: Basic a2V5LmFwaTplOD9EYzh3eUF9NWxnMjdKTklYcEBA' -d '{
                //     //   "workflowStatusId": 303
                //     // }' 'http://rest.aliceapp.com/staff/v1/hotels/202/tickets/689815/workflowStatus?apikey=0a0ebf41-571b-4563-a65b-932a91efa792'
                //     return { type: "PUT", endpoint: `hotels/${params.hotelId}/tickets/${params.ticketId}/workflowStatus` }
                // }
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
        return fetch(url, args).then(response => response.json())
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
    workflowStatuses(method, params) {
        function getId(res, params){
            let id;
            res.forEach(e => {
                if (e.name.toLowerCase() === params.status.toLowerCase()) {
                    id = e.id;
                }
            });
            return id;
        }
        if (method === 'getId') {
            return this.action('workflowStatuses','getAll', params).then(statuses => getId(statuses, params));
        } else {
            return this.action('workflowStatuses', method, params);
        }
    }
}
module.exports = Alice;
