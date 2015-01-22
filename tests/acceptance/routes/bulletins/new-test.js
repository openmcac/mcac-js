import FactoryGuy from 'factory-guy';
import { testMixin as FactoryGuyTestMixin } from 'factory-guy';
import Ember from 'ember';
import startApp from '../../../helpers/start-app';
import { defineFixture } from 'ic-ajax';

var application,
    testHelper,
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
    defineFixture('/api/v1/announcements/latest', {
      response: {
        "announcements": [
          {
            "id": 1,
            "description": "This is the first announcement",
            "bulletin": 1,
            "post": 1,
            "position": 1
          },
          {
            "id": 2,
            "description": "This is the second announcement",
            "bulletin": 1,
            "post": 2,
            "position": 2
          },
          {
            "id": 3,
            "description": "This is the third announcement",
            "bulletin": 1,
            "post": 3,
            "position": 3
          }
        ]
      }
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
  expect(8);

  testHelper.handleFindQuery('group', ['slug'], [englishService]);
  visit('/english-service/bulletins/new');

  andThen(function() {
    var route = application.__container__.lookup('route:bulletins/new');

    route.modelFor = function() {
      return englishService;
    };

    route.model().then(function(model) {
      // it defaults the bulletin name to Sunday Worship Service
      equal(model.get('name'), 'Sunday Worship Service');

      // it sets the group to English Service
      equal(model.get('group'), englishService);

      var announcements = model.get('announcements');
      announcementEqual(announcements.objectAt(0), {
        description: 'This is the first announcement',
        position: 1
      });
      announcementEqual(announcements.objectAt(1), {
        description: 'This is the second announcement',
        position: 2
      });
      announcementEqual(announcements.objectAt(2), {
        description: 'This is the third announcement',
        position: 3
      });
    });
  });
});

function announcementEqual(announcement, hash) {
  Object.keys(hash).forEach(function(key) {
    equal(announcement.get(key), hash[key]);
  });
}
