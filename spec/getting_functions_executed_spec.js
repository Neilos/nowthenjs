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

  describe("executing a function", function () {

    describe("on an object", function () {

      it("with arguments", function () {
        expect(bob.state).toEqual("awake")
        now.get(bob,{to: "sleep"}, "soundly sleeping")
        expect(bob.state).toEqual("soundly sleeping")
      });

      it("without arguments", function () {
        expect(bob.state).toEqual("awake")
        now.get(bob,{to: "sleep"})
        expect(bob.state).toEqual("asleep")
      });

    });

    describe("borrowed from another object", function () {

      it("with arguments", function () {
        expect(freddy.state).toEqual(undefined)
        now.get(freddy,{to: "sleep", acting_as: bob}, "soundly sleeping")
        expect(freddy.state).toEqual("soundly sleeping")
      });

      it("without arguments", function () {
        expect(freddy.state).toEqual(undefined)
        now.get(freddy,{to: "sleep", acting_as: bob})
        expect(freddy.state).toEqual("asleep")
      });

    });

  });

});
