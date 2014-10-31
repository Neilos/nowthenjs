describe("Getting functions executed", function () {
  var bob, freddy;

  beforeEach(function () {
    bob = {
      sleep: function (state) {
        var newState = state || "asleep"
        this.state = newState;
      },
      state: "awake",
      makeCake: function (ingredient1, ingredient2, ingredient3) {
        return "cake with ingredients: " + ingredient1 + ', ' + ingredient2 + ', ' + ingredient3
      }
    }
    freddy = {}
  });

  describe("when function is defined on object acting as 'this'", function () {

    it("can execute without arguments", function () {
      expect(bob.state).toEqual("awake")
      now.get(bob,{to: "sleep"})
      expect(bob.state).toEqual("asleep")
    });

    it("can execute with arguments", function () {
      expect(bob.state).toEqual("awake")
      now.get(bob,{to: "sleep"}, "soundly")
      expect(bob.state).toEqual("soundly")
    });

    it("can execute with an array of arguments", function () {
      var listOfIngredients = ["eggs", "sugar", "flour"]
      var cake = now.get(bob, {to: "makeCake", using: listOfIngredients})
      expect(cake).toEqual("cake with ingredients: eggs, sugar, flour")
    })

    it("can execute with a mixture of ordinary arguments and an array of arguments", function () {
      var listOfIngredients = ["eggs", "sugar"]
      var cake = now.get(bob, {to: "makeCake", using: listOfIngredients}, "icing")
      expect(cake).toEqual("cake with ingredients: eggs, sugar, icing")
    })

  });

  describe("when function is borrowed from another object", function () {

    it("can execute without arguments", function () {
      expect(freddy.state).toEqual(undefined)
      now.get(freddy,{acting_as: bob, to: "sleep"})
      expect(freddy.state).toEqual("asleep")
    });

    it("can execute with arguments", function () {
      expect(freddy.state).toEqual(undefined)
      now.get(freddy,{acting_as: bob, to: "sleep"}, "soundly")
      expect(freddy.state).toEqual("soundly")
    });

    it("can execute with an array of arguments", function () {
      var listOfIngredients = ["eggs", "sugar", "flour"]
      var cake = now.get(freddy, {acting_as: bob, to: "makeCake", using: listOfIngredients})
      expect(cake).toEqual("cake with ingredients: eggs, sugar, flour")
    })

    it("can execute with a mixture of ordinary arguments and an array of arguments", function () {
      var listOfIngredients = ["eggs", "sugar"]
      var cake = now.get(freddy, {acting_as: bob, to: "makeCake", using: listOfIngredients}, "raisins")
      expect(cake).toEqual("cake with ingredients: eggs, sugar, raisins")
    })

  });

});
