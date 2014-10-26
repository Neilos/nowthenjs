describe("Getting bound functions", function () {
  var chef, amateurCook;

  beforeEach(function () {
    chef = {
      mixCake: function () {
        var newIngredients = Array.prototype.slice.call(arguments)
        this.cakeIngredients = this.cakeIngredients.concat(newIngredients);
      },
      cakeIngredients: [],
      cook: function () {
        if (this.cakeIngredients.length > 0) {
          return "tasty cake with: " + this.cakeIngredients.join();
        } else {
          return "tasty air cake";
        }
      }
    }
    amateurCook = {
      cakeIngredients: []
    }
  });

  describe("when function is defined on object acting as 'this'", function () {

    it("can return a bound function without arguments bound", function () {
      var boundFunction = then.get(chef, {to: "cook"});
      expect(typeof boundFunction).toBe('function')
      expect(boundFunction()).toBe("tasty air cake")
    });

    it("can return a bound function with full argument list bound", function () {
      var boundFunction = then.get(chef, {to: "mixCake"}, "eggs", "flour", "milk", "sugar");
      expect(typeof boundFunction).toBe('function')
      boundFunction()
      expect(chef.cakeIngredients).toEqual(["eggs", "flour", "milk", "sugar"])
    });

    it("can return a bound function with only partial argument list bound", function () {
      var boundFunction = then.get(chef, {to: "mixCake"}, "eggs", "flour");
      expect(typeof boundFunction).toBe('function')
      boundFunction("milk", "sugar")
      expect(chef.cakeIngredients).toEqual(["eggs", "flour", "milk", "sugar"])
    });

  });

  describe("when function is borrowed from another object", function () {

    it("can return a bound function without arguments bound", function () {
      var boundFunction = then.get(amateurCook, {acting_as: chef, to: "cook"});
      expect(typeof boundFunction).toBe('function')
      expect(boundFunction()).toBe("tasty air cake")
    });

    it("can return a bound function with full argument list bound", function () {
      var boundFunction = then.get(amateurCook, {acting_as: chef, to: "mixCake"}, "eggs", "flour", "milk", "sugar");
      expect(typeof boundFunction).toBe('function')
      boundFunction()
      expect(amateurCook.cakeIngredients).toEqual(["eggs", "flour", "milk", "sugar"])
    });

    it("can return a bound function with only partial argument list bound", function () {
      var boundFunction = then.get(amateurCook, {acting_as: chef, to: "mixCake"}, "eggs", "flour");
      expect(typeof boundFunction).toBe('function')
      boundFunction("milk")
      expect(amateurCook.cakeIngredients).toEqual(["eggs", "flour", "milk"])
    });

  });

});
