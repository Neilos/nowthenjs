var now = {
  get: function (thisObject, functionConfig) {
    var functionName =  functionConfig['to']
    var definingObject =  functionConfig['acting_as'] || thisObject
    var functionArgs = Array.prototype.slice.call(arguments, 2)
    return definingObject[functionName].apply(thisObject, functionArgs)
  }
}

var then = {
  get: function (thisObject, functionConfig) {
    var functionName =  functionConfig['to']
    var definingObject =  functionConfig['acting_as'] || thisObject
    var boundArgs = Array.prototype.slice.call(arguments, 2)
    return function () {
      var executingArgs = Array.prototype.slice.call(arguments)
      var fullArgs = boundArgs.concat(executingArgs)
      return definingObject[functionName].apply(thisObject, fullArgs)
    }
  }
}