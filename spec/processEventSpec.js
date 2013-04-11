describe("FL_BETTER.processEvent", function () {
  describe('start and end times', function () {
    beforeEach(function () {
      this.datetime = '2013-04-13 15:00'
      setFixtures(
        '<meta content="' + this.datetime + 'Z" itemprop="startDate">' +
        '<meta content="' + this.datetime + 'Z" itemprop="endDate">'
      );
    });

    it("should set the start date from the startDate element", function () {
      FL_BETTER.processEvent();
      expect($('.dtstart abbr.value')).toHaveAttr('title', this.datetime)
    });

    it("should set the end date from the endDate element", function () {
      var datetime = '2013-04-13 15:00'
      FL_BETTER.processEvent();
      expect($('.dtend abbr.value')).toHaveAttr('title', this.datetime)
    });
  });
});