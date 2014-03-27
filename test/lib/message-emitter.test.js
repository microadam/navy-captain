var createMessageEmitter = require('../../lib/message-emitter')
  , logger = { info: function() {} }
  , config =
      { name: 'name'
      , applications: { test: [ 'testing', 'staging' ] }
      }

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
            Object.keys(data.applications).length.should.equal(1)
            Object.keys(data.applications)[0].should.equal('test')
            data.applications.test.length.should.equal(2)
            data.applications.test[0].should.equal('testing')
            data.applications.test[1].should.equal('staging')
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
