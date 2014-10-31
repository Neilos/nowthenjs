(function () {

  var eventReactions = {}

  this.now = {
    get: function (thisObject, functionConfig) {
      var functionName =  functionConfig['to']
      var definingObject =  functionConfig['imitating'] || thisObject
      var arrayArgs = functionConfig['using'] || []
      var functionArgs = Array.prototype.slice.call(arguments, 2)
      return definingObject[functionName].apply(thisObject, arrayArgs.concat(functionArgs))
    },

    when: function (object, event, executable) {
      if (!eventReactions[object]) {
        eventReactions[object] = {}
      }

      if (!eventReactions[object][event]) {
        eventReactions[object][event] = []
      }

      eventReactions[object][event].push(executable)
    },

    announce: function (object, event) {
      if(!eventReactions[object] || !eventReactions[object][event] || !eventReactions[object][event].length === 0) return;
      var thingsToBeDone = eventReactions[object][event]
      thingsToBeDone.forEach(function(item) {
          item();
      });
    }
  }

  this.then = {
    get: function (thisObject, functionConfig) {
      var functionName =  functionConfig['to']
      var definingObject =  functionConfig['imitating'] || thisObject
      var arrayArgs = functionConfig['using'] || []
      var functionArgs = Array.prototype.slice.call(arguments, 2)
      var boundArgs = arrayArgs.concat(functionArgs)
      return definingObject[functionName].bind.apply(definingObject[functionName], [thisObject].concat(boundArgs))
    }
  }

})()