module.exports = function orderExecuter(serviceLocator) {

  var stepArguments = {}

  function execute(data, client, callback) {

    var order = serviceLocator.orderManager.getOrder(data.order)
      , steps = order.getSteps()
      , emit = serviceLocator.messageEmitter.emitOrderMessage.bind(this, client, data.clientId)
      , stepContext =
        { orderArgs: data.orderArgs
        , appId: data.appId
        , appData: data.appData
        , emit: emit
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
        delete stepArguments[data.clientId]
      // otherwise store arguments to be used as input for next step
      } else {
        stepArguments[data.clientId] = args
      }

      callback({ success: true })
    }

    var args = []
    // pass through stored arguments if we have run a previous step
    if (stepArguments[data.clientId]) {
      args = stepArguments[data.clientId]
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
