var Alice = require('../index.js')
var assert = require('assert');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
var nock = require('nock');
chai.should()
chai.use(chaiAsPromised);
describe('Testing Initialization Failure', function() {
    it('Should require an API Key', function() {
        let alice = new Alice(undefined, 78910)
        expect(alice).to.be.an.instanceof(Error);
    })
    it('Should require an Authorization Key', function() {
        let alice = new Alice(123456, undefined)
        expect(alice).to.be.an.instanceof(Error);
    })
})
describe('Testing Exports', function() {
    beforeEach(function() {
        var apiKey = 123456;
        var authKey = 78910;
        alice = new Alice(apiKey, authKey);
    });
    it('Should initiate alice with the apiKey', function() {
        expect(alice.apiKey).to.equal("apikey=123456")
    })
    it('Should initiate alice with the authKey', function() {
        expect(alice.auth).to.equal("Basic 78910")
    })
    describe('Testing WorkflowStatuses', function() {
        describe('Get Statuses', function() {
            beforeEach(function() {
                var getResponse = [{
                    "id": 301,
                    "name": "Transferred",
                    "abbreviation": "TRANS"
                }, {
                    "id": 824,
                    "name": "Creation",
                    "abbreviation": "CREA"
                }, {
                    "id": 300,
                    "name": "Requested",
                    "abbreviation": "REQ"
                }, {
                    "id": 303,
                    "name": "In Progress",
                    "abbreviation": "WORK"
                }, {
                    "id": 302,
                    "name": "Accepted",
                    "abbreviation": "ACCPT"
                }, {
                    "id": 304,
                    "name": "Closed",
                    "abbreviation": "DONE"
                }, {
                    "id": 306,
                    "name": "Expired",
                    "abbreviation": "EXP"
                }, {
                    "id": 305,
                    "name": "declined",
                    "abbreviation": "DEC"
                }];
                nock('http://rest.aliceapp.com/staff/v1')
                    .get('/hotels/1/workflowStates?apikey=123456')
                    .reply(200, getResponse);
            })
            it('Should get all statuses for a given hotelId', function() {
                return alice.workflowStatuses('getAll', { hotelId: '1' }).should.be.fulfilled;
            })
            it('Should require a hotel ID', function() {
                return alice.workflowStatuses('getAll', {}).should.be.rejected;
            })
            it('Should have all required statuses', function() {
                return alice.workflowStatuses('getAll', { hotelId: '1' }).should.eventually.have.lengthOf(8);
            })
            it('Should get id of status', function() {
                return alice.workflowStatuses('getId', { hotelId: '1', status: 'Expired' }).should.eventually.equal(306);
            })
        })
    });
    describe('Testing Events', function() {
        describe('get events by Hotel Group', function() {
            beforeEach(function() {
                let getResponse = {
                    "websocketUrl": "wss://www.aliceapp.com/555",
                    "longPollingUrl": "https://www.aliceapp.com/555"
                };
                nock('http://rest.aliceapp.com/staff/v1')
                    .get('/hotelGroups/40/events?apikey=123456')
                    .reply(200, getResponse);
            })
            it('getShould require a hotel group id', function() {
                return alice.events('getByHotelGroup', { hotelId: '1' }).should.be.rejected;
            })
            it('getByHotelGroup Should get the urls for the Hotel Group event streams', function() {
                return alice.events('getByHotelGroup', { groupId: '40' })
            })
        })
        describe('get events by Hotel', function() {
            beforeEach(function() {
                let getResponse = {
                    "websocketUrl": "wss://www.aliceapp.com/555",
                    "longPollingUrl": "https://www.aliceapp.com/555"
                };
                nock('http://rest.aliceapp.com/staff/v1')
                    .get('/hotels/202/events?apikey=123456')
                    .reply(200, getResponse);
            })
            it('getByHotel Should require a hotel id', function() {
                return alice.events('getByHotel', { groupId: '1' }).should.be.rejected;
            })
            it('getByHotel Should get the urls for the Hotel event streams', function() {
                return alice.events('getByHotel', { hotelId: '202' })
            })
        })
        describe('get events by Reservation', function() {
            beforeEach(function() {
                let getResponse = {
                    "websocketUrl": "wss://www.aliceapp.com/555",
                    "longPollingUrl": "https://www.aliceapp.com/555"
                };
                nock('http://rest.aliceapp.com/staff/v1')
                    .get('/hotels/202/reservations/xxx-ggg-xxx/events?apikey=123456')
                    .reply(200, getResponse);
            })
            it('getByReservation Should require a hotel id', function() {
                return alice.events('getByReservation', { groupId: '1' , uuid:'xxx-ggg-xxx'}).should.be.rejected;
            })
            it('getByReservation Should require a UUID', function() {
                return alice.events('getByReservation', { hotelId: '202' }).should.be.rejected;
            })
            it('getByReservation Should get the urls for the Hotel event streams', function() {
                return alice.events('getByReservation', { hotelId: '202', uuid: 'xxx-ggg-xxx' })
            })
        })
    });
    describe('Testing Services', function() {
        describe('Get Services', function() {
            beforeEach(function() {
                let getResponse = [{
                    "id": 0,
                    "information": "string",
                    "name": "string",
                    "options": [{
                        "dataType": "Text",
                        "group": "string",
                        "id": 0,
                        "name": "string",
                        "required": true,
                        "values": [
                            "string"
                        ]
                    }],
                    "price": 0
                }];
                nock('http://rest.aliceapp.com/staff/v1')
                    .get('/hotels/1/facilities/2/services?apikey=123456')
                    .reply(200, getResponse);
            })
            it('Should require a hotel ID', function() {
                return alice.services('get', { facilityId: '2' }).should.be.rejected;
            })
            it('Should require a facility ID', function() {
                return alice.services('get', { hotelId: '1' }).should.be.rejected;
            })
            it('Should get the services for a facility', function() {
                return alice.services('get', { hotelId: '1', facilityId: '2' })
            })
        })
    })
    describe('Testing Tickets', function() {
        describe('Get Ticket', function() {
            beforeEach(function() {
                var getResponse = {
                    "approvedComment": "string",
                    "approver": {
                        "id": 0,
                        "name": "string"
                    },
                    "dateCreated": "2016-11-22T22:19:37.079Z",
                    "dueDate": "2016-11-22T22:19:37.079Z",
                    "facility": {
                        "id": 0,
                        "name": "string"
                    },
                    "id": 0,
                    "lastEditedByName": "string",
                    "lastEditedDate": "2016-11-22T22:19:37.079Z",
                    "lastStatusChangedDate": "2016-11-22T22:19:37.079Z",
                    "menuOrder": {
                        "dateCreated": "2016-11-22T22:19:37.079Z",
                        "deliveryDateType": "string",
                        "deliveryTime": "string",
                        "facilityId": 0,
                        "facilityName": "string",
                        "id": 0,
                        "info": "string",
                        "items": [{
                            "comment": "string",
                            "deliveryTime": "string",
                            "id": 0,
                            "name": "string",
                            "options": [{
                                "displayValue": "string",
                                "id": "222",
                                "name": "string",
                                "price": 0,
                                "value": "2020-03-03T12:30:00.000Z"
                            }],
                            "price": 0,
                            "quantity": 0,
                            "totalPrice": 0
                        }],
                        "menuId": 0,
                        "menuName": "string",
                        "status": "string",
                        "totalPrice": 0
                    },
                    "owner": {
                        "id": 0,
                        "name": "string"
                    },
                    "requester": "Guest",
                    "reservation": {
                        "address": "string",
                        "email": "string",
                        "end": "2016-11-22T22:19:37.081Z",
                        "firstname": "string",
                        "id": 0,
                        "language": "string",
                        "lastname": "string",
                        "lateCheckoutTime": "2016-11-22T22:19:37.081Z",
                        "notes": "string",
                        "phone": "string",
                        "prefix": "string",
                        "reservationNumber": "string",
                        "roomNumber": "string",
                        "start": "2016-11-22T22:19:37.081Z",
                        "status": "New",
                        "uuid": "string",
                        "vip": "string"
                    },
                    "serviceRequest": {
                        "dateCreated": "2016-11-22T22:19:37.081Z",
                        "facilityId": 0,
                        "facilityName": "string",
                        "id": 0,
                        "info": "string",
                        "options": [{
                            "displayValue": "string",
                            "id": "222",
                            "name": "string",
                            "value": "2020-03-03T12:30:00.000Z"
                        }],
                        "serviceId": 0,
                        "serviceName": "string",
                        "status": "string"
                    },
                    "ticketType": "MenuOrder",
                    "workflowStatus": {
                        "abbreviation": "string",
                        "id": 0,
                        "name": "string"
                    }
                };
                nock('http://rest.aliceapp.com/staff/v1')
                    .get('/hotels/1/tickets/0?apikey=123456')
                    .reply(200, getResponse);
            })
            it('Should require a hotelId', function() {
                return alice.tickets('get', { ticketId: '0' }).should.be.rejected;
            })
            it('Should require a ticketId', function() {
                return alice.tickets('get', { hotelId: '1' }).should.be.rejected;
            })
            it('Should get a ticket', function() {
                return alice.tickets('get', { hotelId: '1', ticketId: '0' }).should.be.fulfilled;
            })
            it('Should have an ID', function() {
                return alice.tickets('get', { hotelId: '1', ticketId: '0' }).should.eventually.have.property("id");
            })
            it('Should have the same ID as the request', function() {
                return alice.tickets('get', { hotelId: '1', ticketId: '0' })
                    .then(ticket => {
                        expect(ticket.id).to.equal(0);
                    })
            })
        });
        describe('Create Ticket', function() {
            beforeEach(function() {
                var createResponse = {
                    id: 0
                };
                nock('http://rest.aliceapp.com/staff/v1')
                    .post('/hotels/1/tickets/serviceRequest?apikey=123456')
                    .reply(200, createResponse);
            })
            it('Should require a hotel ID', function() {
                return alice.tickets('create', {
                    request: {
                        "dueDate": "2016-11-22T22:19:37.270Z",
                        "info": "Bring towels",
                        "lang": "en",
                        "options": [{
                            "id": "222",
                            "value": "2020-03-03T12:30:00.000Z"
                        }],
                        "owner": 0,
                        "requester": "Guest",
                        "reservation": 0,
                        "roomNumber": "string",
                        "serviceId": "102"
                    }
                }).should.be.rejected;
            })
            it('Should require a request', function() {
                return alice.tickets('create', { hotelId: '1' }).should.be.rejected;
            })
            it('Should create a service request', function() {
                return alice.tickets('create', {
                    hotelId: '1',
                    request: {
                        "dueDate": "2016-11-22T22:19:37.270Z",
                        "info": "Bring towels",
                        "lang": "en",
                        "options": [{
                            "id": "222",
                            "value": "2020-03-03T12:30:00.000Z"
                        }],
                        "owner": 0,
                        "requester": "Guest",
                        "reservation": 0,
                        "roomNumber": "string",
                        "serviceId": "102"
                    }
                }).should.be.fulfilled;
            })
        })
        describe('Update Ticket', function() {
            beforeEach(function() {
                nock('http://rest.aliceapp.com/staff/v1')
                    .put('/hotels/1/tickets/2/serviceRequest?apikey=123456')
                    .reply(204, "success");
            })
            it('Should require a hotel ID', function() {
                return alice.tickets('update', {
                    ticketId: '2',
                    request: {
                        "info": "string",
                        "options": [{
                            "id": "222",
                            "value": "2020-03-03T12:30:00.000Z"
                        }]
                    }
                }).should.be.rejected;
            })
            it('Should require a ticket ID', function() {
                return alice.tickets('update', {
                    hotelId: '1',
                    request: {
                        "info": "string",
                        "options": [{
                            "id": "222",
                            "value": "2020-03-03T12:30:00.000Z"
                        }]
                    }
                }).should.be.rejected;
            })
            it('Should require a request', function() {
                return alice.tickets('update', { hotelId: '1', ticketId: '2' }).should.be.rejected;
            })
            it('Should update a service request', function() {
                return alice.tickets('update', {
                    hotelId: '1',
                    ticketId: '2',
                    request: {
                        "info": "string",
                        "options": [{
                            "id": "222",
                            "value": "2020-03-03T12:30:00.000Z"
                        }]
                    }
                }).should.be.fulfilled;
            })
        })
        describe('Update Status', function() {
            beforeEach(function() {
                nock('http://rest.aliceapp.com/staff/v1')
                    .put('/hotels/1/tickets/2/workflowState?apikey=123456')
                    .reply(204, "success");
            })
            it('Should require a hotel ID', function() {
                return alice.tickets('status', {
                    ticketId: '2',
                    request: {
                        "workflowStatusId": 0
                    }
                }).should.be.rejected;
            })
            it('Should require a ticket ID', function() {
                return alice.tickets('status', {
                    hotelId: '1',
                    request: {
                        "workflowStatusId": 0
                    }
                }).should.be.rejected;
            })
            it('Should require a request', function() {
                return alice.tickets('status', { hotelId: '1', ticketId: '2' }).should.be.rejected;
            })
            it('Should update a workflow status', function() {
                return alice.tickets('status', {
                    hotelId: '1',
                    ticketId: '2',
                    request: {
                        "workflowStatusId": 0
                    }
                }).should.be.fulfilled;
            })
        })
        describe('Search Tickets', function() {
            beforeEach(function() {
                var searchResponse = [{
                    "approvedComment": "string",
                    "approver": {
                        "id": 0,
                        "name": "string"
                    },
                    "dateCreated": "2016-11-22T22:19:37.199Z",
                    "dueDate": "2016-11-22T22:19:37.199Z",
                    "facility": {
                        "id": 0,
                        "name": "string"
                    },
                    "id": 0,
                    "lastEditedByName": "string",
                    "lastEditedDate": "2016-11-22T22:19:37.199Z",
                    "lastStatusChangedDate": "2016-11-22T22:19:37.199Z",
                    "menuOrder": {
                        "dateCreated": "2016-11-22T22:19:37.199Z",
                        "deliveryDateType": "string",
                        "deliveryTime": "string",
                        "facilityId": 0,
                        "facilityName": "string",
                        "id": 0,
                        "info": "string",
                        "items": [{
                            "comment": "string",
                            "deliveryTime": "string",
                            "id": 0,
                            "name": "string",
                            "options": [{
                                "displayValue": "string",
                                "id": "222",
                                "name": "string",
                                "price": 0,
                                "value": "2020-03-03T12:30:00.000Z"
                            }],
                            "price": 0,
                            "quantity": 0,
                            "totalPrice": 0
                        }],
                        "menuId": 0,
                        "menuName": "string",
                        "status": "string",
                        "totalPrice": 0
                    },
                    "owner": {
                        "id": 0,
                        "name": "string"
                    },
                    "requester": "Guest",
                    "reservation": {
                        "address": "string",
                        "email": "string",
                        "end": "2016-11-22T22:19:37.199Z",
                        "firstname": "string",
                        "id": 0,
                        "language": "string",
                        "lastname": "string",
                        "lateCheckoutTime": "2016-11-22T22:19:37.199Z",
                        "notes": "string",
                        "phone": "string",
                        "prefix": "string",
                        "reservationNumber": "string",
                        "roomNumber": "string",
                        "start": "2016-11-22T22:19:37.199Z",
                        "status": "New",
                        "uuid": "string",
                        "vip": "string"
                    },
                    "serviceRequest": {
                        "dateCreated": "2016-11-22T22:19:37.199Z",
                        "facilityId": 0,
                        "facilityName": "string",
                        "id": 0,
                        "info": "string",
                        "options": [{
                            "displayValue": "string",
                            "id": "222",
                            "name": "string",
                            "value": "2020-03-03T12:30:00.000Z"
                        }],
                        "serviceId": 0,
                        "serviceName": "string",
                        "status": "string"
                    },
                    "ticketType": "MenuOrder",
                    "workflowStatus": {
                        "abbreviation": "string",
                        "id": 0,
                        "name": "string"
                    }
                }];
                nock('http://rest.aliceapp.com/staff/v1')
                    .get('/hotels/1/tickets?ticketTypes=ServiceRequest&apikey=123456')
                    .reply(200, searchResponse);
                nock('http://rest.aliceapp.com/staff/v1')
                    .get('/hotels/1/tickets?query=airport&ticketTypes=ServiceRequest&apikey=123456')
                    .reply(200, searchResponse);
            });
            it('Should require hotelId',
                function() {
                    return alice.tickets('search', { ticketTypes: 'ServiceRequest' }).should.be.rejected;
                });
            it('Should search tickets"', function() {
                return alice.tickets('search', { hotelId: '1', ticketTypes: 'ServiceRequest' }).should.be.fulfilled;
            });
            it('Should loop through multiple params"', function() {
                return alice.tickets('search', { hotelId: '1', query: "airport", ticketTypes: 'ServiceRequest' }).should.be.fulfilled;
            });
        })
    });
});
