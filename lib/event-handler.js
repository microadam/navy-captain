module.exports = function eventHandler(serviceLocator) {

  function handleEvents(client) {

    client.on('serverMessage', function (data) {
      serviceLocator.logger.info('Admiral: ' + data.message)
    })

  }

  return {
    handleEvents: handleEvents
  }

}
