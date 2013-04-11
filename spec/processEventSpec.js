describe("FL_BETTER.processEvent", function () {
  describe('vevent container class', function () {
    it('should not add the vevent class to the body', function () {
      FL_BETTER.processEvent();
      expect($('body')).not.toHaveClass('vevent');
    });

    it('should add the vevent class to the div that represents the schema.org event', function () {
      setFixtures('<div itemtype="http://schema.org/Event"></div>');
      FL_BETTER.processEvent();
      expect($("div[itemtype='http://schema.org/Event']")).toHaveClass('vevent');
    });
  });

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