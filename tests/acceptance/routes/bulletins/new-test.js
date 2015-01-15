import FactoryGuy from 'factory-guy';
import { testMixin as FactoryGuyTestMixin } from 'factory-guy';
import Ember from 'ember';
import startApp from '../../../helpers/start-app';

var application,
    testHelper,
    store,
    make,
    englishService,
    TestHelper = Ember.Object.createWithMixins(FactoryGuyTestMixin);

module('Acceptance: Route - bulletins/new', {
  needs: ['model:bulletin'],
  setup: function() {
    application = startApp();
    testHelper = TestHelper.setup(application);
    englishService = testHelper.make('group', {
      name: 'English Service',
      slug: 'english-service'
    });
  },
  teardown: function() {
    Ember.run(function() {
      testHelper.teardown();
    });
    Ember.run(application, 'destroy');
  }
});

test('it populates a default bulletin', function() {
  expect(5);

  testHelper.handleFindQuery('group', ['slug'], [englishService]);
  visit('/english-service/bulletins/new');

  andThen(function() {
    // it defaults the bulletin name to Sunday Worship Service
    var route = application.__container__.lookup('route:bulletins/new');
    var tuesday = "2012-12-18T03:51:57-05:00";
    var model = route.model(tuesday);
    equal(model.get('name'), 'Sunday Worship Service');

    // it sets the group to English Service
    // equal(model.get('group'), englishService);

    // publishedAt is the following sunday @ 9:30
    publishedAtEqualsOnDate(new Date("2012-12-23T09:30:00-05:00"),
                            new Date("2012-12-18T03:51:57-05:00"), // tuesday
                            route);

    // publishedAt is next Sunday when currently Sunday (DST)
    publishedAtEqualsOnDate(new Date("2012-10-21T09:30:00-04:00"),
                            new Date("2012-10-14T09:32:00-04:00"),
                            route);

    // publishedAt is next Sunday when currently Sunday
    publishedAtEqualsOnDate(new Date("2012-12-30T09:30:00-05:00"),
                            new Date("2012-12-23T09:32:00-05:00"),
                            route);

    // publishedAt is current Sunday when not yet 9:30am
    publishedAtEqualsOnDate(new Date("2012-12-23T09:30:00-05:00"),
                            new Date("2012-12-23T09:29:00-05:00"),
                            route);
  });
});

function publishedAtEqualsOnDate(expected, currentTime, route) {
  var model = route.model(currentTime);
  var publishedAt = model.get('publishedAt').getTime();
  equal(model.get('publishedAt').getTime(), expected.getTime());
}
