var rewire = require('rewire')
  , sinon = require('sinon')
  , logger = { info: noop, error: noop }
  , createOrderManger = rewire('../../lib/order-manager')

function noop() {}

describe('order-manager', function () {

  describe('loadOrders()', function () {

    it('should not load anything when there are no orders in config', function (done) {
      var config = {}
        , orderManager = createOrderManger(logger, config)

      orderManager.loadOrders(function (loaded) {
        loaded.should.equal(false)
        done()
      })
    })

    it('should not load anything when there are orders in config but no files to load', function (done) {
      var config = { orders: { one: {} } }
        , orderManager = createOrderManger(logger, config)

      orderManager.loadOrders(function (loaded) {
        loaded.should.equal(false)
        done()
      })
    })

    it('should load modules from given dir', function (done) {
      var existsStub = sinon.stub()
      existsStub.callsArgWith(1, false)
      existsStub.withArgs('/one/index.js').callsArgWith(1, true)

      var requireStub = sinon.stub()
      requireStub.returns(noop)

      /* jshint camelcase: false */
      createOrderManger.__set__(
        { fs: { exists: existsStub }
        , require: requireStub
        }
      )

      var config =
          { orderDir: ''
          , orders: { one: {} }
          }
        , orderManager = createOrderManger(logger, config)

      orderManager.loadOrders(function (loaded) {
        loaded.should.equal(true)
        requireStub.calledOnce.should.equal(true)
        existsStub.calledWith('/one/index.js').should.equal(true)
        done()
      })
    })

    it('should load modules from node_modules dir', function (done) {
      var existsStub = sinon.stub()
      existsStub.callsArgWith(1, true)

      var requireStub = sinon.stub()
      requireStub.returns(noop)

      /* jshint camelcase: false */
      createOrderManger.__set__(
        { fs: { exists: existsStub }
        , require: requireStub
        }
      )

      var config =
          { orderDir: ''
          , orders: { one: {} }
          }
        , orderManager = createOrderManger(logger, config)

      orderManager.loadOrders(function (loaded) {
        loaded.should.equal(true)
        requireStub.calledOnce.should.equal(true)
        existsStub.calledWith('/node_modules/one/index.js').should.equal(true)
        done()
      })
    })

  })

  describe('getters', function () {

    var orderManager = false

    beforeEach(function (done) {
      var existsStub = sinon.stub()
      existsStub.callsArgWith(1, true)

      var requireStub = sinon.stub()
      requireStub.returns(function () {
        return {
          getStepList: function () {
            return [ 'one' ]
          }
        }
      })

      /* jshint camelcase: false */
      createOrderManger.__set__(
        { fs: { exists: existsStub }
        , require: requireStub
        }
      )

      var config =
          { orderDir: ''
          , orders: { one: { command: 'orderOne' } }
          }
      orderManager = createOrderManger(logger, config)
      orderManager.loadOrders(function () {
        done()
      })
    })

    describe ('getOrderNames()', function () {

      it('should return correct order names', function () {
        var orderNames = orderManager.getOrderNames()
        orderNames.length.should.equal(1)
        orderNames[0].should.equal('orderOne')
      })

    })

    describe ('getOrder()', function () {

      it('should return order with given name', function () {
        var order = orderManager.getOrder('orderOne')
        Object.keys(order).length.should.equal(1)
        Object.keys(order)[0].should.equal('getStepList')
      })

    })

    describe ('getOrderSteps()', function () {

      it('should return order with given name', function () {
        var orderSteps = orderManager.getOrderSteps('orderOne')
        orderSteps.length.should.equal(1)
        orderSteps[0].should.equal('one')
      })

    })

  })

})
