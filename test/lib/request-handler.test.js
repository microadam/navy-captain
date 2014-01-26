var sinon = require('sinon')
  , EventEmitter = require('events').EventEmitter
  , orderExecuter = { execute: function () {} }
  , orderManager =
      { getOrderNames: function () {}
      , getOrderSteps: function () {}
      }
  , handleRequests = require('../../lib/request-handler')(orderManager, orderExecuter)

function getClient(requestData) {

  function Client() {
    EventEmitter.call(this)
  }

  Client.prototype = Object.create(EventEmitter.prototype)
  Client.prototype.on = function (event, callback) {
    callback(requestData, function () {})
  }
  return new Client()
}

describe('request-handler', function () {

  describe('handleRequests()', function () {

    it('should handle list orders request', function () {
      var client = getClient({ request: 'orderList' })
        , mockOrderManager = sinon.mock(orderManager)

      mockOrderManager.expects('getOrderNames').once()

      handleRequests(client)
      client.emit('request')

      mockOrderManager.verify()
    })

    it('should handle get order steps request', function () {
      var client = getClient({ request: 'orderStepList' })
        , mockOrderManager = sinon.mock(orderManager)

      mockOrderManager.expects('getOrderSteps').once()

      handleRequests(client)
      client.emit('request')

      mockOrderManager.verify()
    })

    it('should handle execute order request', function () {
      var client = getClient({ request: 'orderExecute' })
        , mockOrderExecuter = sinon.mock(orderExecuter)

      mockOrderExecuter.expects('execute').once()

      handleRequests(client)
      client.emit('request')

      mockOrderExecuter.verify()
    })

  })

})
