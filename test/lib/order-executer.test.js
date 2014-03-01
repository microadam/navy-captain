var sinon = require('sinon')
  , async = require('async')
  , messageEmitter = { emitOrderMessage: function () {} }
  , createOrderExecuter = require('../../lib//order-executer')

function getOrderExecuter(steps) {
  var stepObj = {}

  steps.forEach(function (step, index) {
    stepObj['step' + index] = step
  })

  var order =
        { getSteps: function () {
            return stepObj
          }
        }
      , orderManager = { getOrder: function () { return order } }
      , serviceLocator =
          { orderManager: orderManager
          , messageEmitter: messageEmitter
          }
      , orderExecuter = createOrderExecuter(serviceLocator)

  return orderExecuter
}

describe('order-executer', function () {

  describe('execute', function () {

    it('should successfuly execute a series of steps and cleanup afterwards', function (done) {
      var stepOne = sinon.stub()
        , stepTwo = sinon.stub()
        , stepThree = sinon.stub()
      stepOne.callsArgWith(1, null, 'endStepOne')
      stepTwo.callsArgWith(2, null, 'endStepTwo')
      stepThree.callsArgWith(2, null)

      var orderExecuter = getOrderExecuter([ stepOne, stepTwo, stepThree ])

      async.series
      ( [ function (seriesCallback) {
            var data = { step: 'step0', clientId: '1' }
            orderExecuter.execute(data, null, function (response) {
              stepOne.calledWith(sinon.match.object, sinon.match.func).should.equal(true)
              response.success.should.equal(true)
              seriesCallback()
            })
          }
        , function (seriesCallback) {
            var data = { step: 'step1', clientId: '1' }
            orderExecuter.execute(data, null, function (response) {
              stepTwo.calledWith(sinon.match.object, 'endStepOne').should.equal(true)
              response.success.should.equal(true)
              seriesCallback()
            })
          }
        , function (seriesCallback) {
            var data = { step: 'step2', clientId: '1' }
            orderExecuter.execute(data, null, function (response) {
              stepThree.calledWith(sinon.match.object, 'endStepTwo').should.equal(true)
              response.success.should.equal(true)
              seriesCallback()
            })
          }
        ]
      , function () {
          var data = { step: 'step0', clientId: '1' }
          // Re run step one to ensure cleanup has occured
          orderExecuter.execute(data, null, function (response) {
            stepOne.calledWith(sinon.match.object, sinon.match.func).should.equal(true)
            response.success.should.equal(true)
            done()
          })
        }
      )
    })

    it('should exit on unsuccessful step', function (done) {
      var stepOne = sinon.stub()
      stepOne.callsArgWith(1, { message: 'ERROR' })
      var orderExecuter = getOrderExecuter([ stepOne ])
        , data = { step: 'step0' }

      orderExecuter.execute(data, null, function (response) {
        stepOne.calledWith(sinon.match.object, sinon.match.func).should.equal(true)
        response.success.should.equal(false)
        response.message.should.equal('ERROR')
        done()
      })
    })

  })

})
