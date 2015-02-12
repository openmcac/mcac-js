import FactoryGuy from 'factory-guy';
import { testMixin as FactoryGuyTestMixin } from 'factory-guy';
import Ember from 'ember';
import { test } from 'ember-qunit';
import startApp from '../helpers/start-app';
import { defineFixture } from 'ic-ajax';

var application,
    testHelper,
    englishService,
    TestHelper = Ember.Object.createWithMixins(FactoryGuyTestMixin);

module('Acceptance: SundayRedirect', {
  needs: ['model:bulletin', 'model:announcement'],
  setup: function() {
    application = startApp();
    testHelper = TestHelper.setup(application);
    englishService = testHelper.make('group', {
      name: 'English Service',
      slug: 'english-service'
    });
    defineFixture('/api/v1/sunday', {
      response: {
        "bulletins": {
          "id": "1",
          "publishedAt": "2014-12-21T13:58:27-05:00",
          "name": "Sunday Service",
          "serviceOrder": "This is the service order.",
          "description": "This is a service bulletin.",
          "links": {
            "group": "1",
            "announcements": ["1", "2", "3"]
          }
        },
        "linked": {
          "group": {
            "id": "1",
            "slug": "english-service",
            "name": "English Service"
          },
          "announcements": [
            {
              "id": "1",
              "description": "This is the first announcement",
              "bulletin": "1",
              "position": 1
            },
            {
              "id": "2",
              "description": "This is the second announcement",
              "bulletin": "1",
              "position": 2
            },
            {
              "id": "3",
              "description": "This is the third announcement",
              "bulletin": "1",
              "position": 3
            }
          ]
        }
      }
    });
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('app/index.js redirects root path to /sunday', function() {
  expect(1);
  visit('/');

  andThen(function() {
    Ember.run.next(function() {
      equal(currentURL(), '/sunday');
    });
  });
});
