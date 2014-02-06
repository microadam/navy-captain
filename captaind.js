#!/usr/bin/env node
var app = require('commander')
  , path = require('path')
  , bunyan = require('bunyan')
  , logger = bunyan.createLogger({ name: 'captaind' })
  , createOrderManager = require('./lib/order-manager')
  , createSocketCaptain = require('./lib/socket-captain')

app.unknownOption = function (arg) {
  console.log('')
  console.log('  Unknown option "' + arg + '"')
  app.help()
  process.exit(0)
}

app
  .version(require('./package.json').version)
  .option('-c, --config [./config.js]', 'path to config file [./config.js]', './config.js')

app.parse(process.argv)

var configPath = path.resolve(app.config)
  , config = null
try {
  config = require(configPath)()
} catch (e) {
  logger.error('No valid config file found')
}

if (config) {
  var orderManager =
      createOrderManager
      ( logger
      , config
      )
    , socketCaptain = createSocketCaptain(orderManager, logger, config)

  orderManager.loadOrders(function (loaded) {
    if (loaded) {
      socketCaptain.run()
    }
  })
}
