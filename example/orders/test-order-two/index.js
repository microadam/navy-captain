module.exports = function test() {

  var steps =
  { foo: foo
  }

  function getSteps() {
    return steps
  }

  function getStepList() {
    return Object.keys(steps)
  }

  function foo(context, callback) {
    context.emit('This is a SUB ORDER')
    callback(null)
  }

  return {
    getSteps: getSteps
  , getStepList: getStepList
  }

}
