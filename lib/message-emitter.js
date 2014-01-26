module.exports = function messageEmitter(logger, captainConfig) {

  function emitRegisterMessage(client) {
    var data =
      { appId: captainConfig.appId
      , captainName: captainConfig.name
      }
    emit(client, 'captainRegister', data)
  }

  function emitOrderMessage(client, clientId, message) {
    logger.info('Emitting message: ' + message)
    var data =
      { message: message
      , captainName: captainConfig.name
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
