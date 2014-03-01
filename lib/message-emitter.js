module.exports = function messageEmitter(serviceLocator) {

  function emitRegisterMessage(client) {
    var data =
      { appId: serviceLocator.config.appId
      , captainName: serviceLocator.config.name
      }
    emit(client, 'captainRegister', data)
  }

  function emitOrderMessage(client, clientId, message) {
    serviceLocator.logger.info('Emitting message: ' + message)
    var data =
      { message: message
      , captainName: serviceLocator.config.name
      , clientId: clientId
      }
    emit(client, 'captainOrderMessage', data)
  }

  function emit(client, event, data) {
    client.send(event, data)
  }

  return {
    emitRegisterMessage: emitRegisterMessage
  , emitOrderMessage: emitOrderMessage
  }
}
