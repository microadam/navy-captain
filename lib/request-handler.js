module.exports = function requestHandler(orderManager, orderExecuter) {

  function handleRequests(client) {

    client.on('request', function (requestData, callback) {
      switch (requestData.request) {

      case 'orderList':
        callback( { orders: orderManager.getOrderNames() } )
        break;

      case 'orderStepList':
        callback( { steps: orderManager.getOrderSteps(requestData.order) } )
        break;

      case 'orderExecute':
        orderExecuter.execute(requestData, client, callback)
        break;

      }
    })

  }

  return handleRequests

}
