describe("event handling", function () {
  var hudband, wife, lawyer

  beforeEach(function () {
    husband = {}
  })

  describe("when an event occurs", function () {

    describe("when object AND event are of interest", function () {

      beforeEach(function () {
        wife = {
          marital_status: 'married',
          divorce: function(husband) {
            this.marital_status = 'single';
          }
        }
      })

      it("specified function responses get executed", function () {
        expect(wife.marital_status).toEqual("married")
        now.when(husband, "hasCheated", wife.divorce.bind(wife, husband))
        expect(wife.marital_status).toEqual("married")
        now.announce(husband, "hasCheated")
        expect(wife.marital_status).toEqual("single")
      })

    })

  })

})
