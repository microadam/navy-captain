module.exports = function requestSender(serviceLocator) {

  function sendExecuteOrder(client, clientId, appId, environment, order, orderArgs, callback) {
    serviceLocator.logger.info('Executing order: ' + order)
    var data =
      { appId: appId
      , environment: environment
      , clientId: clientId
      , order: order
      , orderArgs: orderArgs
      }
    request(client, 'captainExecuteOrder', data, callback)
  }

  function request(client, event, data, callback) {
    client.send(event, data, callback)
  }

  return {
    sendExecuteOrder: sendExecuteOrder
  }
}
