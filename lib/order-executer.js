module.exports = function orderExecuter(serviceLocator) {

  var stepArguments = {}

  function execute(data, client, callback) {

    var stepKey = data.clientId + data.order
      , order = serviceLocator.orderManager.getOrder(data.order)
      , steps = order.getSteps()
      , emit = serviceLocator.messageEmitter.emitOrderMessage.bind(this
        , client
        , data.clientId
        )
      , executeOrder = serviceLocator.requestSender.sendExecuteOrder.bind(this
        , client
        , data.clientId
        , data.appId
        )
      , stepContext =
        { orderArgs: data.orderArgs
        , appId: data.appId
        , appData: data.appData
        , emit: emit
        , executeOrder: executeOrder
        }

    function done() {
      // If we have an error, callback straight away
      if (arguments[0]) {
        return callback({ success: false, message: arguments[0].message })
      }
      var args = []
      delete arguments[0]
      for (var key in arguments) {
        args.push(arguments[key])
      }

      // clear up if this was the last step
      var stepNames = Object.keys(steps)
      if (stepNames.indexOf(data.step) === stepNames.length - 1) {
        delete stepArguments[stepKey]
      // otherwise store arguments to be used as input for next step
      } else {
        stepArguments[stepKey] = args
      }

      callback({ success: true })
    }

    var args = []
    // pass through stored arguments if we have run a previous step
    if (stepArguments[stepKey]) {
      args = stepArguments[stepKey]
    }
    args.unshift(stepContext)
    args.push(done)

    // call function with args
    steps[data.step].apply(this, args)

  }

  return {
    execute: execute
  }
}
