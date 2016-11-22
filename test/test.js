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
                    id: 2,
                    ticketType: 'ServiceRequest',
                    dateCreated: '2016-11-21T20:38:54.000+0000',
                    dueDate: '2016-11-22T06:15:00.000+0000',
                    lastStatusChangedDate: '2016-11-21T20:38:54.000+0000',
                    reservation: {
                        uuid: '123456',
                        start: '2016-11-22T06:00:00Z',
                        end: '2016-11-24T06:00:00Z',
                        reservationNumber: '78910',
                        firstname: 'John',
                        lastname: 'Doe',
                        phone: '+155555555',
                        email: 'john@doe.com',
                        id: 123456,
                        status: 'Approved'
                    },
                    approver: { id: 123456 },
                    workflowStatus: { id: 123456, name: 'Requested', abbreviation: 'REQ' },
                    requester: 'Guest'
                };
                nock('http://rest.aliceapp.com/staff/v1')
                    .get('/hotels/1/tickets/2?apikey=123456')
                    .reply(200, getResponse);
            })
            it('Should get a ticket', function() {
                return alice.tickets('get', { hotelId: '1', ticketId: '2' }).should.be.fulfilled;
            })
            it('Should have an ID', function() {
                return alice.tickets('get', { hotelId: '1', ticketId: '2' }).should.eventually.have.property("id");
            })
            it('Should have the same ID as the request', function() {
                return alice.tickets('get', { hotelId: '1', ticketId: '2' })
                .then(ticket => {
                    expect(ticket.id).to.equal(2);
                })
            })
        });
        describe('Search Tickets', function() {
            beforeEach(function() {
                var searchResponse = [{
                    id: 1,
                    ticketType: 'ServiceRequest',
                    serviceRequest: {
                        id: 1,
                        serviceId: 1,
                        serviceName: 'First Service'
                    },
                    dateCreated: '2016-05-18T21:38:46.000+0000',
                    dueDate: '2016-05-20T04:00:00.000+0000',
                    lastStatusChangedDate: '2016-07-14T14:34:53.000+0000',
                    lastEditedDate: '2016-07-14T14:34:53.000+0000',
                    lastEditedByName: 'John Doe',
                    reservation: {
                        uuid: '123456',
                        start: '2016-05-20T04:00:00Z',
                        end: '2016-05-23T04:00:00Z',
                        reservationNumber: '123456',
                        firstname: 'First',
                        lastname: 'Guest',
                        language: 'en',
                        id: 125192,
                        status: 'Approved'
                    },
                    owner: { id: 1, name: 'Joe Owner' },
                    approver: { id: 1, name: 'Joe Approver' },
                    workflowStatus: { id: 1, name: 'Closed', abbreviation: 'DONE' },
                    requester: 'Guest'
                }, {
                    id: 2,
                    ticketType: 'ServiceRequest',
                    serviceRequest: {
                        id: 2,
                        serviceId: 2,
                        serviceName: 'Second Service'
                    },
                    dateCreated: '2016-05-19T20:26:31.000+0000',
                    dueDate: '2016-05-20T04:00:00.000+0000',
                    lastStatusChangedDate: '2016-07-14T14:26:03.000+0000',
                    lastEditedDate: '2016-07-14T14:26:03.000+0000',
                    lastEditedByName: 'Jane Doe',
                    reservation: {
                        uuid: '234567',
                        start: '2016-05-31T04:00:00Z',
                        end: '2016-06-01T04:00:00Z',
                        reservationNumber: '234567',
                        firstname: 'Second',
                        lastname: 'Guest',
                        language: 'en',
                        id: 2,
                        status: 'Approved'
                    },
                    owner: { id: 2, name: 'Joe Owner' },
                    approver: { id: 2, name: 'Joe Approver' },
                    workflowStatus: { id: 2, name: 'Closed', abbreviation: 'DONE' },
                    requester: 'Guest'
                }, {
                    id: 3,
                    ticketType: 'ServiceRequest',
                    serviceRequest: {
                        id: 3,
                        serviceId: 3,
                        serviceName: 'Third Service'
                    },
                    dateCreated: '2016-05-24T13:59:16.000+0000',
                    dueDate: '2016-05-24T04:00:00.000+0000',
                    lastStatusChangedDate: '2016-07-14T14:24:39.000+0000',
                    lastEditedDate: '2016-07-14T14:24:39.000+0000',
                    lastEditedByName: 'Joe Doe',
                    reservation: {
                        uuid: '345678',
                        start: '2016-04-07T04:00:00Z',
                        end: '2016-06-30T04:00:00Z',
                        roomNumber: 'NY',
                        reservationNumber: '345678',
                        firstname: 'Third',
                        lastname: 'Guest',
                        language: 'en',
                        id: 123456,
                        status: 'Approved',
                        lateCheckoutTime: '2016-05-05T04:00:00.000+0000'
                    },
                    owner: { id: 3, name: 'Joe Owner' },
                    approver: { id: 3, name: 'Joe Approver' },
                    workflowStatus: { id: 5678, name: 'Closed', abbreviation: 'DONE' },
                    requester: 'Guest'
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
