module.exports = function eventHandler(logger) {

  function handleEvents(client) {

    client.on('serverMessage', function (data) {
      logger.info('Admiral: ' + data.message)
    })

  }

  return handleEvents

}
