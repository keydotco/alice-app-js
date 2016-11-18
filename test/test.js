var alice = require('../index.js')
var assert = require('assert');
describe('Testing Exports', function() {
  describe('helloWorld', function() {
    it('should return "Hello, world."', function() {
      assert.equal('Hello, world.', alice.helloWorld());
    });
  });
});