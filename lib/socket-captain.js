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

module.exports = function createCaptainSocket(serviceLocator) {

  // TODO: handle running multiple orders at the same time

  function run() {
    var admiralHost = serviceLocator.config.admiral && serviceLocator.config.admiral.host || 'http://127.0.0.1'
      , admiralPort = serviceLocator.config.admiral && serviceLocator.config.admiral.port || '8006'
      , client = new Socket(admiralHost + ':' + admiralPort, { strategy: false })

    client.on('open', function () {
      serviceLocator.messageEmitter.emitRegisterMessage(client)
      serviceLocator.eventHandler.handleEvents(client)
      serviceLocator.requestHandler.handleRequests(client)
    })

    client.on('close', function () {
      reconnect()
    })

    return client
  }

  function reconnect() {
    if (!serviceLocator.config.reconnectInterval) {
      serviceLocator.config.reconnectInterval = 3000
    }

    var timeout = serviceLocator.config.reconnectInterval / 1000
      , msg = 'WebSocket connection failed, retrying in ' + timeout + ' seconds...'

    serviceLocator.logger.info(msg)
    setTimeout(run, serviceLocator.config.reconnectInterval)
  }

  return {
    run: run
  }

}
