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

  var responsesTo = {
    "anything": {}
  }

  var nobodyCaresThat = function (thisThing, isSomething) {
    return (!responsesTo[thisThing] ||
            !responsesTo[thisThing][isSomething] ||
            !responsesTo[thisThing][isSomething].length === 0)
  }

  var nobodyCaresIfAnything = function (isSomething) {
    return (!responsesTo["anything"][isSomething] ||
            !responsesTo["anything"][isSomething].length === 0)
  }

  this.now = {
    get: function (object, config) {
      var functionName =  config['to']
      var definingObject =  config['imitating'] || object
      var arrayArgs = config['using'] || []
      var parameterArgs = Array.prototype.slice.call(arguments, 2)
      return definingObject[functionName].apply(object, arrayArgs.concat(parameterArgs))
    },

    when: function (object, isSomething, doThis) {
      var thisThing = (object === "anything") ? "anything" : object.__uniqueId()
      responsesTo[thisThing] = responsesTo[thisThing] || {}
      responsesTo[thisThing][isSomething] = responsesTo[thisThing][isSomething] || []
      var index = responsesTo[thisThing][isSomething].push(doThis) -1

      // Provide handle for forgetting about response functions
      return {
        forgetAboutIt: function() {
          responsesTo[thisThing][isSomething].splice(index, 1);
        }
      };
    },

    announce: function (object, isSomething) {
      var thisThing = object.__uniqueId()
      if (nobodyCaresThat(thisThing, isSomething)) {
        if (nobodyCaresIfAnything(isSomething)) {
          return;
        } else { thisThing = "anything" }
      }
      responsesTo[thisThing][isSomething].forEach(function(response) {
        response()
      });
    }
  }

  this.then = {
    get: function (thisObject, config) {
      var functionName =  config['to']
      var definingObject = config['imitating'] || thisObject
      var arrayArgs = config['using'] || []
      var functionArgs = Array.prototype.slice.call(arguments, 2)
      var boundArgs = arrayArgs.concat(functionArgs)
      return definingObject[functionName].bind.apply(definingObject[functionName], [thisObject].concat(boundArgs))
    },

    when: function () {
      return now.when.apply.bind(now.when, this, arguments);
    },

    announce: function () {
      return now.announce.apply.bind(now.announce, this, arguments);
    }
  }

})();