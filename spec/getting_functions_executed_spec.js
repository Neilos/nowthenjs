describe("Getting functions executed", function () {
  var bob, freddy;

  beforeEach(function () {
    bob = {
      sleep: function (state) {
        var newState = state || "asleep"
        this.state = newState;
      },
      state: "awake"
    }
    freddy = {}
  });

  describe("when function is defined on object acting as 'this'", function () {

    it("can execute with arguments", function () {
      expect(bob.state).toEqual("awake")
      now.get(bob,{to: "sleep"}, "soundly")
      expect(bob.state).toEqual("soundly")
    });

    it("can execute without arguments", function () {
      expect(bob.state).toEqual("awake")
      now.get(bob,{to: "sleep"})
      expect(bob.state).toEqual("asleep")
    });

  });

  describe("when function is borrowed from another object", function () {

    it("can execute with arguments", function () {
      expect(freddy.state).toEqual(undefined)
      now.get(freddy,{acting_as: bob, to: "sleep"}, "soundly")
      expect(freddy.state).toEqual("soundly")
    });

    it("can execute without arguments", function () {
      expect(freddy.state).toEqual(undefined)
      now.get(freddy,{acting_as: bob, to: "sleep"})
      expect(freddy.state).toEqual("asleep")
    });

  });

});
