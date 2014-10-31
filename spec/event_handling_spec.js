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

  describe("`now.when` and `now.announce`", function () {

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

      describe("previously specified function responses", function () {
        var procrastinator, goGetter, procrastinatorResponse, competitor

        beforeEach(function () {
          procrastinator = {
            state: "chilling",
            ceaseChilling: function () {
              this.state = "active"
            }
          }
          goGetter = {}
          procrastinatorResponse = now.when(goGetter, "isDoingImportantThings", procrastinator.ceaseChilling.bind(procrastinator))
        })

        it("can be forgotten", function () {
          expect(procrastinator.state).toEqual("chilling")
          now.announce(goGetter, "isDoingImportantThings")
          expect(procrastinator.state).toEqual("active")

          procrastinator.state = "chilling" // reset state
          expect(procrastinator.state).toEqual("chilling")
          procrastinatorResponse.forgetAboutIt()
          now.announce(goGetter, "isDoingImportantThings")
          expect(procrastinator.state).toEqual("chilling")
        })

        it("can be forgotten without affecting other responses", function () {
          competitor = Object.create(procrastinator)
          now.when(goGetter, "isDoingImportantThings", competitor.ceaseChilling.bind(competitor))
          procrastinatorResponse.forgetAboutIt()
          now.announce(goGetter, "isDoingImportantThings")
          expect(procrastinator.state).toEqual("chilling")
          expect(competitor.state).toEqual("active")
        })

      })

    })

  })

  describe("`then.when` and `then.announce`", function () {

    it("return bound versions of `now.when` and `now.announce`", function () {
      var boundWhen = then.when(husband, "hasCheated", wife.divorce.bind(wife, husband))
      expect(wife.marital_status).toEqual("married")

      expect(typeof boundWhen).toEqual('function')

      var boundAnnounce = then.announce(husband, "hasCheated")
      expect(wife.marital_status).toEqual("married") // unchanged
      expect(typeof boundAnnounce).toEqual('function')

      boundAnnounce()
      expect(wife.marital_status).toEqual("married") // still unchanged

      boundWhen()
      expect(wife.marital_status).toEqual("married") // still unchanged

      boundAnnounce()
      expect(wife.marital_status).toEqual("single") // now it changes
    })

  })

})
