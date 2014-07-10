module.exports = function createStateHandler(serviceLocator) {

  var masterState = {}

  function setMasterState(appId, environment, state) {
    if (!masterState[appId]) {
      masterState[appId] = {}
    }
    masterState[appId][environment] = state
  }

  function resetMasterState() {
    Object.keys(serviceLocator.config.applications).forEach(function (appId) {
      var environments = serviceLocator.config.applications[appId]
      environments.forEach(function (environment) {
        setMasterState(appId, environment, false)
      })
    })
  }

  function getMasterState(appId, environment) {
    if (masterState[appId][environment]) {
      return masterState[appId][environment]
    }
    return false
  }

  return {
    setMasterState: setMasterState
  , getMasterState: getMasterState
  , resetMasterState: resetMasterState
  }

}
