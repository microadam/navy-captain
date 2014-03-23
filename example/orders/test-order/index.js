module.exports = function test() {

  var steps =
  { foo: foo
  , bar: bar
  , baz: baz
  }

  function getSteps() {
    return steps
  }

  function getStepList() {
    return Object.keys(steps)
  }

  function foo(context, callback) {
    context.emit('This is test order step one for: ' + context.appId)
    context.emit('Provided arguments for this order were ' + context.orderArgs)
    callback(null, 1, 2)
  }

  function bar(context, dataOne, dataTwo, callback) {
    context.emit('This is test order step two for: ' + context.appId)
    context.emit('Argument 1 from previous step is: ' + dataOne )
    context.emit('Argument 2 from previous step is: ' + dataTwo )

    context.emit('###### Running test2')
    context.executeOrder('test1', [ 8, 9 ], function (response) {
      context.emit('test2 response: ' + response.success)
      callback(null, 3, 4)
    })
  }

  function baz(context, dataOne, dataTwo, callback) {
    context.emit('This is test order step three for: ' + context.appId)
    context.emit('Argument 1 from previous step is: ' + dataOne )
    context.emit('Argument 2 from previous step is: ' + dataTwo )
    callback(null)
  }

  return {
    getSteps: getSteps
  , getStepList: getStepList
  }

}
