module.exports = function () {

  var config =
  { name: 'captain-one'
  , applications: { testApp: [ 'staging', 'production' ] }
  , admiral: { host: 'http://127.0.0.1', port: 8006 }
  , orderDir: __dirname + '/orders'
  , orders:
    { 'test-order': { command: 'test' }
    , 'test-order-two': { command: 'test2' }
    }
  }

  return config
}
