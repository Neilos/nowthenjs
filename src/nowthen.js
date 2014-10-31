(function () {

  if ( typeof Object.prototype.__uniqueId == "undefined" ) {
    var id = 0;
    Object.prototype.__uniqueId = function() {
      if ( typeof this.__uniqueid == "undefined" ) {
        this.__uniqueid = ++id;
      }
      return this.__uniqueid;
    };
  }

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
      if (object === "anything") {
        if (!eventReactions["anything"]) eventReactions["anything"] = {}
        if (!eventReactions["anything"][event]) eventReactions["anything"][event] = []
        eventReactions["anything"][event].push(executable)
      } else {
        if (!eventReactions[object.__uniqueId()]) eventReactions[object.__uniqueId()] = {}
        if (!eventReactions[object.__uniqueId()][event]) eventReactions[object.__uniqueId()][event] = []
        eventReactions[object.__uniqueId()][event].push(executable)
      }

    },

    announce: function (object, event) {
      if (!eventReactions[object.__uniqueId()] ||
          !eventReactions[object.__uniqueId()][event] ||
          !eventReactions[object.__uniqueId()][event].length === 0) {
        if (!eventReactions["anything"] ||
            !eventReactions["anything"][event] ||
            !eventReactions["anything"][event].length === 0) {
          return;
        } else {
          var thingsToBeDone = eventReactions["anything"][event]
        }
      } else {
        var thingsToBeDone = eventReactions[object.__uniqueId()][event]
      }

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

})();