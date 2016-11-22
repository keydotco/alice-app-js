var Alice = require('../index.js')
var assert = require('assert');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
var nock = require('nock');
chai.should()
chai.use(chaiAsPromised);

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
            });
            it('Should require hotelId',
                function() {
                    return alice.tickets('search', { ticketTypes: 'ServiceRequest' }).should.be.rejected;
                });
            it('Should search tickets"', function() {
                return alice.tickets('search', { hotelId: '1', ticketTypes: 'ServiceRequest' }).should.be.fulfilled;
            });
        })
    });
});
