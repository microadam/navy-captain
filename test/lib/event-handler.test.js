var createHandleEvents = require('../../lib/event-handler')
  , EventEmitter = require('events').EventEmitter

function Client() {
  EventEmitter.call(this)
}

Client.prototype = Object.create(EventEmitter.prototype)

describe('event-handler', function () {

  describe('handleEvents()', function () {

    it('should listen to the serverMessage event', function (done) {
      var client = new Client()
        , logger =
            { info: function (message) {
                message.should.equal('Admiral: hello')
                done()
              }
            }
        , handleEvents = createHandleEvents(logger)

      handleEvents(client)
      client.emit('serverMessage', { message: 'hello' })
    })

  })

})
