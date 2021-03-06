module.exports = function requestHandler(serviceLocator) {

  function handleRequests(client) {

    client.on('request', function (requestData, callback) {
      switch (requestData.request) {

      case 'orderList':
        callback( { orders: serviceLocator.orderManager.getOrderNames() } )
        break;

      case 'orderStepList':
        var steps = serviceLocator.orderManager.getOrderSteps(requestData.order)
        if (!steps) {
          steps = []
        }
        callback( { steps: steps } )
        break;

      case 'orderExecute':
        serviceLocator.orderExecuter.execute(requestData, client, callback)
        break;

      }
    })

  }

  return {
    handleRequests: handleRequests
  }

}
