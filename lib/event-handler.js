module.exports = function eventHandler(serviceLocator) {

  function handleEvents(client) {

    client.on('serverMessage', function (data) {
      serviceLocator.logger.info('Admiral: ' + data.message)
    })

    client.on('makeCaptainMessage', function (data) {
      serviceLocator.logger.info('Now master Captain for: ' + data.appId + ' ' + data.environment)
      serviceLocator.stateHandler.setMasterState(data.appId, data.environment, true)
    })

  }

  return {
    handleEvents: handleEvents
  }

}
