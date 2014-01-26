var sinon = require('sinon')
  , rewire = require('rewire')
  , EventEmitter = require('events').EventEmitter
  , logger = { info: noop }
  , messageEmitter = require('../../lib/message-emitter')()
  , createSocketCaptain = rewire('../../lib/socket-captain')

function Socket() {
  EventEmitter.call(this)
}

Socket.prototype = Object.create(EventEmitter.prototype)

function noop() {}

describe('socket-captain', function () {

  describe('run()', function () {

    var socketStub = null
      , handleEvents = null
      , handleRequests = null

    beforeEach(function () {
      socketStub = sinon.stub()
      socketStub.returns(new Socket())
      handleEvents = sinon.spy()
      handleRequests = sinon.spy()

      /* jshint camelcase: false */
      createSocketCaptain.__set__
      ( { Socket: socketStub
        , createMessageEmitter: function () { return messageEmitter }
        , createHandleEvents: function () { return handleEvents }
        , createHandleRequests: function () { return handleRequests }
        }
      )
    })

    it('should emit register event and handle events and requests on server connection', function () {
      var mockMessageEmitter = sinon.mock(messageEmitter)
        , socketCaptain = createSocketCaptain(null, logger, {})
        , client = socketCaptain.run()

      mockMessageEmitter.expects('emitRegisterMessage').once()

      client.emit('open')
      handleEvents.calledOnce.should.equal(true)
      handleRequests.calledOnce.should.equal(true)
      mockMessageEmitter.verify()
    })

    it('should reconnect on disconnect after specified interval', function (done) {
      var config = { reconnectInterval: 10 }
        , socketCaptain = createSocketCaptain(null, logger, config)
        , client = socketCaptain.run()

      client.emit('close')
      setTimeout(function () {
        socketStub.calledTwice.should.equal(true)
        done()
      }, 10)
    })

    it('should reconnect on disconnect after default interval', function (done) {
      this.timeout(4000)
      var socketCaptain = createSocketCaptain(null, logger, {})
        , client = socketCaptain.run()

      client.emit('close')
      setTimeout(function () {
        socketStub.calledTwice.should.equal(true)
        done()
      }, 3000)
    })

    it('should connect to the default admiral if no connection details provided', function () {
      var socketCaptain = createSocketCaptain(null, logger, {})

      socketCaptain.run()
      socketStub.calledWith('http://127.0.0.1:8006').should.equal(true)
    })

    it('should connect to the provided admiral when given connection details', function () {
      var config = { admiral: { host: 'http://127.0.0.2', port: '8001' } }
        , socketCaptain = createSocketCaptain(null, logger, config)

      socketCaptain.run()
      socketStub.calledWith('http://127.0.0.2:8001').should.equal(true)
    })

  })

})
