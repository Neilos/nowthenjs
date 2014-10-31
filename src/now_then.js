var now = {
  get: function (thisObject, functionConfig) {
    var functionName =  functionConfig['to']
    var definingObject =  functionConfig['imitating'] || thisObject
    var arrayArgs = functionConfig['using'] || []
    var functionArgs = Array.prototype.slice.call(arguments, 2)
    return definingObject[functionName].apply(thisObject, arrayArgs.concat(functionArgs))
  }
}

var then = {
  get: function (thisObject, functionConfig) {
    var functionName =  functionConfig['to']
    var definingObject =  functionConfig['imitating'] || thisObject
    var arrayArgs = functionConfig['using'] || []
    var functionArgs = Array.prototype.slice.call(arguments, 2)
    var boundArgs = arrayArgs.concat(functionArgs)
    return definingObject[functionName].bind.apply(definingObject[functionName], [thisObject].concat(boundArgs))
  }
}