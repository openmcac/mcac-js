import nextService from 'mcac/utils/next-service';

module('nextService');

// Replace this with your real tests.
test('it returns the following Sunday at 9:30 Montreal Time', function() {
  var result = nextService(new Date("2012-12-18T03:51:57-05:00"));
  equal(result.toDate().getTime(),
        new Date("2012-12-23T09:30:00-05:00").getTime());
});


test('it returns the following Sunday at 9:30 Montreal Time (DST)', function() {
  var result = nextService(new Date("2012-10-14T09:32:00-04:00"));
  equal(result.toDate().getTime(),
        new Date("2012-10-21T09:30:00-04:00").getTime());
});

test('it returns the following Sunday when currently Sunday', function() {
  var result = nextService(new Date("2012-12-23T09:32:00-05:00"));
  equal(result.toDate().getTime(),
        new Date("2012-12-30T09:30:00-05:00").getTime());
});

test('it returns the current Sunday when Sunday before 9:30am', function() {
  var result = nextService(new Date("2012-12-23T09:29:00-05:00"));
  equal(result.toDate().getTime(),
        new Date("2012-12-23T09:30:00-05:00").getTime());
});
