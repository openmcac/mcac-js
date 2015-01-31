import FactoryGuy from 'factory-guy';
import { testMixin as FactoryGuyTestMixin } from 'factory-guy';
import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import startApp from '../../../helpers/start-app';
import { defineFixture } from 'ic-ajax';

var application,
    testHelper,
    englishService,
    TestHelper = Ember.Object.createWithMixins(FactoryGuyTestMixin);

moduleFor('route:bulletins/new', 'BulletinsNewRoute', {
  needs: ['model:bulletin'],
  setup: function() {
    application = startApp();
    testHelper = TestHelper.setup(application);
    englishService = testHelper.make('group', {
      name: 'English Service',
      slug: 'english-service'
    });
    defineFixture('/api/v1/announcements/latest?group_id=' + englishService.id, {
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
  expect(11);

  testHelper.handleFindQuery('group', ['slug'], [englishService]);
  visit('/english-service/bulletins/new');

  andThen(function() {
    var route = application.__container__.lookup('route:bulletins/new');
    route.store = testHelper.getStore();

    route.model().then(function(model) {
      // it defaults the bulletin name to Sunday Worship Service
      equal(model.get('name'), 'Sunday Worship Service');

      // it sets the group to English Service
      equal(model.get('group'), englishService);

      // it populates bulletin with latest announcements
      var announcements = model.get('announcements');
      announcementEqual(announcements.objectAt(0), {
        id: null,
        description: 'This is the first announcement',
        position: 1
      });
      announcementEqual(announcements.objectAt(1), {
        id: null,
        description: 'This is the second announcement',
        position: 2
      });
      announcementEqual(announcements.objectAt(2), {
        id: null,
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
