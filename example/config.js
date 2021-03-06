module.exports = function () {

  var config =
  { name: 'captain-one'
  , applications: { testApp: [ 'staging', 'production' ] }
  , admiral: { host: '127.0.0.1', port: 8006, user: 'test', password: 'test' }
  , orderDir: __dirname + '/orders'
  , orders:
    { 'test-order': { command: 'test', config: { exampleConfigOption: 'config-option' } }
    , 'test-order-two': { command: 'test2' }
    }
  }

  return config
}
