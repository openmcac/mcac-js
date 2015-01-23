import FactoryGuy from 'factory-guy';
import { testMixin as FactoryGuyTestMixin } from 'factory-guy';
import Ember from 'ember';
import startApp from '../../../helpers/start-app';
import { defineFixture } from 'ic-ajax';

var application,
    testHelper,
    englishService,
    TestHelper = Ember.Object.createWithMixins(FactoryGuyTestMixin);

module('Acceptance: /sunday route', {
  needs: ['model:bulletin', 'model:announcement'],
  setup: function() {
    defineFixture('/api/v1/sunday', {
      response: {
        "bulletin": {
          "id": 1,
          "publishedAt": "2014-12-21T13:58:27-05:00",
          "name": "Sunday Service",
          "serviceOrder": "This is the service order.",
          "description": "This is a service bulletin.",
          "group": 1,
          "announcements": [1, 2, 3]
        },
        "group": {
          "id": 1,
          "slug": "english-service",
          "name": "English Service"
        },
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

test('route returns model from /api/v1/sunday', function() {
  expect(10);
  visit('/sunday');

  andThen(function() {
    var controller = application.__container__
                                .lookup('controller:bulletin/sunday/index');

    // it populates the bulletin attributes
    var model = controller.model;
    equal(model.get('name'), 'Sunday Service');
    equal(model.get('publishedAt').getTime(),
          new Date('2014-12-21T13:58:27-05:00').getTime());

    // it populates the bulletin's group
    var group = model.get('group');
    equal(group.get('name'), 'English Service');
    equal(group.get('slug'), 'english-service');

    // it populates the bulletin's announcements
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

function announcementEqual(announcement, hash) {
  Object.keys(hash).forEach(function(key) {
    equal(announcement.get(key), hash[key]);
  });
}
