var createRequestSender = require('../../lib/request-sender')
  , logger = require('mc-logger')

function createClient(sendFn) {
  return { send: sendFn }
}

describe('request-sender', function () {

  describe('sendExecuteOrder()', function () {

    it('should send correct data and return response', function (done) {
      var requestSender = createRequestSender({ logger: logger })
        , client = createClient(function (event, data, callback) {
            event.should.equal('captainExecuteOrder')
            Object.keys(data).length.should.equal(4)
            data.appId.should.equal('appId')
            data.clientId.should.equal(1)
            data.order.should.equal('myOrder')
            data.orderArgs.length.should.equal(1)
            data.orderArgs[0].should.equal('argOne')
            callback()
          })

      requestSender.sendExecuteOrder(client
      , 1
      , 'appId'
      , 'myOrder'
      , [ 'argOne' ]
      , function () {
          done()
        }
      )
    })

  })

})
