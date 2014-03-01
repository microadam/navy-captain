var createMessageEmitter = require('../../lib/message-emitter')
  , logger = { info: function() {} }
  , config = { appId: 'appId', name: 'name' }

function createClient(sendFn) {
  return { send: sendFn }
}

describe('message-emitter', function () {

  describe('emitRegisterMessage()', function () {

    it('should send correct data', function (done) {
      var messageEmitter = createMessageEmitter({ logger: logger, config: config })
        , client = createClient(function (event, data) {
            event.should.equal('captainRegister')
            Object.keys(data).length.should.equal(2)
            data.appId.should.equal('appId')
            data.captainName.should.equal('name')
            done()
          })

      messageEmitter.emitRegisterMessage(client)
    })

  })

  describe('emitOrderMessage()', function () {

    it('should send correct data', function (done) {
      var messageEmitter = createMessageEmitter({ logger: logger, config: config })
        , client = createClient(function (event, data) {
            event.should.equal('captainOrderMessage')
            Object.keys(data).length.should.equal(3)
            data.message.should.equal('hello')
            data.captainName.should.equal('name')
            data.clientId.should.equal(1234)
            done()
          })

      messageEmitter.emitOrderMessage(client, 1234, 'hello')
    })

  })

})
