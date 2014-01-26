var Primus = require('primus')
  , Emitter = require('primus-emitter')
  , PrimusResponder = require('primus-responder')
  , Socket = Primus.createSocket
    ( { transformer: 'websockets'
      , parser: 'JSON'
      , plugin:
        { emitter: Emitter
        , responder: PrimusResponder
        }
      }
    )
  , createHandleEvents = require('./event-handler')
  , createOrderExecuter = require('./order-executer')
  , createHandleRequests = require('./request-handler')
  , createMessageEmitter = require('./message-emitter')

module.exports = function createCaptainSocket(orderManager, logger, config) {

  // TODO: config.appId should be able to be an array
  // TODO: handle running multiple orders at the same time

  var handleEvents = createHandleEvents(logger)
    , messageEmitter = createMessageEmitter(logger, config)
    , orderExecuter = createOrderExecuter(orderManager, messageEmitter)
    , handleRequests = createHandleRequests(orderManager, orderExecuter)
    , admiralHost = config.admiral && config.admiral.host || 'http://127.0.0.1'
    , admiralPort = config.admiral && config.admiral.port || '8006'

  function run() {
    var client = new Socket(admiralHost + ':' + admiralPort, { strategy: false })

    client.on('open', function () {
      messageEmitter.emitRegisterMessage(client)
      handleEvents(client)
      handleRequests(client)
    })

    client.on('close', function () {
      reconnect()
    })

    return client
  }

  function reconnect() {
    if (!config.reconnectInterval) {
      config.reconnectInterval = 3000
    }
    logger.info('WebSocket connection failed, retrying in ' + config.reconnectInterval / 1000 + ' seconds...')
    setTimeout(run, config.reconnectInterval)
  }

  return {
    run: run
  }

}
