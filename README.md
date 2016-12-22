[![CircleCI](https://circleci.com/gh/keydotco/alice-app-js.svg?style=shield)](https://circleci.com/gh/keydotco/alice-app-js)
#Alice.js
A node.js wrapper for the [Alice App API](http://developer.aliceapp.com/).
## Table of Contents
* [Installation](#installation)
* [Usage](#usage)
	* [Initialization](#initialization)
	* [Tickets](#tickets)


## Installation
`npm install alice-app`

##Usage
### Initialization
```javascript
var Alice = require('alice-app');
alice = new Alice('YOUR API KEY', 'YOUR AUTHENTICATION KEY');
```
### Tickets
#### Get
Request:
```javascript
alice.tickets('get', { hotelId: 'HOTELID', ticketId: 'TICKETID' })
```
#### Create
```javascript
alice.tickets('create', {
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
})
```
#### Search
```javascript
alice.tickets('search', { hotelId: '1', ticketTypes: 'ServiceRequest' })
```
