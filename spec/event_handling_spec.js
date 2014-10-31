describe("event handling", function () {
  var hudband, wife, lawyer

  beforeEach(function () {
    husband = {}

    wife = {
      marital_status: 'married',
      divorce: function(husband) {
        this.marital_status = 'single';
      }
    }
  })

  describe("when an event occurs", function () {

    describe("when object AND event are of interest", function () {

      it("specified function responses get executed", function () {
        now.when(husband, "hasCheated", wife.divorce.bind(wife, husband))
        expect(wife.marital_status).toEqual("married")
        now.announce(husband, "hasCheated")
        expect(wife.marital_status).toEqual("single") // changed
      })

      it("specified function responses DONT get executed for other objects of no interest", function () {
        var anotherMan = {}
        now.when(husband, "hasCheated", wife.divorce.bind(wife, husband))
        expect(anotherMan).not.toBe(husband)
        expect(wife.marital_status).toEqual("married")
        now.announce(anotherMan, "hasCheated")
        expect(wife.marital_status).toEqual("married") // unchanged
      })

    })

    describe("when event and 'anything' is of interest", function () {

      beforeEach(function () {
        lawyer = {
          mood: 'sober',
          anticipateClient: function () {
            this.mood = 'gleeful'
          }
        }
      })

      it("specified function responses get executed accordingly", function () {
        expect(lawyer.mood).toEqual("sober")
        now.when("anything", "hasCheated", lawyer.anticipateClient.bind(lawyer))
        expect(lawyer.mood).toEqual("sober")
        now.announce(husband, "hasCheated");
        expect(lawyer.mood).toEqual("gleeful") // changed

        lawyer.mood = 'sober' // reset mood
        expect(lawyer.mood).toEqual("sober")
        now.announce(wife, "hasCheated");
        expect(lawyer.mood).toEqual("gleeful") // changed again
      })

    })

  })

})
