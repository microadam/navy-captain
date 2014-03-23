var should = require('should')
  , bootstrap = require('../bootstrap')

describe('bootstrap', function () {

  it('should load all required modules', function () {
    bootstrap({}, {}, function (serviceLocator) {
      should.exist(serviceLocator.config)
      should.exist(serviceLocator.orderManager)
      should.exist(serviceLocator.socketCaptain)
      should.exist(serviceLocator.messageEmitter)
      should.exist(serviceLocator.orderExecuter)
      should.exist(serviceLocator.eventHandler)
      should.exist(serviceLocator.requestHandler)
      should.exist(serviceLocator.requestSender)
    })
  })

})
