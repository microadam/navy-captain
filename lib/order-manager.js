var fs = require('fs')
  , async = require('async')

module.exports = function orderManager(serviceLocator) {

  var orders = {}

  function loadOrders(callback) {
    var orderDir = serviceLocator.config.orderDir

    fs.exists(orderDir + '/node_modules/', function (exists) {
      if (exists) {
        orderDir = orderDir + '/node_modules'
      }

      if (serviceLocator.config && serviceLocator.config.orders) {
        var enabledOrders = Object.keys(serviceLocator.config.orders)
        async.each
        ( enabledOrders
        , loadPlugin.bind(this, orderDir)
        , function () {
            if (Object.keys(orders).length > 0) {
              callback(true)
            } else {
              noPlugins(callback)
            }
          }
        )
      } else {
        noPlugins(callback)
      }
    })
  }

  function loadPlugin(orderDir, orderPluginName, callback) {
    var orderPlugin = serviceLocator.config.orders[orderPluginName]
      , orderModule = orderDir + '/' + orderPluginName + '/index.js'

    fs.exists(orderModule, function (exists) {
      if (exists) {
        var module = require(orderModule)(orderPlugin.config)
        orders[orderPlugin.command] = module
        serviceLocator.logger.info('Loaded Order: ' + orderPluginName)
      } else {
        var error = orderPluginName + ' does not exist in the specified Order directory: ' + orderDir
        serviceLocator.logger.error(error)
      }
      callback()
    })
  }

  function noPlugins(callback) {
    serviceLocator.logger.error('No valid Order Plugins found')
    callback(false)
  }

  function getOrderNames() {
    return Object.keys(orders)
  }

  function getOrder(orderName) {
    return orders[orderName]
  }

  function getOrderSteps(orderName) {
    return orders[orderName].getStepList()
  }

  return {
    loadOrders: loadOrders
  , getOrderNames: getOrderNames
  , getOrderSteps: getOrderSteps
  , getOrder: getOrder
  }
}
