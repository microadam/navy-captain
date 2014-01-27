var fs = require('fs')
  , async = require('async')

module.exports = function orderManager(logger, captainConfig) {

  var orders = {}

  function loadOrders(callback) {
    var orderDir = captainConfig.orderDir

    fs.exists(orderDir + '/node_modules/', function (exists) {
      if (exists) {
        orderDir = orderDir + '/node_modules'
      }

      if (captainConfig && captainConfig.orders) {
        var enabledOrders = Object.keys(captainConfig.orders)
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
    var orderPlugin = captainConfig.orders[orderPluginName]
      , orderModule = orderDir + '/' + orderPluginName + '/index.js'

    fs.exists(orderModule, function (exists) {
      if (exists) {
        var module = require(orderModule)(orderPlugin.config)
        orders[orderPlugin.command] = module
        logger.info('Loaded Order: ' + orderPluginName)
      } else {
        logger.error(orderPluginName + ' does not exist in the specified Order directory: ' + orderDir)
      }
      callback()
    })
  }

  function noPlugins(callback) {
    logger.error('No valid Order Plugins found')
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
