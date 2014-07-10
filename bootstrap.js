var serviceLocator = require('service-locator').createServiceLocator()
  , createOrderManager = require('./lib/order-manager')
  , createSocketCaptain = require('./lib/socket-captain')
  , createEventHandler = require('./lib/event-handler')
  , createOrderExecuter = require('./lib/order-executer')
  , createRequestHandler = require('./lib/request-handler')
  , createMessageEmitter = require('./lib/message-emitter')
  , createRequestSender = require('./lib/request-sender')
  , createStateHandler = require('./lib/state-handler')

module.exports = function bootstrap(logger, config, callback) {
  serviceLocator.register('logger', logger)

  var socketCaptain = createSocketCaptain(serviceLocator, config)
    , orderManager = createOrderManager(serviceLocator, config)
    , eventHandler = createEventHandler(serviceLocator)
    , messageEmitter = createMessageEmitter(serviceLocator, config)
    , orderExecuter = createOrderExecuter(serviceLocator)
    , requestHandler = createRequestHandler(serviceLocator)
    , requestSender = createRequestSender(serviceLocator)
    , stateHandler = createStateHandler(serviceLocator)

  serviceLocator.register('config', config)
  serviceLocator.register('orderManager', orderManager)
  serviceLocator.register('socketCaptain', socketCaptain)
  serviceLocator.register('messageEmitter', messageEmitter)
  serviceLocator.register('orderExecuter', orderExecuter)
  serviceLocator.register('eventHandler', eventHandler)
  serviceLocator.register('requestHandler', requestHandler)
  serviceLocator.register('requestSender', requestSender)
  serviceLocator.register('stateHandler', stateHandler)

  callback(serviceLocator)
}
