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

    beforeEach(function () {
      socketStub = sinon.stub()
      socketStub.returns(new Socket())

      /* jshint camelcase: false */
      createSocketCaptain.__set__({ Socket: socketStub })
    })

    it('should emit register event and handle events and requests on server connection', function () {
      var mockMessageEmitter = sinon.mock(messageEmitter)
        , handleEvents = sinon.spy()
        , handleRequests = sinon.spy()
        , resetMasterState = sinon.spy()
        , serviceLocator =
            { logger: logger
            , messageEmitter: messageEmitter
            , eventHandler: { handleEvents: handleEvents }
            , requestHandler: { handleRequests: handleRequests }
            , stateHandler: { resetMasterState: resetMasterState }
            , config: {}
            }
        , socketCaptain = createSocketCaptain(serviceLocator)
        , client = socketCaptain.run()

      mockMessageEmitter.expects('emitRegisterMessage').once()

      client.emit('open')
      handleEvents.calledOnce.should.equal(true)
      handleRequests.calledOnce.should.equal(true)
      resetMasterState.calledOnce.should.equal(true)
      mockMessageEmitter.verify()
    })

    it('should reconnect on disconnect after specified interval', function (done) {
      var config = { reconnectInterval: 10 }
        , socketCaptain = createSocketCaptain({ logger: logger, config: config })
        , client = socketCaptain.run()

      client.emit('close')
      setTimeout(function () {
        socketStub.calledTwice.should.equal(true)
        done()
      }, 10)
    })

    it('should reconnect on disconnect after default interval', function (done) {
      this.timeout(4000)
      var socketCaptain = createSocketCaptain({ logger: logger, config: {} })
        , client = socketCaptain.run()

      client.emit('close')
      setTimeout(function () {
        socketStub.calledTwice.should.equal(true)
        done()
      }, 3000)
    })

    it('should connect to the default admiral if no connection details provided', function () {
      var socketCaptain = createSocketCaptain({ logger: logger, config: {} })

      socketCaptain.run()
      socketStub.calledWith('http://none:none@127.0.0.1:8006').should.equal(true)
    })

    it('should connect to the provided admiral when given connection details', function () {
      var config = { admiral: { host: '127.0.0.2', port: '8001', user: 'test', password: 'test' } }
        , socketCaptain = createSocketCaptain({ logger: logger, config: config })

      socketCaptain.run()
      socketStub.calledWith('http://test:test@127.0.0.2:8001').should.equal(true)
    })

  })

})
